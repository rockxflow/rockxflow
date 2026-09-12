"use client";

import { useReducedMotion } from "motion/react";
import { Reveal } from "@/components/ui/Reveal";
import { Cta } from "@/components/ui/Cta";
import { Icon } from "@/components/ui/Icon";
import { site, strategyCallHref } from "@/lib/site";
import { track } from "@/lib/analytics";

const nodes = [
  { x: 6, y: 78 },
  { x: 22, y: 40 },
  { x: 38, y: 70 },
  { x: 54, y: 28 },
  { x: 70, y: 62 },
  { x: 86, y: 34 },
  { x: 97, y: 66 },
];

/** Closing conversion moment — dark, quiet, with the system still moving behind it. */
export function FinalCta() {
  const reduce = useReducedMotion();
  const line = nodes.map((n, i) => `${i ? "L" : "M"} ${n.x} ${n.y}`).join(" ");

  return (
    <section id="start" className="relative isolate overflow-hidden bg-[#030509] py-20 text-[color:var(--color-on-dark)] md:py-24 lg:py-28">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(80% 60% at 78% 8%, rgba(0,140,255,0.17), transparent 62%), radial-gradient(60% 60% at 8% 96%, rgba(0,217,255,0.10), transparent 62%)",
          }}
        />
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full opacity-[0.5]">
          <path
            d={line}
            fill="none"
            stroke="url(#rx-final)"
            strokeWidth="0.35"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={reduce ? undefined : "rx-anim-flow"}
            vectorEffect="non-scaling-stroke"
            style={{ strokeDasharray: reduce ? undefined : "4 8" }}
          />
          <defs>
            <linearGradient id="rx-final" x1="0" x2="1">
              <stop offset="0" stopColor="#008cff" stopOpacity="0.15" />
              <stop offset="0.5" stopColor="#00d9ff" stopOpacity="0.75" />
              <stop offset="1" stopColor="#0757a8" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          {nodes.map((n, i) => (
            <circle key={i} cx={n.x} cy={n.y} r="0.7" fill="#7fd8ff" className={reduce ? undefined : "rx-anim-pulse"} style={{ animationDelay: `${i * 0.28}s`, transformOrigin: "center" }} />
          ))}
        </svg>
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#0d76c4]/70 to-transparent" />
      </div>

      <div className="rx-shell relative">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] lg:gap-16">
          <div>
            <Reveal>
              <p className="t-eyebrow !text-[#66bfff]">Start here</p>
            </Reveal>
            <h2 className="t-h1 mt-4 max-w-3xl text-[color:var(--color-on-dark)]">
              Ready to Automate What Slows Your Business Down?
            </h2>
            <Reveal delay={0.1}>
              <p className="mt-5 max-w-xl text-[1.0625rem] leading-relaxed text-[#a9c0d4]">
                Let’s identify the processes where AI can create the biggest impact — then decide together whether a
                build is worth it.
              </p>
            </Reveal>
            <Reveal delay={0.16}>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Cta href={strategyCallHref} event="cta_strategy_call" eventProps={{ placement: "final" }}>
                  Book a Strategy Call
                </Cta>
                <Cta href={site.whatsapp} variant="onDark" icon="whatsapp" event="cta_whatsapp" eventProps={{ placement: "final" }}>
                  Talk on WhatsApp
                </Cta>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.12}>
            <div className="rounded-2xl border border-[#16283a] bg-[#061220]/80 p-5 backdrop-blur-sm">
              <p className="t-eyebrow !text-[#7f9cb5]">What happens next</p>
              <ol className="mt-4 space-y-3.5">
                {[
                  { t: "You describe the friction", d: "One call, no paperwork. Screenshots of the mess are welcome." },
                  { t: "We map what is automatable", d: "You get the workflow diagram and an honest feasibility read." },
                  { t: "We scope one build", d: "A defined first system, its integrations, and what you approve at each step." },
                ].map((s, i) => (
                  <li key={s.t} className="flex gap-3.5">
                    <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-[#1d3a52] bg-[#04101a] font-mono text-[0.625rem] text-[#8fd7ff]">
                      {i + 1}
                    </span>
                    <span>
                      <span className="block text-[0.9375rem] font-semibold text-[#eaf4fb]">{s.t}</span>
                      <span className="mt-0.5 block text-[0.8125rem] leading-relaxed text-[#8fa8bd]">{s.d}</span>
                    </span>
                  </li>
                ))}
              </ol>
              <div className="mt-5 grid gap-2 border-t border-[#12283c] pt-4">
                <a
                  href={`mailto:${site.email}`}
                  onClick={() => track("cta_email" as never, { placement: "final" })}
                  className="group flex items-center justify-between text-[0.875rem] text-[#a9c0d4] transition-colors hover:text-white"
                >
                  <span className="flex items-center gap-2">
                    <Icon name="mail" className="h-4 w-4 text-[#66bfff]" accent={false} strokeWidth={1.7} />
                    {site.email}
                  </span>
                  <Icon name="arrowUpRight" className="h-3.5 w-3.5 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" accent={false} strokeWidth={2} />
                </a>
                <a href={`tel:${site.phoneRaw}`} className="flex items-center gap-2 text-[0.875rem] text-[#a9c0d4] transition-colors hover:text-white">
                  <Icon name="phone" className="h-4 w-4 text-[#66bfff]" accent={false} strokeWidth={1.7} />
                  {site.phoneDisplay}
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
