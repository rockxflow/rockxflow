"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

const drains = [
  "Manual lead qualification",
  "Slow follow-ups",
  "Repetitive customer questions",
  "Copy-pasting between tools",
  "Leads lost to nobody's fault",
  "Hand-built weekly reports",
  "Disconnected software",
  "Administration that never ends",
];

const manual = [
  { label: "Manual work", note: "someone opens the inbox" },
  { label: "Copy", note: "details lifted from a PDF" },
  { label: "Paste", note: "into the sheet, again" },
  { label: "Check", note: "is this the latest version?" },
  { label: "Follow up", note: "when someone remembers" },
  { label: "Update", note: "if there is time on Friday" },
];

const system = [
  { label: "Trigger", note: "form, message, email, call" },
  { label: "AI", note: "reads and understands" },
  { label: "Decision", note: "rules + your policy" },
  { label: "Automation", note: "the work gets done" },
  { label: "CRM", note: "clean, complete record" },
  { label: "Notification", note: "right person, instantly" },
  { label: "Follow-up", note: "guaranteed, on schedule" },
];

export function FlowRail({
  steps,
  mode,
  active,
}: {
  steps: { label: string; note: string }[];
  mode: "manual" | "system";
  active: number;
}) {
  return (
    <ol className="relative space-y-2.5" aria-label={mode === "manual" ? "Manual process, step by step" : "Automated process, step by step"}>
      <span
        aria-hidden="true"
        className={cn(
          "absolute left-[1.0625rem] top-3 bottom-3 w-px",
          mode === "manual" ? "border-l border-dashed border-[#c8d3de]" : "bg-[#16283a]"
        )}
      />
      {mode === "system" ? (
        <span
          aria-hidden="true"
          className="absolute left-[1.0625rem] top-3 w-px bg-gradient-to-b from-[#00d9ff] to-[#008cff] transition-[height] duration-500 ease-out"
          style={{ height: `calc(${((active + 1) / steps.length) * 100}% - 1.5rem)` }}
        />
      ) : null}
      {steps.map((s, i) => {
        const isDone = mode === "system" ? i <= active : false;
        return (
          <li key={s.label} className="relative flex items-start gap-3.5 pl-0">
            <span
              aria-hidden="true"
              className={cn(
                "relative z-10 mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg border text-[0.6875rem] font-mono transition-all duration-500",
                mode === "manual"
                  ? "border-[#e3eaf1] bg-white text-[#8b97a3]"
                  : isDone
                    ? "border-[#0f4d7d] bg-[#061421] text-[#7fd8ff] shadow-[0_0_0_3px_rgba(0,140,255,0.10)]"
                    : "border-[#16283a] bg-[#050d16] text-[#40607a]"
              )}
            >
              {String(i + 1).padStart(2, "0")}
              {mode === "system" && i === active ? (
                <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-[#00d9ff] shadow-[0_0_8px_#00d9ff]" />
              ) : null}
            </span>
            <span className="min-w-0 flex-1 border-b border-transparent pb-2.5">
              <span
                className={cn(
                  "block font-display text-[0.9375rem] font-semibold tracking-[-0.01em] transition-colors duration-500",
                  mode === "manual" ? "text-[#414c57]" : isDone ? "text-[#eaf4fb]" : "text-[#63809a]"
                )}
              >
                {s.label}
              </span>
              <span className={cn("mt-0.5 block text-[0.8125rem]", mode === "manual" ? "text-[#8b97a3]" : "text-[#7e97ad]")}>
                {s.note}
              </span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}

export function ProblemSection() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(reduce ? system.length - 1 : 0);
  const [view, setView] = useState<"both" | "manual" | "system">("both");
  const [replayKey, setReplayKey] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => setActive((a) => (a + 1) % (system.length + 2)), 1200);
    return () => window.clearInterval(id);
  }, [reduce, replayKey]);

  return (
    <section id="problem" className="rx-section relative scroll-mt-24 bg-[color:var(--color-canvas)]">
      <div className="rx-shell">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="The problem we remove"
              title="Your Business Shouldn't Run on Repetitive Work."
              support={
                <>
                  Time is not lost to hard problems. It is lost to the same small steps, performed by hand, hundreds of
                  times a month — until “how we do it” just means “whoever is free”.
                </>
              }
            />

            <Reveal delay={0.12}>
              <ul className="mt-10 divide-y divide-[#e4eaf1] border-y border-[#e4eaf1]">
                {drains.map((d, i) => (
                  <li key={d} className="group flex items-center justify-between gap-4 py-3 transition-colors hover:bg-white">
                    <span className="flex items-center gap-3.5">
                      <span className="t-mono w-6 text-[#aab4bf] transition-colors group-hover:text-[#008cff]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-[0.9375rem] font-medium text-[#2b3541]">{d}</span>
                    </span>
                    <span className="t-mono shrink-0 text-[0.625rem] uppercase tracking-[0.14em] text-[#aab4bf] transition-colors group-hover:text-[#f04438]">
                      manual
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="t-body mt-8 max-w-lg">
                None of these steps need a person. They need a trigger, a decision rule and a system that never has an
                off day — which is exactly what we build.
              </p>
            </Reveal>
          </div>

          {/* Before / after */}
          <div className="relative">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-x-3 gap-y-2.5">
              <div className="inline-flex w-full min-w-0 justify-between rounded-xl border border-[#dfe6ee] bg-white p-1 sm:w-auto" role="tablist" aria-label="Compare manual and automated process">
                {(
                  [
                    ["both", "Compare"],
                    ["manual", "Before"],
                    ["system", "After"],
                  ] as const
                ).map(([key, label]) => (
                  <button
                    key={key}
                    role="tab"
                    type="button"
                    aria-selected={view === key}
                    onClick={() => setView(key)}
                    className={cn(
                      "rounded-lg px-3.5 py-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.12em] transition-all duration-300",
                      view === key ? "bg-[#0a0f14] text-white" : "text-[#66717d] hover:text-[#0a0f14]"
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => {
                  setActive(0);
                  setReplayKey((k) => k + 1);
                }}
                className="rx-pill !py-1.5 text-[0.6875rem] font-mono uppercase tracking-[0.12em] transition-colors hover:border-[#008cff] hover:text-[#0a0f14]"
              >
                <Icon name="automate" className="h-3.5 w-3.5 text-[#008cff]" accent={false} strokeWidth={1.7} />
                Replay
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Reveal
                className={cn(
                  "rounded-2xl border border-[#e4eaf1] bg-white p-5 shadow-[var(--shadow-soft)] transition-all duration-500",
                  view === "system" && "sm:col-span-1 sm:opacity-40"
                )}
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="t-eyebrow !text-[#66717d]">Before</span>
                  <span className="t-mono text-[0.625rem] uppercase tracking-[0.12em] text-[#f04438]">hand-driven</span>
                </div>
                <FlowRail steps={manual} mode="manual" active={-1} />
                <p className="t-small mt-4 border-t border-[#eef2f6] pt-3">
                  Every arrow is a person remembering to do something.
                </p>
              </Reveal>

              <Reveal
                delay={0.1}
                className={cn(
                  "relative overflow-hidden rounded-2xl border border-[#12283c] bg-[#050d16] p-5 transition-all duration-500",
                  view === "manual" && "sm:opacity-40"
                )}
                y={18}
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-60"
                  style={{ background: "radial-gradient(circle, rgba(0,140,255,0.28), transparent 65%)" }}
                />
                <div className="mb-4 flex items-center justify-between">
                  <span className="t-eyebrow !text-[#66bfff]">After</span>
                  <span className="t-mono text-[0.625rem] uppercase tracking-[0.12em] text-[#00d9ff]">rockxflow system</span>
                </div>
                <FlowRail steps={system} mode="system" active={active} />
                <p className="mt-4 border-t border-[#12283c] pt-3 text-[0.8125rem] leading-relaxed text-[#8fa8bd]">
                  One trigger sets the whole chain in motion. People see it only where their judgement matters.
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
