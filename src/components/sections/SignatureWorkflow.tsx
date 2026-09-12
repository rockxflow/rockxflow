"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Cta } from "@/components/ui/Cta";
import { signatureWorkflow } from "@/lib/site";
import { cn } from "@/lib/utils";

const kindIcon: Record<string, IconName> = {
  input: "pipeline",
  ai: "agent",
  decision: "spark",
  system: "crm",
  people: "chat",
  channel: "whatsapp",
  outcome: "check",
  insight: "dashboard",
};

const kindLabel: Record<string, string> = {
  input: "capture",
  ai: "reason",
  decision: "decide",
  system: "record",
  people: "notify",
  channel: "reply",
  outcome: "commit",
  insight: "measure",
};

/**
 * SIGNATURE ELEMENT — the lead-to-revenue pipeline, activated step by step as
 * the visitor scrolls. The connector line is drawn from real scroll progress,
 * so pausing mid-scroll leaves the diagram in a truthful state.
 */
export function SignatureWorkflow() {
  const section = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<Array<HTMLLIElement | null>>([]);
  const [active, setActive] = useState(-1);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start 62%", "end 78%"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useEffect(() => {
    const els = stepRefs.current.filter(Boolean) as HTMLLIElement[];
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const i = Number((e.target as HTMLElement).dataset.i);
          setActive((prev) => Math.max(prev, i));
        });
      },
      { rootMargin: "-30% 0px -42% 0px", threshold: 0.01 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section id="workflow" className="rx-dark relative overflow-hidden py-20 scroll-mt-24 md:py-28 lg:py-32">
      <div className="rx-grid absolute inset-0" aria-hidden="true" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[1px]"
        style={{ background: "linear-gradient(to right, transparent, rgba(0,217,255,0.55), transparent)" }}
      />

      <div className="rx-shell relative">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:gap-14">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              tone="dark"
              eyebrow="One workflow, end to end"
              title="What Happens When a Lead Arrives at 11:47pm."
              support="This is the exact sequence a Rockxflow system runs — no human needs to be awake for any of it, and every consequential step still reaches a person."
            />

            <div className="mt-8 rounded-2xl border border-[#152a3c] bg-[#061220]/70 p-5">
              <div className="flex items-center justify-between">
                <span className="t-mono uppercase tracking-[0.14em] text-[#66bfff]">Live position</span>
                <span className="t-mono text-[0.625rem] text-[#4d6f8a]">
                  {active < 0 ? "awaiting trigger" : `${String(active + 1).padStart(2, "0")} / ${String(signatureWorkflow.length).padStart(2, "0")}`}
                </span>
              </div>
              <p className="mt-3 font-display text-[1.125rem] font-bold tracking-[-0.02em] text-[#eaf4fb]">
                {active < 0 ? "Scroll to run the pipeline" : signatureWorkflow[Math.min(active, signatureWorkflow.length - 1)].label}
              </p>
              <div className="mt-4 h-1 overflow-hidden rounded-full bg-[#12283c]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#008cff] to-[#00d9ff] transition-[width] duration-500"
                  style={{ width: `${active < 0 ? 0 : ((active + 1) / signatureWorkflow.length) * 100}%` }}
                />
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <Cta href="/contact?type=strategy-call" variant="onDark" size="sm" event="cta_strategy_call" eventProps={{ placement: "workflow" }}>
                  Build this for us
                </Cta>
                <Cta href="/process" variant="onDark" size="sm" icon="arrow">
                  How we get there
                </Cta>
              </div>
            </div>
          </div>

          {/* The rail */}
          <div ref={section} className="relative">
            <span aria-hidden="true" className="absolute left-[1.3125rem] top-4 bottom-4 w-px bg-[#132a3e]" />
            <motion.span
              aria-hidden="true"
              className="absolute left-[1.3125rem] top-4 w-px origin-top bg-gradient-to-b from-[#00d9ff] via-[#0a9cff] to-[#0757a8]"
              style={{ height: "calc(100% - 2rem)", scaleY: reduce ? 1 : lineScale }}
            />
            <ol className="relative space-y-3">
              {signatureWorkflow.map((s, i) => {
                const lit = active >= i;
                const now = active === i;
                return (
                  <li
                    key={s.label}
                    data-i={i}
                    ref={(n) => {
                      stepRefs.current[i] = n;
                    }}
                    className="flex items-start gap-4"
                  >
                    <span
                      className={cn(
                        "relative z-10 mt-3 grid h-[2.625rem] w-[2.625rem] shrink-0 place-items-center rounded-xl border transition-all duration-600",
                        lit ? "border-[#2a76ad] bg-[#08202f] text-[#8fe4ff]" : "border-[#142536] bg-[#050e18] text-[#3c5a72]"
                      )}
                      style={now && !reduce ? { boxShadow: "0 0 0 5px rgba(0,150,255,0.10), 0 14px 34px -14px rgba(0,190,255,0.55)" } : undefined}
                    >
                      <Icon name={kindIcon[s.kind]} className="h-4.5 w-4.5" accent={false} strokeWidth={1.7} />
                      {now && !reduce ? <span className="rx-anim-ring absolute inset-0 rounded-xl border border-[#00d9ff]" aria-hidden="true" /> : null}
                    </span>

                    <div
                      className={cn(
                        "flex-1 rounded-2xl border px-4 py-3.5 transition-all duration-600 sm:px-5 sm:py-4",
                        lit ? "border-[#1d3a52] bg-[#071523]/85" : "border-[#10202f] bg-[#050e18]/45"
                      )}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className={cn("font-display text-[1.0625rem] font-bold tracking-[-0.02em] transition-colors duration-500", lit ? "text-[#f2f8fd]" : "text-[#638099]")}>
                          <span className={cn("mr-2 t-mono", lit ? "text-[#5fb9e8]" : "text-[#3c5a72]")}>
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          {s.label}
                        </h3>
                        <span
                          className={cn(
                            "rounded-md border px-2 py-0.5 font-mono text-[0.5625rem] uppercase tracking-[0.12em] transition-colors duration-500",
                            lit ? "border-[#24567d] bg-[#0a2133] text-[#8fd7ff]" : "border-[#152232] text-[#41607a]"
                          )}
                        >
                          {kindLabel[s.kind]}
                        </span>
                      </div>
                      <p className={cn("mt-1.5 text-[0.875rem] leading-relaxed transition-colors duration-500", lit ? "text-[#9db4c8]" : "text-[#5f7c94]")}>{s.detail}</p>
                    </div>
                  </li>
                );
              })}
            </ol>

            <div className="mt-4 flex items-center gap-3 rounded-2xl border border-dashed border-[#1c3549] px-4 py-3">
              <Icon name="clock" className="h-4 w-4 text-[#66bfff]" accent={false} strokeWidth={1.7} />
              <p className="text-[0.8125rem] text-[#8fa8bd]">
                Typical elapsed time for the whole chain: under a minute — the response is what customers notice, the
                record is what your team relies on.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
