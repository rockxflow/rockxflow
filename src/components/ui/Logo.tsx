import { cn } from "@/lib/utils";

/**
 * ROCKXFLOW logo.
 *
 * The official asset is used verbatim — nothing here redraws, re-types or crops it:
 *   public/brand/rockxflow-logo.png   (1254×1254, its own #010205 background)
 *
 * Two presentations, both showing that same file:
 *   • LogoMark  — the lockup as a rounded tile, for light surfaces (navbar, loader),
 *                 where the square needs an edge of its own.
 *   • LogoLockup — the full lockup unframed, for dark surfaces (footer, 404) where the
 *                 asset's own background dissolves into the section.
 * `USE_CLIENT_ASSET = false` falls back to the earlier vector placeholder; nothing else
 * in the app needs to change because every placement resolves through this file.
 */
export const USE_CLIENT_ASSET = true;
export const CLIENT_ASSET_SRC = "/brand/rockxflow-logo.png";
/** Exact colour of the supplied file's background, so a rounded tile has no seam. */
const ASSET_BG = "#010205";

/**
 * Shared gradient definitions for the fallback vector mark, rendered once in the root
 * layout so the ids are never duplicated across a page. `tone` chooses the ink of the R:
 * silver on dark surfaces, graphite on light ones.
 */
export function BrandDefs() {
  return (
    <svg aria-hidden="true" focusable="false" width="0" height="0" className="pointer-events-none absolute" style={{ position: "absolute" }}>
      <defs>
        <linearGradient id="rx-blue" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#0757A8" />
          <stop offset="0.5" stopColor="#008CFF" />
          <stop offset="1" stopColor="#00D9FF" />
        </linearGradient>
        <linearGradient id="rx-silver" x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#B9C6D4" />
        </linearGradient>
        <linearGradient id="rx-graphite" x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0" stopColor="#8FA0B0" />
          <stop offset="1" stopColor="#16222E" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function LogoMark({
  className,
  animated = false,
  tone = "dark",
}: {
  className?: string;
  animated?: boolean;
  /** `light` = the mark sits on a dark surface; `dark` = on a light one. */
  tone?: "dark" | "light";
}) {
  if (USE_CLIENT_ASSET) {
    return (
      <span
        className={cn("grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-[10px]", className)}
        style={{ background: ASSET_BG }}
      >
        {/* the file is square and shown with object-contain: scaled, never cropped */}
        <img src={CLIENT_ASSET_SRC} alt="" width={1254} height={1254} className="h-full w-full object-contain" decoding="async" />
      </span>
    );
  }
  const ink = tone === "light" ? "url(#rx-silver)" : "url(#rx-graphite)";
  return (
    <svg viewBox="0 0 44 44" className={cn("h-9 w-9", className)} role="img" aria-label="Rockxflow mark" fill="none">
      <path d="M13 33V13h8.4a6.2 6.2 0 0 1 0 12.4H18l6.6 7.6" stroke={ink} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M30.6 13H39M30.6 21.4h5.6" stroke="url(#rx-blue)" strokeWidth="3.2" strokeLinecap="round" />
      <path
        d="M30.6 27.4h3.6a2.4 2.4 0 0 0 2.4-2.4v-3.6"
        stroke="#008CFF"
        strokeWidth="1.3"
        strokeLinecap="round"
        opacity="0.75"
        className={animated ? "rx-anim-pulse" : undefined}
      />
      <circle cx="36.6" cy="31.6" r="1.9" fill="url(#rx-blue)" />
    </svg>
  );
}

/**
 * The official lockup on its own — use this on dark surfaces where the asset's
 * background disappears, so the mark, wordmark and tagline all read as supplied.
 */
export function LogoLockup({ className, alt = "Rockxflow" }: { className?: string; alt?: string }) {
  if (!USE_CLIENT_ASSET) return <LogoMark className={cn("h-12 w-12", className)} tone="light" />;
  return (
    <img
      src={CLIENT_ASSET_SRC}
      alt={alt}
      width={1254}
      height={1254}
      decoding="async"
      className={cn("h-auto w-56 max-w-full object-contain", className)}
      // a hairline frame so the asset's own #010205 field reads as a deliberate plaque
      // on a dark section whose background is a shade different from it
      style={{ borderRadius: 18, border: "1px solid rgba(255,255,255,0.07)", boxShadow: "0 22px 60px -34px rgba(0,0,0,0.95)" }}
    />
  );
}

export function LogoWord({ tone = "dark", showTagline = false }: { tone?: "dark" | "light"; showTagline?: boolean }) {
  /* --rx-brand-ink lets a dark-hero page (see main[data-nav-tone] in globals.css) flip
     the navbar's brand text without the navbar having to know which page it is on. */
  const main = tone === "light" ? "#F5F7FA" : "var(--rx-brand-ink, #0A0F14)";
  return (
    <span className="flex flex-col leading-none">
      <span
        className="font-display text-[1.0625rem] font-extrabold tracking-[-0.01em]"
        style={{ color: main }}
      >
        ROCK
        <span style={{ color: "var(--color-electric)" }}>X</span>
        FLOW
      </span>
      {showTagline ? (
        <span
          className="mt-1 font-mono text-[0.5rem] font-medium tracking-[0.18em]"
          style={{ color: tone === "light" ? "#8FA3B6" : "var(--rx-brand-sub, #66717D)" }}
        >
          AUTOMATE • INNOVATE • ELEVATE
        </span>
      ) : null}
    </span>
  );
}

/**
 * Compact bar/footer lockup: the official mark tile + the agency name set in the site
 * typeface. The supplied file is a tall stacked square, so its own wordmark is only
 * legible at poster size (see LogoLockup); at 44px the name would vanish.
 */
export default function Logo({
  tone = "dark",
  size = "md",
  showTagline = false,
}: {
  tone?: "dark" | "light";
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
}) {
  const mark = { sm: "h-7 w-7", md: "h-9 w-9", lg: "h-12 w-12" }[size];
  if (USE_CLIENT_ASSET) {
    return (
      <span className="flex items-center gap-2.5">
        <LogoMark className={mark} />
        <LogoWord tone={tone} showTagline={showTagline} />
      </span>
    );
  }
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark className={mark} tone={tone} />
      <LogoWord tone={tone} showTagline={showTagline} />
    </span>
  );
}
