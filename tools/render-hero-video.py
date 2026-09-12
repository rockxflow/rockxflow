#!/usr/bin/env python3
"""
Renders the Rockxflow hero film: an original, seamless-looping cinematic
data-flow animation composited from the art-directed plates in assets-raw.

Pipeline: numpy/PIL compositing -> rawvideo piped straight into ffmpeg
(720p H.264 MP4 + 1080p poster stills). No third-party stock footage.
"""
from __future__ import annotations

import math
import os
import subprocess
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

try:  # fall back to the ffmpeg binary bundled with imageio-ffmpeg
    import imageio_ffmpeg

    FFMPEG = os.environ.get("FFMPEG_BIN", imageio_ffmpeg.get_ffmpeg_exe())
except Exception:
    FFMPEG = os.environ.get("FFMPEG_BIN", "ffmpeg")

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW = os.path.join(ROOT, "assets-raw")
OUT = os.path.join(ROOT, "public", "media")

W, H = 1280, 720
FPS = 24
SECONDS = 12.0
N = int(FPS * SECONDS)  # 288 frames -> t in [0,1) loops seamlessly
OVERSCAN = 1.30  # head-room for the camera drift

BLUE = (0.0, 0.55, 1.0)
CYAN = (0.0, 0.85, 1.0)


def load_plate(name: str, scale: float) -> np.ndarray:
    img = Image.open(os.path.join(RAW, name)).convert("RGB")
    tw, th = int(img.width * scale), int(img.height * scale)
    img = img.resize((tw, th), Image.LANCZOS)
    arr = np.asarray(img, dtype=np.float32) / 255.0
    # Film grain is baked into the plates once: texture without the bitrate tax
    # of animated noise, which would triple the file size of a dark ambient loop.
    arr = np.clip(arr + np.random.default_rng(abs(hash(name)) % 2**31).standard_normal(
        arr.shape, dtype=np.float32
    ) * (5.5 / 255.0), 0, 1)
    print(f"  plate {name}: {tw}x{th}", flush=True)
    return np.ascontiguousarray(arr)


def sample(plate: np.ndarray, cx: float, cy: float) -> np.ndarray:
    """Affine crop (bicubic-free, bilinear via PIL) of a W x H window centred on cx,cy."""
    ph, pw = plate.shape[:2]
    x0 = int(round(np.clip(cx - W / 2, 0, pw - W)))
    y0 = int(round(np.clip(cy - H / 2, 0, ph - H)))
    return plate[y0 : y0 + H, x0 : x0 + W]


def bezier(p0, p1, p2, p3, tt):
    tt = np.asarray(tt, dtype=np.float32)
    mt = 1.0 - tt
    return (
        (mt**3)[:, None] * np.array(p0, dtype=np.float32)
        + 3 * (mt**2)[:, None] * tt[:, None] * np.array(p1, dtype=np.float32)
        + 3 * mt[:, None] * (tt**2)[:, None] * np.array(p2, dtype=np.float32)
        + (tt**3)[:, None] * np.array(p3, dtype=np.float32)
    )


# Workflow topology inside the film: 7 stations the energy passes through.
NODE_COUNT = 7
NODE_YS = [0.62, 0.40, 0.72, 0.34, 0.60, 0.30, 0.52]


def build_paths():
    """Small-res (SW x SH) polyline paths used for streak rendering."""
    SW, SH = 320, 180
    paths = []
    for i in range(NODE_COUNT - 1):
        x0, y0 = 24 + (SW - 48) * (i / (NODE_COUNT - 1)), SH * NODE_YS[i]
        x1, y1 = 24 + (SW - 48) * ((i + 1) / (NODE_COUNT - 1)), SH * NODE_YS[i + 1]
        ctrl = [
            (x0 + (x1 - x0) * 0.35, y0),
            (x0 + (x1 - x0) * 0.65, y1),
        ]
        pts = bezier((x0, y0), ctrl[0], ctrl[1], (x1, y1), np.linspace(0, 1, 44))
        paths.append(pts.astype(np.float32))
    nodes = []
    for i in range(NODE_COUNT):
        x = 24 + (SW - 48) * (i / (NODE_COUNT - 1))
        nodes.append((x, SH * NODE_YS[i]))
    return SW, SH, paths, np.array(nodes, dtype=np.float32)


def glow_layer(SW: int, SH: int, draw_fn) -> np.ndarray:
    """Draw at small resolution, blur, upscale -> additive glow buffer."""
    img = Image.new("L", (SW, SH), 0)
    d = ImageDraw.Draw(img)
    draw_fn(d)
    img = img.filter(ImageFilter.GaussianBlur(1.7))
    img = img.resize((W, H), Image.BILINEAR)
    return (np.asarray(img, dtype=np.float32) / 255.0)[..., None]


def main() -> None:
    os.makedirs(OUT, exist_ok=True)
    print("compositing source plates…", flush=True)
    base = load_plate("hero_a.png", OVERSCAN)
    ambient = load_plate("flow_dark.png", OVERSCAN)

    SW, SH, paths, nodes = build_paths()

    # Pre-render one static "wire" buffer that stays lit through the whole loop.
    def draw_wires(d: ImageDraw.ImageDraw) -> None:
        for pts in paths:
            d.line([tuple(p) for p in pts], fill=44, width=1)
        for x, y in nodes:
            d.ellipse([x - 2.6, y - 2.6, x + 2.6, y + 2.6], outline=90, width=1)
        for x, y in nodes:
            d.ellipse([x - 0.9, y - 0.9, x + 0.9, y + 0.9], fill=150)

    wires = glow_layer(SW, SH, draw_wires)

    # Precomputed vignette + grain bank
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    dx, dy = (xx - W / 2) / (W / 2), (yy - H / 2) / (H / 2)
    vig = np.clip(1.0 - 0.46 * (dx * dx * 0.85 + dy * dy), 0.42, 1.0).astype(np.float32)[..., None]
    rng = np.random.default_rng(7)
    _ = rng

    bh, bw = base.shape[:2]
    ah, aw = ambient.shape[:2]

    # A "packet" of light sweeps node -> node; each leg takes 1/NODE legs of the loop.
    legs = len(paths)
    samples_per_leg = 30
    leg_pts = [np.linspace(0, 1, samples_per_leg, dtype=np.float32) for _ in range(legs)]

    enc = subprocess.Popen(
        [
            FFMPEG, "-hide_banner", "-loglevel", "error", "-y",
            "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
            # H.264 — universal fallback, tuned for very dark footage
            "-map", "0:v", "-an", "-c:v", "libx264", "-preset", "slow", "-crf", "30",
            "-profile:v", "high", "-level", "4.0", "-pix_fmt", "yuv420p",
            "-x264-params", "aq-mode=3:aq-strength=1.05:ref=6:keyint=72:min-keyint=24:dither=1",
            "-movflags", "+faststart", "-brand", "isom",
            os.path.join(OUT, "rockxflow-hero-loop.mp4"),
            # VP9 — what modern browsers actually download
            "-map", "0:v", "-an", "-c:v", "libvpx-vp9", "-crf", "38", "-b:v", "0",
            "-deadline", "good", "-cpu-used", "4", "-row-mt", "1", "-tile-columns", "2",
            "-pix_fmt", "yuv420p", "-auto-alt-ref", "1",
            os.path.join(OUT, "rockxflow-hero-loop.webm"),
            # Poster = the true first frame, so the video never "pops" on load
            "-map", "0:v", "-vf", "select=eq(n\\,0)", "-vsync", "0", "-frames:v", "1",
            os.path.join(OUT, "_poster-src.png"),
        ],
        stdin=subprocess.PIPE,
    )
    assert enc.stdin is not None

    print(f"rendering {N} frames at {W}x{H}…", flush=True)
    for f in range(N):
        t = f / N  # 0..1 loop phase

        # --- camera: slow elliptical drift, perfectly periodic ---
        cam_a = 2 * math.pi * t
        cx = bw / 2 + math.sin(cam_a) * (bw - W) * 0.16
        cy = bh / 2 + math.cos(cam_a) * (bh - H) * 0.10
        frame = sample(base, cx, cy).copy()
        amb = sample(ambient, aw / 2 - math.sin(cam_a) * (aw - W) * 0.22, ah / 2 + math.cos(cam_a + 1.1) * (ah - H) * 0.14)

        # --- ambient ribbon breathes through the frame (screen blend) ---
        breathe = 0.16 + 0.10 * math.sin(cam_a * 2)
        frame = 1.0 - (1.0 - frame) * (1.0 - amb * breathe)

        # --- lighting pulse travelling the wires ---
        leg_idx = min(int(t * legs), legs - 1)
        local = t * legs - leg_idx  # 0..1 within the current leg
        eased = local * local * (3 - 2 * local)

        def draw_packet(d: ImageDraw.ImageDraw) -> None:
            pts = paths[leg_idx]
            n_show = max(2, int(eased * samples_per_leg))
            shown = pts[:n_show]
            for k in range(1, len(shown)):
                a = shown[k - 1]
                b = shown[k]
                fade = 0.18 + 0.82 * (k / max(1, len(shown) - 1))
                d.line([tuple(a), tuple(b)], fill=int(150 * fade), width=1)
            head = pts[min(int(eased * samples_per_leg), samples_per_leg - 1)]
            r = 3.4
            d.ellipse([head[0] - r, head[1] - r, head[0] + r, head[1] + r], fill=235)

        # trail keeps the completed legs warm
        def draw_warm(d: ImageDraw.ImageDraw) -> None:
            for i in range(0, leg_idx):
                d.line([tuple(p) for p in paths[i]], fill=70, width=1)
            draw_packet(d)

        pulse = glow_layer(SW, SH, draw_warm)

        # node activation: a node lights as the packet reaches it
        for idx, (nx, ny) in enumerate(nodes):
            phase = idx / legs
            d = (t - phase) * legs
            if 0 <= d <= 1:
                glow = (1 - abs(d - 0.35) / 0.65) if d < 1 else 0.0
                glow = max(0.0, glow)
            else:
                glow = 0.30 + 0.12 * math.sin(cam_a + idx)
            if glow > 0.01:
                rx = (nx + 0.5) / SW * W
                ry = (ny + 0.5) / SH * H
                rad = 4 + 26 * glow
                gx = np.arange(max(0, int(rx - rad)), min(W, int(rx + rad)))
                gy = np.arange(max(0, int(ry - rad)), min(H, int(ry + rad)))
                if len(gx) and len(gy):
                    ddx = (gx[None, :] - rx) / rad
                    ddy = (gy[:, None] - ry) / rad
                    falloff = np.clip(1 - (ddx * ddx + ddy * ddy), 0, 1) ** 2.2
                    tint = np.array(CYAN if idx % 2 else BLUE, dtype=np.float32)
                    frame[gy[0] : gy[-1] + 1, gx[0] : gx[-1] + 1] += (falloff * glow * 0.55)[..., None] * tint

        frame += pulse * np.array(CYAN, dtype=np.float32) * 0.52
        frame += wires * np.array(BLUE, dtype=np.float32) * 0.30

        # --- tone: filmic-ish soft roll-off, gentle blue lift in shadows ---
        frame = frame / (1.0 + frame * 0.42)
        frame = frame * 1.06
        frame *= vig
        frame = frame * np.array([0.94, 0.985, 1.035], dtype=np.float32)

        out8 = (np.clip(frame, 0, 1) * 255.0 + 0.5).astype(np.uint8)
        enc.stdin.write(out8.tobytes())

        if f % 48 == 0:
            print(f"  frame {f}/{N}", flush=True)

    enc.stdin.close()
    if enc.wait() != 0:
        sys.exit("ffmpeg encode failed")

    # Poster stills from the same composite logic (frame 0 + a brighter beat)
    poster = os.path.join(OUT, "_poster-src.png")
    if os.path.exists(poster):
        for name, size, q in (("rockxflow-hero-poster", 1280, 74), ("rockxflow-hero-poster-sm", 768, 72)):
            Image.open(poster).convert("RGB").resize(
                (size, int(size * H / W)), Image.LANCZOS
            ).save(os.path.join(OUT, f"{name}.webp"), "WEBP", quality=q, method=6)
        os.remove(poster)
    for f in ("rockxflow-hero-loop.mp4", "rockxflow-hero-loop.webm"):
        path_ = os.path.join(OUT, f)
        if os.path.exists(path_):
            print(f"wrote public/media/{f}  ({os.path.getsize(path_) / 1_048_576:.2f} MB)")


if __name__ == "__main__":
    main()
