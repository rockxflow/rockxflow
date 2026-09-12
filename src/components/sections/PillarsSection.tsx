"use client";

import { useState } from "react";
import { useReducedMotion } from "motion/react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Icon, type IconName } from "@/components/ui/Icon";
import { pillars } from "@/lib/site";
import { cn } from "@/lib/utils";

const iconFor: Record<string, IconName> = {
  automate: "automate",
  connect: "connect",
  accelerate: "accelerate",
  scale: "scale",
};

/** Four pillars as an editorial ledger — rows, not cards. */
export function PillarsSection() {
  const [open, setOpen] = useState(0);
  const reduce = useReducedMotion();

  return (
    <section id="pillars" className="rx-section relative bg-white scroll-mt-24">
      <div className="rx-shell">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              eyebrow="Automation pillars"
              title="Four Things Every Good System Does."
              support="We do not sell technology categories. We build towards four outcomes, and every workflow we ship has to earn its place in at least one of them."
            />
            <Reveal delay={0.14}>
              <p className="t-body mt-7 border-l-2 border-[#008cff] pl-4">
                If a proposed automation improves none of these, it is not worth building yet. We say that in scoping
                calls too.
              </p>
            </Reveal>
          </div>

          <RevealGroup className="relative">
            <div className="border-t border-[#e4eaf1]">
              {pillars.map((p, i) => {
                const active = open === i;
                return (
                  <RevealItem key={p.key}>
                    <button
                      type="button"
                      onMouseEnter={() => setOpen(i)}
                      onFocus={() => setOpen(i)}
                      onClick={() => setOpen(i)}
                      aria-expanded={active}
                      className={cn(
                        "group relative -mt-px w-full border-t border-[#e4eaf1] px-1 py-7 text-left transition-colors duration-400 sm:px-4",
                        active && "bg-[#f7fafd]"
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={cn(
                          "absolute left-0 top-0 h-full w-[2px] bg-gradient-to-b from-[#00d9ff] to-[#008cff] transition-transform duration-500",
                          active ? "scale-y-100" : "scale-y-0"
                        )}
                        style={{ transformOrigin: "top" }}
                      />
                      <div className="flex items-start gap-4 sm:gap-6">
                        <span className="t-mono pt-1 text-[#aab4bf] transition-colors duration-300 group-hover:text-[#008cff]">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span
                          className={cn(
                            "grid h-11 w-11 shrink-0 place-items-center rounded-xl border transition-all duration-500",
                            active
                              ? "border-[#bcdcf7] bg-white text-[#0a72d6] shadow-[0_6px_18px_-8px_rgba(0,140,255,0.5)]"
                              : "border-[#e4eaf1] bg-white text-[#66717d]"
                          )}
                        >
                          <Icon name={iconFor[p.key]} className={cn("h-5 w-5", active && !reduce && "scale-105")} accent={false} strokeWidth={1.7} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                            <span className="font-display text-[1.1875rem] font-bold tracking-[-0.02em] text-[#0a0f14] uppercase">
                              {p.title}
                            </span>
                            <span className="text-[0.9375rem] font-medium text-[#0757a8]">{p.line}</span>
                          </span>
                          <span
                            className={cn(
                              "grid transition-all duration-500",
                              active ? "mt-2 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                            )}
                          >
                            <span className="overflow-hidden">
                              <span className="block max-w-xl text-[0.9375rem] leading-relaxed text-[#414c57]">{p.body}</span>
                            </span>
                          </span>
                        </span>
                        <span className="t-mono hidden shrink-0 pt-1.5 text-[#c3ccd6] transition-colors duration-300 group-hover:text-[#008cff] sm:block">
                          {active ? "—" : "+"}
                        </span>
                      </div>
                    </button>
                  </RevealItem>
                );
              })}
            </div>
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
