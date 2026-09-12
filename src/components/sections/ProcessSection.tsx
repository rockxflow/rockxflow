"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";
import { Cta } from "@/components/ui/Cta";
import { processSteps } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * The engagement, as a machine with eight moving parts.
 * `preview` = compact rail used on the home page.
 * Default = full vertical timeline with scroll progress + expandable detail.
 */
export function ProcessPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 60%"] });
  const width = useTransform(scrollYProgress, [0, 1], ["4%", "100%"]);

  return (
    <section id="process-preview" className="rx-section relative scroll-mt-24 bg-[color:var(--color-canvas)]">
      <div className="rx-shell">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="How we work"
            title="Eight Steps, One Documented System."
            support="No black-box builds. You see the map, the plan, the tests and the handover notes at every stage."
          />
          <Reveal delay={0.1}>
            <Cta href="/process" variant="ghost">
              Full process detail
            </Cta>
          </Reveal>
        </div>

        <div ref={ref} className="relative mt-12">
          <div className="absolute left-0 right-0 top-[1.45rem] hidden h-px bg-[#dde5ed] lg:block" aria-hidden="true" />
          <motion.div
            aria-hidden="true"
            className="absolute left-0 top-[1.45rem] hidden h-px bg-gradient-to-r from-[#0757a8] via-[#008cff] to-[#00d9ff] lg:block"
            style={{ width: reduce ? "100%" : width }}
          />
          <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
            {processSteps.map((s, i) => (
              <Reveal key={s.n} delay={Math.min(i * 0.05, 0.28)}>
                <li className="group relative">
                  <span className="relative z-10 mb-3 hidden h-[1.8rem] items-end lg:flex">
                    <span className="grid h-[1.8rem] w-[1.8rem] place-items-center rounded-full border border-[#dde5ed] bg-white font-mono text-[0.625rem] text-[#66717d] transition-all duration-500 group-hover:border-[#008cff] group-hover:text-[#0757a8] group-hover:shadow-[0_0_0_5px_rgba(0,140,255,0.08)]">
                      {s.n}
                    </span>
                  </span>
                  <p className="t-mono mb-1.5 flex items-center gap-2 text-[#0757a8] lg:hidden">
                    {s.n}
                    <span className="h-px flex-1 bg-[#e4eaf1]" />
                    <span className="text-[#96a2ae]">{s.duration}</span>
                  </p>
                  <h3 className="font-display text-[1.0625rem] font-bold tracking-[-0.02em] text-[#0a0f14]">{s.title}</h3>
                  <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-[#66717d]">{s.subtitle}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

export function ProcessTimeline() {
  const [open, setOpen] = useState(0);
  const [active, setActive] = useState(0);
  const refs = useRef<Array<HTMLLIElement | null>>([]);
  const wrap = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: wrap, offset: ["start 70%", "end 75%"] });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0.02, 1]);

  useEffect(() => {
    const els = refs.current.filter(Boolean) as HTMLLIElement[];
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
        }),
      { rootMargin: "-38% 0px -46% 0px", threshold: 0.01 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} className="relative mt-14 grid gap-8 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] lg:gap-12">
      {/* Sticky progress dial */}
      <div className="hidden lg:block">
        <div className="sticky top-28 rounded-2xl border border-[#16283a] bg-[#061220]/70 p-5">
          <p className="t-mono uppercase tracking-[0.14em] text-[#66bfff]">Progress</p>
          <p className="mt-3 flex items-baseline gap-1.5 font-display text-[2.25rem] font-extrabold leading-none tracking-[-0.03em] text-[#eaf4fb]">
            {processSteps[active].n}
            <span className="text-[0.9rem] font-semibold text-[#4d6f8a]">/ 08</span>
          </p>
          <p className="mt-1.5 text-[0.875rem] font-semibold text-[#9fdcff]">{processSteps[active].title}</p>
          <p className="mt-1 text-[0.8125rem] leading-relaxed text-[#8fa8bd]">{processSteps[active].subtitle}</p>

          <div className="relative mt-5 flex flex-wrap gap-1.5">
            {processSteps.map((s, i) => (
              <button
                key={s.n}
                type="button"
                onClick={() => {
                  setOpen(i);
                  refs.current[i]?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
                }}
                aria-label={`Jump to step ${s.n}: ${s.title}`}
                className={cn(
                  "h-1.5 flex-1 rounded-full transition-all duration-400",
                  i <= active ? "bg-[#008cff]" : "bg-[#132a3e]",
                  i === open && "bg-[#00d9ff]"
                )}
              />
            ))}
          </div>
          <p className="mt-5 font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-[#4d6f8a]">
            {processSteps[active].duration}
          </p>
        </div>
      </div>

      <div className="relative">
        <span aria-hidden="true" className="absolute left-[1.3125rem] top-6 bottom-6 w-px bg-[#132a3e]" />
        <motion.span
          aria-hidden="true"
          className="absolute left-[1.3125rem] top-6 w-px origin-top bg-gradient-to-b from-[#00d9ff] via-[#0a9cff] to-[#0757a8]"
          style={{ height: "calc(100% - 3rem)", scaleY: reduce ? 1 : scaleY }}
        />
        <ol className="space-y-2.5">
          {processSteps.map((s, i) => {
            const isOpen = open === i;
            return (
              <li
                key={s.n}
                data-i={i}
                ref={(n) => {
                  refs.current[i] = n;
                }}
                className="relative flex items-start gap-4"
              >
                <span
                  className={cn(
                    "relative z-10 mt-3.5 grid h-[2.625rem] w-[2.625rem] shrink-0 place-items-center rounded-xl border font-mono text-[0.6875rem] transition-all duration-500",
                    i <= active ? "border-[#2a76ad] bg-[#08202f] text-[#8fe4ff]" : "border-[#142536] bg-[#050e18] text-[#3c5a72]"
                  )}
                >
                  {s.n}
                  {i === active && !reduce ? <span className="rx-anim-ring absolute inset-0 rounded-xl border border-[#00d9ff]" aria-hidden="true" /> : null}
                </span>

                <div
                  className={cn(
                    "flex-1 overflow-hidden rounded-2xl border transition-all duration-500",
                    isOpen ? "border-[#1d3a52] bg-[#071523]" : "border-[#132335] bg-[#050e18]/70 hover:border-[#1d3a52]"
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-start justify-between gap-4 px-4 py-4 text-left sm:px-5"
                  >
                    <span>
                      <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <h3 className="font-display text-[1.125rem] font-bold tracking-[-0.02em] text-[#eaf4fb]">{s.title}</h3>
                        <span className="text-[0.8125rem] font-medium text-[#66bfff]">{s.subtitle}</span>
                      </span>
                      <span className="mt-1.5 block text-[0.875rem] leading-relaxed text-[#9db4c8]">{s.body}</span>
                    </span>
                    <span className={cn("mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-[#1d3a52] text-[#8fd7ff] transition-transform duration-500", isOpen && "rotate-45")}>
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </span>
                  </button>
                  <div className={cn("grid transition-all duration-500", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                    <div className="overflow-hidden">
                      <div className="flex flex-wrap items-center gap-2 border-t border-[#12283c] px-4 py-3.5 sm:px-5">
                        <span className="t-mono uppercase tracking-[0.12em] text-[#4d6f8a]">You receive</span>
                        {s.outputs.map((o) => (
                          <span key={o} className="rounded-lg border border-[#152a3c] bg-[#04101a] px-2.5 py-1 text-[0.78125rem] text-[#b8d0e2]">
                            {o}
                          </span>
                        ))}
                        <span className="t-mono ml-auto text-[0.5625rem] uppercase tracking-[0.12em] text-[#5f89a8]">{s.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
