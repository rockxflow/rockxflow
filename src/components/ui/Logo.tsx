import { cn } from "@/lib/utils";

/**
 * ROCKXFLOW logotype.
 *
 * NOTE FOR HANDOFF: the client's official logo file was not supplied to the
 * workspace, so this is a faithful, non-destructive rebuild of the described
 * identity (silver/white R, blue-gradient F, circuit detail, ROCKXFLOW
 * wordmark with a blue X, tagline). To use the real asset, drop it at
 * `public/brand/rockxflow-logo.svg` (or .png) and flip `USE_CLIENT_ASSET` —
 * every placement in the app resolves through this one component.
 */
export const USE_CLIENT_ASSET = false;
export const CLIENT_ASSET_SRC = "/brand/rockxflow-logo.svg";

/**
 * Shared gradient definitions, rendered once in the root layout so the ids are
 * never duplicated across the many marks on a page. `tone` then only chooses
 * which ink the R uses: silver on dark surfaces, graphite on light ones — a
 * pure silver R disappears against #F7F9FC.
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
  if (USE_CLIENT_ASSET)
    return <img src={CLIENT_ASSET_SRC} alt="Rockxflow" className={className} width={40} height={40} />;
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

export function LogoWord({ tone = "dark", showTagline = false }: { tone?: "dark" | "light"; showTagline?: boolean }) {
  const main = tone === "light" ? "#F5F7FA" : "#0A0F14";
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
          style={{ color: tone === "light" ? "#8FA3B6" : "#66717D" }}
        >
          AUTOMATE • INNOVATE • ELEVATE
        </span>
      ) : null}
    </span>
  );
}

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
    return <img src={CLIENT_ASSET_SRC} alt="Rockxflow" className={cn("w-auto", size === "lg" ? "h-12" : "h-9")} />;
  }
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark className={mark} tone={tone} />
      <LogoWord tone={tone} showTagline={showTagline} />
    </span>
  );
}
