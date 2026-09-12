"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

/**
 * Desktop-only pointer accent. A 26px ring trails the cursor and swells over
 * interactive targets. Never intercepts input, never rendered on touch, and
 * disabled entirely for reduced motion.
 */
export function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!fine.matches) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let rx = x;
    let ry = y;
    let scale = 1;
    let target = 1;
    let raf = 0;
    let visible = false;

    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!visible) {
        visible = true;
        if (ring.current) ring.current.style.opacity = "1";
        if (dot.current) dot.current.style.opacity = "1";
      }
      const el = e.target as HTMLElement | null;
      const interactive = !!el?.closest("a, button, [role='tab'], input, select, textarea, [data-cursor='grow']");
      target = interactive ? 1.9 : 1;
    };

    const onLeave = () => {
      visible = false;
      if (ring.current) ring.current.style.opacity = "0";
      if (dot.current) dot.current.style.opacity = "0";
    };

    const tick = () => {
      rx += (x - rx) * 0.16;
      ry += (y - ry) * 0.16;
      scale += (target - scale) * 0.14;
      if (ring.current) ring.current.style.transform = `translate3d(${rx - 13}px, ${ry - 13}px, 0) scale(${scale})`;
      if (dot.current) dot.current.style.transform = `translate3d(${x - 1.5}px, ${y - 1.5}px, 0)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [reduce]);

  if (reduce) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[70] hidden md:block">
      <div
        ref={ring}
        className="absolute left-0 top-0 h-[26px] w-[26px] rounded-full border border-[#008cff]/55 opacity-0 transition-opacity duration-300 will-change-transform"
        style={{ background: "radial-gradient(circle, rgba(0,140,255,0.09), transparent 70%)" }}
      />
      <div ref={dot} className="absolute left-0 top-0 h-[3px] w-[3px] rounded-full bg-[#0a0f14] opacity-0 transition-opacity duration-300 will-change-transform" />
    </div>
  );
}
