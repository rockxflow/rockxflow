"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Cta } from "@/components/ui/Cta";
import { Icon } from "@/components/ui/Icon";
import { Reveal, RX_EASE, SplitWords } from "@/components/ui/Reveal";
import { heroFlow, site, strategyCallHref } from "@/lib/site";
import { cn } from "@/lib/utils";

const FLOW_SECONDS = 1.9;

/** Small "system output" fragments that surface as the workflow advances. */
const fragments = [
  { at: 0, label: "INBOUND", lines: ["Website form · New enquiry", "“Need automation for 3 offices”"] },
  { at: 1, label: "AI READ", lines: ["Intent: sales enquiry", "Fit: high · urgency: medium"] },
  { at: 3, label: "CRM", lines: ["Lead created · Owner: Rahul", "Stage: New → Qualified"] },
  { at: 4, label: "OUTREACH", lines: ["WhatsApp reply sent · 4s", "Meeting slot offered ×3"] },
  { at: 6, label: "RESULT", lines: ["Strategy call booked", "Reporting updated automatically"] },
];

export function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const [videoReady, setVideoReady] = useState(false);
  const [inView, setInView] = useState(true);
  const [desktop, setDesktop] = useState(false);

  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 720], [0, 70]);
  const scale = useTransform(scrollY, [0, 720], [1, 0.955]);
  const textY = useTransform(scrollY, [0, 520], [0, -22]);
  const veil = useTransform(scrollY, [0, 520], [0, 0.35]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px) and (prefers-reduced-motion: no-preference)");
    const apply = () => setDesktop(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // Advance the workflow overlay; pause when off-screen so the tab idles cheaply.
  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => {
      if (document.visibilityState === "visible" && inView) setStep((s) => (s + 1) % heroFlow.length);
    }, FLOW_SECONDS * 1000);
    return () => window.clearInterval(id);
  }, [reduce, inView]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        const v = videoRef.current;
        if (!v) return;
        if (entry.isIntersecting && !reduce) void v.play().catch(() => undefined);
        else v.pause();
      },
      { threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduce]);

  const activeFragment = [...fragments].reverse().find((f) => f.at <= step) ?? fragments[0];

  return (
    <section ref={ref} className="relative isolate overflow-hidden pt-28 pb-16 md:pt-32 lg:pt-36 lg:pb-24">
      {/* Ambient light + technical grid, kept far below the contrast threshold */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(10,15,20,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(10,15,20,0.045) 1px, transparent 1px)",
            backgroundSize: "96px 96px",
            maskImage: "radial-gradient(105% 78% at 62% 8%, #000 10%, transparent 72%)",
          }}
        />
        <div
          className="absolute -top-40 right-[-10%] h-[46rem] w-[46rem] rounded-full opacity-[0.55]"
          style={{ background: "radial-gradient(circle at 50% 50%, rgba(0,140,255,0.13), transparent 62%)" }}
        />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[#f1f5fa]" />
      </div>

      <div className="rx-shell">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,1.28fr)] lg:gap-14 xl:gap-20">
          {/* ── Copy ─────────────────────────────────────────────── */}
          <motion.div style={reduce ? undefined : { y: textY }} className="relative z-10 max-w-2xl">
            <div className="rx-pill shadow-[0_1px_2px_rgba(3,5,9,0.05)]">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inset-0 rounded-full bg-[#22c55e]" />
                {!reduce && <span className="rx-anim-ring absolute inset-0 rounded-full bg-[#22c55e]" />}
              </span>
              <span className="t-mono uppercase tracking-[0.14em] text-[#0a0f14]">AI Automation Agency</span>
              <span className="text-[#8f9aa6]">/ Systems for operations, sales & support</span>
            </div>

            <h1 className="t-display mt-6">
              <SplitWords text="Turn Repetitive Work" accentWords={[]} />
              <br />
              <span className="text-[#5a6673]">Into </span>
              <SplitWords text="Intelligent Systems." accentWords={["intelligent", "systems."]} delay={0.16} />
            </h1>

            <Reveal delay={0.34}>
              <p className="t-lede mt-7 max-w-xl">{site.intro}</p>
            </Reveal>

            <Reveal delay={0.42}>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Cta href={strategyCallHref} event="cta_strategy_call" eventProps={{ placement: "hero" }}>
                  Book a Strategy Call
                </Cta>
                <Cta href="/services" variant="ghost" icon="arrow" event="nav_cta_click" eventProps={{ placement: "hero" }}>
                  Explore Our Services
                </Cta>
              </div>
            </Reveal>

            <Reveal delay={0.5}>
              <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-[#e4eaf1] pt-6">
                <p className="t-mono uppercase tracking-[0.12em] text-[#0a0f14]">{site.supporting}</p>
                <span className="hidden h-4 w-px bg-[#d9e2ec] sm:block" aria-hidden="true" />
                <p className="t-small flex items-center gap-2">
                  <Icon name="shield" className="h-4 w-4 text-[#0757a8]" accent={false} strokeWidth={1.6} />
                  Human oversight on every consequential decision
                </p>
              </div>
            </Reveal>
          </motion.div>

          {/* ── Cinematic system viewport ────────────────────────── */}
          <motion.div
            style={reduce ? undefined : { y, scale }}
            className="rx-parallax relative"
            data-visible={inView}
            aria-label="Rockxflow automation system, visualising a live lead flowing from capture to booked meeting"
            role="group"
          >
            <div
              className="relative overflow-hidden rounded-[1.25rem] border border-[#16283a] bg-[#030509] shadow-[0_40px_120px_-45px_rgba(3,12,22,0.65),0_2px_0_rgba(255,255,255,0.6)]"
              style={{ aspectRatio: "16 / 11" }}
            >
              {/* Base layer: the film's first frame — also the permanent fallback,
                  and the LCP element until the loop takes over. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={desktop ? "/media/rockxflow-hero-poster.webp" : "/media/rockxflow-hero-poster-sm.webp"}
                alt="Abstract cinematic render of an AI automation network: glowing blue data paths crossing translucent panels in a dark environment"
                className="absolute inset-0 h-full w-full object-cover"
                width={1280}
                height={720}
                fetchPriority="high"
                decoding="async"
              />
              {desktop ? (
                <video
                  ref={videoRef}
                  className={cn(
                    "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
                    videoReady ? "opacity-100" : "opacity-0"
                  )}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  disablePictureInPicture
                  poster="/media/rockxflow-hero-poster.webp"
                  onCanPlay={() => setVideoReady(true)}
                  onError={() => setVideoReady(false)}
                  aria-hidden="true"
                  tabIndex={-1}
                >
                  <source src="/media/rockxflow-hero-loop.webm" type="video/webm" />
                  <source src="/media/rockxflow-hero-loop.mp4" type="video/mp4" />
                </video>
              ) : null}

              {/* Readability veils — the film carries no text, so nothing is lost */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(3,5,9,0.94) 4%, rgba(3,5,9,0.55) 32%, rgba(3,5,9,0.12) 62%, rgba(3,5,9,0.45) 100%)",
                }}
              />
              <motion.div
                aria-hidden="true"
                style={reduce ? undefined : { opacity: veil }}
                className="pointer-events-none absolute inset-0 bg-[#030509]"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-[0.16] mix-blend-overlay"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(to bottom, rgba(255,255,255,0.5) 0 1px, transparent 1px 3px)",
                }}
              />

              {/* HUD chrome */}
              <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-4 sm:p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-[#8fc6f2]">
                    <span className="relative flex h-1.5 w-1.5 rounded-full bg-[#00d9ff]">
                      {!reduce && <span className="rx-anim-pulse absolute inset-0 rounded-full bg-[#00d9ff]" />}
                    </span>
                    Rockxflow&nbsp;System · Live
                  </div>
                  <div className="hidden text-right font-mono text-[0.625rem] leading-relaxed tracking-[0.08em] text-[#5d7f9c] sm:block">
                    pipeline: inbound-lead
                    <br />
                    mode: ai + rules · human review
                  </div>
                </div>

                {/* Output fragments — the payoff of each step, in plain business terms */}
                <div className="flex items-end justify-between gap-4">
                  <motion.div
                    key={activeFragment.label}
                    initial={reduce ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: RX_EASE }}
                    className="max-w-[17rem] rounded-lg border border-[#1d3346] bg-[#040a11]/75 p-2.5 backdrop-blur-[8px]"
                  >
                    <div className="font-mono text-[0.5625rem] uppercase tracking-[0.18em] text-[#00d9ff]">{activeFragment.label}</div>
                    <div className="mt-1.5 space-y-0.5">
                      {activeFragment.lines.map((l) => (
                        <p key={l} className="text-[0.78125rem] leading-snug text-[#dceaf6]">
                          {l}
                        </p>
                      ))}
                    </div>
                  </motion.div>

                  <div className="hidden text-right font-mono text-[0.5625rem] uppercase tracking-[0.16em] text-[#5d7f9c] md:block">
                    <span className="text-[#9fd6ff]">{String(step + 1).padStart(2, "0")}</span> / {String(heroFlow.length).padStart(2, "0")}
                  </div>
                </div>
              </div>

              {/* Workflow rail across the foot of the viewport */}
              <div className="absolute inset-x-0 bottom-0 border-t border-[#14293c] bg-[#030609]/85 px-4 py-3 backdrop-blur-[2px] sm:px-5">
                <ol className="flex items-center gap-1.5 sm:gap-2">
                  {heroFlow.map((node, i) => {
                    const active = i === step;
                    const done = i < step;
                    return (
                      <li key={node.label} className="flex min-w-0 flex-1 items-center gap-1.5 sm:gap-2">
                        <span className="flex min-w-0 items-center gap-1.5">
                          <span
                            aria-hidden="true"
                            className={cn(
                              "h-1.5 w-1.5 shrink-0 rounded-full transition-all duration-500",
                              active
                                ? "scale-[1.6] bg-[#00d9ff] shadow-[0_0_10px_rgba(0,217,255,0.9)]"
                                : done
                                  ? "bg-[#2f7fb8]"
                                  : "bg-[#28404f]"
                            )}
                          />
                          <span
                            className={cn(
                              "truncate font-mono text-[0.5625rem] uppercase tracking-[0.1em] transition-colors duration-500 sm:text-[0.625rem]",
                              active ? "text-[#cbeaff]" : done ? "text-[#7893a8]" : "text-[#4a6172]"
                            )}
                          >
                            {node.label}
                          </span>
                        </span>
                        {i < heroFlow.length - 1 ? (
                          <span aria-hidden="true" className="relative hidden h-px min-w-3 flex-1 bg-[#1a2f3f] md:block">
                            <span
                              className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#00a6ff] to-[#00d9ff] transition-all duration-700"
                              style={{ width: done ? "100%" : "0%" }}
                            />
                          </span>
                        ) : null}
                      </li>
                    );
                  })}
                </ol>
              </div>

              {/* Corner brackets */}
              {["left-3 top-3 border-l border-t", "right-3 top-3 border-r border-t", "left-3 bottom-[4.25rem] border-l border-b", "right-3 bottom-[4.25rem] border-r border-b"].map(
                (pos) => (
                  <span key={pos} aria-hidden="true" className={cn("pointer-events-none absolute h-4 w-4 border-[#2c5e86]/70", pos)} />
                )
              )}
            </div>

            {/* Floating capability strip under the viewport */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="t-small flex items-center gap-2">
                <Icon name="spark" className="h-3.5 w-3.5 text-[#008cff]" accent={false} strokeWidth={1.7} />
                Original system visualisation — rendered for Rockxflow, not stock footage.
              </p>
              <div className="flex items-center gap-2">
                {["AI Agents", "Integrations", "Reporting"].map((t) => (
                  <span key={t} className="rounded-md border border-[#e2e9f1] bg-white/70 px-2 py-1 font-mono text-[0.625rem] uppercase tracking-[0.1em] text-[#5a6673]">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="rx-shell mt-12 flex items-center justify-between lg:mt-16">
        <Link
          href="#problem"
          className="group inline-flex items-center gap-2.5 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-[#66717d] transition-colors hover:text-[#0a0f14]"
        >
          <span className="relative grid h-7 w-7 place-items-center rounded-full border border-[#d7e0ea] transition-transform duration-300 group-hover:translate-y-0.5">
            <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12 5v13m0 0-5-5m5 5 5-5" />
            </svg>
          </span>
          Scroll to see the system
        </Link>
        <div className="hidden items-center gap-6 md:flex">
          {["Sales", "Support", "Operations", "Reporting"].map((l) => (
            <span key={l} className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-[#8b97a3]">
              {l}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
