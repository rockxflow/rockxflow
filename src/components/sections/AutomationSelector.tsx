"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Cta } from "@/components/ui/Cta";
import { automationCategories, site, strategyCallHref } from "@/lib/site";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const icons: IconName[] = ["accelerate", "chat", "pipeline", "spark", "documents"];

/**
 * “What can we automate?” — interactive selector.
 * Tabs with roving focus on desktop, tap-to-expand accordion on mobile.
 */
export function AutomationSelector() {
  const [cat, setCat] = useState(0);
  const [flow, setFlow] = useState(0);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(true);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const reduce = useReducedMotion();
  const active = automationCategories[cat];
  const workflow = active.workflows[flow];

  useEffect(() => {
    if (reduce || !playing) return;
    const id = window.setInterval(() => setStep((s) => (s + 1) % (workflow.steps.length + 1)), 900);
    return () => window.clearInterval(id);
  }, [reduce, playing, cat, flow, workflow.steps.length]);

  const select = (i: number) => {
    setCat(i);
    setFlow(0);
    setStep(0);
    setPlaying(true);
    track("automation_category_view" as never, { category: automationCategories[i].key });
  };

  const onTabKey = (e: React.KeyboardEvent) => {
    if (!["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft", "Home", "End"].includes(e.key)) return;
    e.preventDefault();
    const n = automationCategories.length;
    const next =
      e.key === "Home" ? 0 : e.key === "End" ? n - 1 : e.key === "ArrowDown" || e.key === "ArrowRight" ? (cat + 1) % n : (cat - 1 + n) % n;
    select(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <section id="automate-what" className="rx-section relative bg-white scroll-mt-24">
      <div className="rx-shell">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Interactive"
            title="What Can We Automate?"
            support="Pick the part of your business that hurts. Each one runs through the same shape: a trigger, some understanding, a decision, and an action your team can see."
          />
          <Reveal delay={0.1}>
            <p className="t-small hidden max-w-[15rem] text-right lg:block">
              Example workflows — the real version is mapped to your tools during scoping.
            </p>
          </Reveal>
        </div>

        <div className="mt-11 grid gap-5 lg:grid-cols-[minmax(0,15.5rem)_minmax(0,1fr)] lg:gap-6">
          {/* Category rail */}
          <div role="tablist" aria-label="Business areas" aria-orientation="vertical" className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
            {automationCategories.map((c, i) => {
              const on = cat === i;
              return (
                <button
                  key={c.key}
                  ref={(n) => {
                    tabRefs.current[i] = n;
                  }}
                  role="tab"
                  type="button"
                  id={`cat-tab-${c.key}`}
                  aria-selected={on}
                  aria-controls={`cat-panel-${c.key}`}
                  tabIndex={on ? 0 : -1}
                  onKeyDown={onTabKey}
                  onClick={() => select(i)}
                  className={cn(
                    "group relative flex min-w-[10.5rem] shrink-0 items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-all duration-400 lg:min-w-0 lg:w-full",
                    on
                      ? "border-[#cfe3f7] bg-[#f4f9ff] shadow-[inset_0_1px_0_#fff,0_8px_24px_-16px_rgba(7,87,168,0.45)]"
                      : "border-[#e4eaf1] bg-white hover:border-[#c9dcea] hover:bg-[#fafcfe]"
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-gradient-to-b from-[#00d9ff] to-[#008cff] transition-opacity duration-300",
                      on ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span className={cn("grid h-8 w-8 place-items-center rounded-lg border transition-colors duration-300", on ? "border-[#a8d3f7] bg-white text-[#0a72d6]" : "border-[#e4eaf1] text-[#66717d]")}>
                    <Icon name={icons[i]} className="h-4 w-4" accent={false} strokeWidth={1.7} />
                  </span>
                  <span className="min-w-0">
                    <span className={cn("block font-display text-[0.9375rem] font-bold uppercase tracking-[-0.01em]", on ? "text-[#0a0f14]" : "text-[#414c57]")}>{c.label}</span>
                    <span className="t-mono block truncate text-[0.5625rem] uppercase tracking-[0.1em] text-[#8b97a3]">
                      {c.workflows.length} example flows
                    </span>
                  </span>
                </button>
              );
            })}

            <Reveal delay={0.16} className="hidden lg:block">
              <div className="mt-2 rounded-xl border border-[#e4eaf1] bg-[#f7f9fc] p-4">
                <p className="text-[0.8125rem] leading-relaxed text-[#414c57]">
                  Every flow below is built the same way: <strong className="font-semibold text-[#0a0f14]">trigger → AI → decision → action → record</strong>.
                </p>
                <Cta href={strategyCallHref} size="sm" variant="ghost" className="mt-3 w-full" event="cta_strategy_call" eventProps={{ placement: "selector" }}>
                  Map my process
                </Cta>
              </div>
            </Reveal>
          </div>

          {/* Panel */}
          <Reveal y={18}>
            <div
              id={`cat-panel-${active.key}`}
              role="tabpanel"
              aria-labelledby={`cat-tab-${active.key}`}
              className="relative overflow-hidden rounded-2xl border border-[#132a3e] bg-[#050d16] p-5 sm:p-7"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-70"
                style={{ background: "radial-gradient(circle, rgba(0,140,255,0.22), transparent 62%)" }}
              />
              <div className="relative flex flex-wrap items-start justify-between gap-4">
                <div className="max-w-xl">
                  <h3 className="font-display text-[1.5rem] font-bold leading-tight tracking-[-0.025em] text-[#f2f8fd]">{active.headline}</h3>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-[#9db4c8]">{active.intro}</p>
                </div>
                <div className="flex items-center gap-1.5" role="group" aria-label="Workflow controls">
                  <button
                    type="button"
                    onClick={() => setPlaying((p) => !p)}
                    className="grid h-9 w-9 place-items-center rounded-lg border"
                    style={{ borderColor: "#1d3a52", color: "#8fd7ff" }}
                    aria-pressed={playing}
                    aria-label={playing ? "Pause workflow animation" : "Play workflow animation"}
                  >
                    {playing ? (
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
                        <rect x="6" y="5" width="4" height="14" rx="1" />
                        <rect x="14" y="5" width="4" height="14" rx="1" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
                        <path d="M8 5.5v13l11-6.5z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Workflow chooser */}
              <div className="relative mt-6 flex flex-wrap gap-2">
                {active.workflows.map((w, i) => (
                  <button
                    key={w.name}
                    type="button"
                    onClick={() => {
                      setFlow(i);
                      setStep(0);
                    }}
                    aria-pressed={flow === i}
                    className={cn(
                      "rounded-lg border px-3 py-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.1em] transition-all duration-300",
                      flow === i ? "border-[#2b74ad] bg-[#0b2437] text-[#bfe9ff]" : "border-[#16283a] bg-[#061220]/70 text-[#7e97ad] hover:border-[#24475f] hover:text-[#b6d4ea]"
                    )}
                  >
                    {w.name}
                  </button>
                ))}
              </div>

              {/* Chain */}
              <ol className="relative mt-6 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                <span aria-hidden="true" className="pointer-events-none absolute inset-0 hidden" />
                {workflow.steps.map((s, i) => {
                  const lit = i <= step;
                  return (
                    <li key={s} className="relative">
                      <div
                        className={cn(
                          "flex h-full items-center gap-3 rounded-xl border px-3.5 py-3 transition-all duration-500",
                          lit ? "border-[#26648f] bg-[#0a1f31]" : "border-[#132335] bg-[#06101b]/60"
                        )}
                      >
                        <span
                          className={cn(
                            "grid h-6 w-6 shrink-0 place-items-center rounded-md font-mono text-[0.625rem] transition-all duration-500",
                            lit ? "bg-[#008cff] text-white shadow-[0_0_16px_-4px_rgba(0,180,255,0.85)]" : "bg-[#0e1e2c] text-[#4c6a83]"
                          )}
                        >
                          {i + 1}
                        </span>
                        <span className={cn("text-[0.9rem] font-medium transition-colors duration-500", lit ? "text-[#eaf4fb]" : "text-[#7f97ac]")}>{s}</span>
                        {i === step && !reduce ? <span className="rx-anim-pulse ml-auto h-1.5 w-1.5 rounded-full bg-[#00d9ff]" aria-hidden="true" /> : null}
                      </div>
                      {i < workflow.steps.length - 1 ? (
                        <span aria-hidden="true" className="absolute -right-2 top-1/2 hidden h-px w-2 bg-[#1c3a52] lg:block" />
                      ) : null}
                    </li>
                  );
                })}
              </ol>

              <p className="relative mt-6 border-t border-[#12283c] pt-4 text-[0.875rem] leading-relaxed text-[#9db4c8]">{workflow.detail}</p>

              <div className="relative mt-5 flex flex-wrap items-center gap-3">
                <Cta href={site.whatsapp} variant="onDark" size="sm" icon="whatsapp" event="cta_whatsapp" eventProps={{ placement: "selector" }}>
                  Ask about {active.label.toLowerCase()}
                </Cta>
                <Cta href="/solutions" variant="onDark" size="sm" icon="arrow">
                  Related outcomes
                </Cta>
                <span className="t-mono ml-auto hidden text-[#4d6f8a] sm:block">{workflow.steps.length}-step flow</span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
