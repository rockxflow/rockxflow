"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";
import { Cta } from "@/components/ui/Cta";
import { site, systemOutputs, systemSources } from "@/lib/site";
import { cn } from "@/lib/utils";

type Pt = { x: number; y: number };
type Geo = { w: number; h: number; sources: Pt[]; outputs: Pt[]; core: { l: number; r: number; top: number; bottom: number } };

/**
 * SIGNATURE VISUAL — “from scattered tools to one intelligent system”.
 * Connector curves are measured from the live DOM rather than baked into an
 * image, so the diagram stays accurate at every breakpoint and on resize.
 */
export function SystemSection() {
  const wrap = useRef<HTMLDivElement>(null);
  const core = useRef<HTMLDivElement>(null);
  const sourceRefs = useRef<Array<HTMLLIElement | null>>([]);
  const outRefs = useRef<Array<HTMLLIElement | null>>([]);
  const [geo, setGeo] = useState<Geo | null>(null);
  const [hover, setHover] = useState<number | null>(null);
  const [pulse, setPulse] = useState(0);
  const reduce = useReducedMotion();

  const measure = useCallback(() => {
    const el = wrap.current;
    const c = core.current;
    if (!el || !c) return;
    const box = el.getBoundingClientRect();
    if (box.width < 820) {
      setGeo(null);
      return;
    }
    const cb = c.getBoundingClientRect();
    const edge = (r: DOMRect, side: "right" | "left"): Pt => ({
      x: (side === "right" ? r.right : r.left) - box.left,
      y: r.top + r.height / 2 - box.top,
    });
    setGeo({
      w: box.width,
      h: box.height,
      sources: sourceRefs.current.map((n) => (n ? edge(n.getBoundingClientRect(), "right") : { x: 0, y: 0 })),
      outputs: outRefs.current.map((n) => (n ? edge(n.getBoundingClientRect(), "left") : { x: 0, y: 0 })),
      core: { l: cb.left - box.left, r: cb.right - box.left, top: cb.top - box.top, bottom: cb.bottom - box.top },
    });
  }, []);

  useLayoutEffect(() => {
    measure();
  }, [measure]);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(el);
    window.addEventListener("scroll", onResize, { passive: true });
    void document.fonts?.ready.then(measure).catch(() => undefined);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("scroll", onResize);
    };
  }, [measure]);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => setPulse((p) => (p + 1) % systemSources.length), 950);
    return () => window.clearInterval(id);
  }, [reduce]);

  const curve = (from: Pt, to: Pt) => {
    const dx = Math.max(40, (to.x - from.x) * 0.45);
    return `M ${from.x} ${from.y} C ${from.x + dx} ${from.y}, ${to.x - dx} ${to.y}, ${to.x} ${to.y}`;
  };
  const intoCore = (i: number, n: number): Pt => ({
    x: geo?.core.l ?? 0,
    y: (geo?.core.top ?? 0) + ((i + 0.5) / n) * ((geo?.core.bottom ?? 0) - (geo?.core.top ?? 0)),
  });
  const outOfCore = (i: number, n: number): Pt => ({
    x: geo?.core.r ?? 0,
    y: (geo?.core.top ?? 0) + ((i + 0.5) / n) * ((geo?.core.bottom ?? 0) - (geo?.core.top ?? 0)),
  });

  return (
    <section id="system" className="rx-section rx-dark relative overflow-hidden scroll-mt-24">
      <div className="rx-grid absolute inset-0" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#0f7fd0]/70 to-transparent" aria-hidden="true" />

      <div className="rx-shell relative">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            tone="dark"
            eyebrow="The Rockxflow system"
            title="From Scattered Tools to One Intelligent System."
            support="Your business already generates every signal it needs. The gap is that nothing between them talks — so people do the talking instead."
          />
          <Reveal delay={0.1}>
            <div className="flex flex-wrap gap-2">
              {["Understand", "Decide", "Act", "Record"].map((w, i) => (
                <span
                  key={w}
                  className="rounded-lg border border-[#16283a] bg-[#061220]/70 px-3 py-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-[#8fb8d6]"
                >
                  <span className="text-[#00d9ff]">{String(i + 1).padStart(2, "0")}</span> {w}
                </span>
              ))}
            </div>
          </Reveal>
        </div>

        <div ref={wrap} className="relative mt-14 grid items-stretch gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.02fr)_minmax(0,0.88fr)] lg:gap-7">
          {geo
            ? <svg
                className="pointer-events-none absolute inset-0 z-0 hidden h-full w-full lg:block"
                viewBox={`0 0 ${geo.w} ${geo.h}`}
                aria-hidden="true"
                fill="none"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="rx-in" x1="0" x2="1">
                    <stop offset="0" stopColor="#008cff" stopOpacity="0.08" />
                    <stop offset="0.55" stopColor="#008cff" stopOpacity="0.45" />
                    <stop offset="1" stopColor="#00d9ff" stopOpacity="0.7" />
                  </linearGradient>
                  <linearGradient id="rx-out" x1="0" x2="1">
                    <stop offset="0" stopColor="#00d9ff" stopOpacity="0.6" />
                    <stop offset="1" stopColor="#008cff" stopOpacity="0.1" />
                  </linearGradient>
                </defs>
                {geo.sources.map((s, i) => (
                  <path
                    key={`si${i}`}
                    d={curve(s, intoCore(i, geo.sources.length))}
                    stroke={hover === i ? "#4fd3ff" : "url(#rx-in)"}
                    strokeWidth={hover === i ? 1.8 : 1.1}
                    className={reduce ? undefined : "rx-anim-flow"}
                    style={{ transition: "stroke 240ms ease, stroke-width 240ms ease" }}
                  />
                ))}
                {geo.outputs.map((o, i) => (
                  <path key={`so${i}`} d={curve(outOfCore(i, geo.outputs.length), o)} stroke="url(#rx-out)" strokeWidth={1.2} strokeDasharray="3 7" />
                ))}
                {!reduce &&
                  geo.sources.map((s, i) =>
                    pulse === i ? (
                      <circle key={`pp${i}`} r="2.4" fill="#a9efff">
                        <animateMotion dur="1.1s" path={curve(s, intoCore(i, geo.sources.length))} />
                        <animate attributeName="opacity" values="0;1;0.9;0" dur="1.1s" />
                      </circle>
                    ) : null
                  )}
              </svg>
            : null}

          <Reveal className="relative z-10">
            <div className="h-full">
              <p className="t-eyebrow mb-4 !text-[#7f9cb5]">Where work arrives</p>
              <ul className="grid grid-cols-2 gap-2.5">
                {systemSources.map((s, i) => (
                  <li
                    key={s.label}
                    ref={(n) => {
                      sourceRefs.current[i] = n;
                    }}
                    onMouseEnter={() => setHover(i)}
                    onMouseLeave={() => setHover(null)}
                    tabIndex={0}
                    onFocus={() => setHover(i)}
                    onBlur={() => setHover(null)}
                    className={cn(
                      "relative rounded-xl border px-3 py-2.5 transition-all duration-300",
                      hover === i ? "border-[#2a7fc0] bg-[#0a1c2c]" : "border-[#16283a] bg-[#061220]/80"
                    )}
                    style={{ transform: i % 2 ? "translateY(9px)" : undefined }}
                  >
                    <span className="block text-[0.875rem] font-semibold tracking-[-0.01em] text-[#eaf2f9]">{s.label}</span>
                    <span className="mt-0.5 block font-mono text-[0.5625rem] uppercase tracking-[0.1em] text-[#7e97ad]">{s.note}</span>
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full transition-all duration-300",
                        hover === i ? "bg-[#00d9ff] shadow-[0_0_8px_#00d9ff]" : "bg-[#22405a]"
                      )}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.08} className="relative z-10 h-full">
            <div
              ref={core}
              className="relative flex h-full min-h-[20rem] flex-col justify-between overflow-hidden rounded-2xl border"
              style={{
                borderColor: "#1e3a52",
                background: "linear-gradient(165deg, #0a1c2c 0%, #061220 55%, #040d17 100%)",
                boxShadow: "0 30px 80px -40px rgba(0,140,255,0.45), inset 0 1px 0 rgba(120,190,255,0.12)",
              }}
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-16 opacity-70"
                style={{ background: "linear-gradient(to bottom, rgba(0,180,255,0.18), transparent)" }}
              />
              {!reduce ? (
                <span
                  aria-hidden="true"
                  className="rx-anim-scan pointer-events-none absolute inset-x-0 top-0 h-px"
                  style={{ background: "linear-gradient(to right, transparent, rgba(120,220,255,0.65), transparent)" }}
                />
              ) : null}

              <div className="relative p-5">
                <p className="t-eyebrow !text-[#66bfff]">AI / Automation layer</p>
                <h3 className="mt-2.5 font-display text-[1.375rem] font-bold leading-tight tracking-[-0.02em] text-[#f2f8fd]">
                  The place your process actually lives
                </h3>
                <p className="mt-2 text-[0.875rem] leading-relaxed text-[#9db4c8]">
                  Language models read and reason. Deterministic rules decide. Automations act. Every step writes back
                  to your systems of record.
                </p>
              </div>

              <ul className="relative grid grid-cols-2 gap-2 px-5 pb-5">
                {[
                  { k: "LLM reasoning", v: "intent, extraction, drafting" },
                  { k: "Your rules", v: "thresholds, routing, policy" },
                  { k: "Reliability", v: "retry, dedupe, validation" },
                  { k: "Human gate", v: "approval where it matters" },
                ].map((c) => (
                  <li key={c.k} className="rounded-lg border border-[#152a3c] bg-[#04101a]/80 px-3 py-2.5">
                    <span className="block text-[0.8125rem] font-semibold text-[#dbeaf6]">{c.k}</span>
                    <span className="mt-0.5 block font-mono text-[0.5625rem] uppercase tracking-[0.08em] text-[#6f8ca5]">{c.v}</span>
                  </li>
                ))}
              </ul>

              <div className="relative flex items-center justify-between gap-3 border-t border-[#12283c] px-5 py-3">
                <span className="flex items-center gap-2 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-[#5f7f99]">
                  <Icon name="shield" className="h-3.5 w-3.5 text-[#22c55e]" accent={false} strokeWidth={1.8} />
                  Logged & auditable
                </span>
                <span className="font-mono text-[0.625rem] tracking-[0.1em] text-[#4a7794]">
                  v2 · production
                </span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.16} className="relative z-10">
            <div>
              <p className="t-eyebrow mb-4 !text-[#7f9cb5]">What your team gets</p>
              <ul className="space-y-2.5">
                {systemOutputs.map((o, i) => (
                  <li
                    key={o}
                    ref={(n) => {
                      outRefs.current[i] = n;
                    }}
                    className="flex items-center gap-3 rounded-xl border border-[#152a3c] bg-[#061220]/80 px-3.5 py-3 transition-colors duration-300 hover:border-[#25506f]"
                  >
                    <Icon name="check" className="h-4 w-4 shrink-0 text-[#22c55e]" accent={false} strokeWidth={2} />
                    <span className="text-[0.875rem] font-medium text-[#dceaf6]">{o}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 rounded-xl border border-[#152a3c] bg-[#050e18]/85 p-4">
                <p className="text-[0.8125rem] leading-relaxed text-[#9db4c8]">
                  This is not another tool to maintain. The layer sits on top of what you already run — and hands
                  exceptions to a person instead of hiding them.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Cta href="/solutions" variant="onDark" size="sm">
                    See the outcomes
                  </Cta>
                  <Cta
                    href={site.whatsapp}
                    variant="onDark"
                    size="sm"
                    icon="whatsapp"
                    event="cta_whatsapp"
                    eventProps={{ placement: "system" }}
                  >
                    Talk on WhatsApp
                  </Cta>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
