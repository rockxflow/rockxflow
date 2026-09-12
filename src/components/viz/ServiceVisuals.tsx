"use client";

import { useEffect, useId, useState } from "react";
import { useReducedMotion } from "motion/react";
import { Icon } from "@/components/ui/Icon";
import { DashboardPanel } from "@/components/viz/DashboardPanel";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════════════
   Shared chrome: every service visual lives in the same "instrument"
   frame so nine very different compositions still read as one system.
   ═══════════════════════════════════════════════════════════════ */
export function VizFrame({
  label,
  status = "live",
  note,
  children,
  className,
}: {
  label: string;
  status?: string;
  note?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <figure
      className={cn(
        "relative overflow-hidden rounded-2xl border border-[#16283a] bg-[#050d16] shadow-[0_36px_90px_-50px_rgba(3,12,22,0.75)]",
        className
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(90% 70% at 90% -10%, rgba(0,140,255,0.16), transparent 62%)" }}
      />
      <figcaption className="relative flex items-center justify-between gap-3 border-b border-[#12283c] px-4 py-2.5">
        <span className="flex items-center gap-2 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-[#7f9cb5]">
          <span className="flex gap-1" aria-hidden="true">
            <span className="h-1.5 w-1.5 rounded-full bg-[#24425a]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#2b5b7a]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#00a6ff]" />
          </span>
          {label}
        </span>
        <span className="flex items-center gap-1.5 font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-[#5f89a8]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e]" aria-hidden="true" />
          {status}
        </span>
      </figcaption>
      <div className="relative p-4 sm:p-5">{children}</div>
      {note ? (
        <div className="relative border-t border-[#12283c] px-4 py-2.5 text-[0.75rem] leading-relaxed text-[#6f8ca5]">{note}</div>
      ) : null}
    </figure>
  );
}

/* ═══════════════════════════════════════════════════════════════
   1. Pipeline — the signature chain, interactive
   ═══════════════════════════════════════════════════════════════ */
export function PipelineDiagram({ steps, caption }: { steps: readonly string[]; caption?: string }) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(reduce ? steps.length - 1 : 0);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => setActive((a) => (a + 1) % (steps.length + 1)), 1100);
    return () => window.clearInterval(id);
  }, [reduce, steps.length]);

  return (
    <VizFrame label="workflow · end to end" note={caption} status={`${String(Math.min(active + 1, steps.length)).padStart(2, "0")}/${String(steps.length).padStart(2, "0")}`}>
      <ol className="relative space-y-2">
        <span aria-hidden="true" className="absolute left-[1.05rem] top-3 bottom-3 w-px bg-[#132a3e]" />
        <span
          aria-hidden="true"
          className="absolute left-[1.05rem] top-3 w-px bg-gradient-to-b from-[#00d9ff] to-[#0757a8] transition-[height] duration-700 ease-out"
          style={{ height: `calc(${(Math.min(active + 1, steps.length) / steps.length) * 100}% - 1.5rem)` }}
        />
        {steps.map((s, i) => {
          const lit = i <= active;
          return (
            <li key={s}>
              <button
                type="button"
                onClick={() => setActive(i)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl border px-2.5 py-2 text-left transition-all duration-400",
                  i === active ? "border-[#2a76ad] bg-[#08202f]" : "border-transparent hover:border-[#1a3145] hover:bg-[#061019]"
                )}
              >
                <span
                  className={cn(
                    "relative z-10 grid h-[2.1rem] w-[2.1rem] shrink-0 place-items-center rounded-lg border font-mono text-[0.625rem] transition-all duration-400",
                    lit ? "border-[#256a9c] bg-[#0a2133] text-[#8fe4ff]" : "border-[#152536] bg-[#050e18] text-[#40607a]"
                  )}
                >
                  {i + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className={cn("block truncate text-[0.875rem] font-medium transition-colors duration-400", lit ? "text-[#eaf4fb]" : "text-[#7f97ac]")}>{s}</span>
                </span>
                {i === active && !reduce ? <span className="rx-anim-pulse h-1.5 w-1.5 rounded-full bg-[#00d9ff]" aria-hidden="true" /> : null}
              </button>
            </li>
          );
        })}
      </ol>
    </VizFrame>
  );
}

/* ═══════════════════════════════════════════════════════════════
   2. Agent console — instructions, tools, run log, human gate
   ═══════════════════════════════════════════════════════════════ */
const agentTabs = {
  Instructions: [
    { t: "Answer only from the approved knowledge set", s: "hard rule" },
    { t: "Collect name, requirement, timeline, budget band", s: "checklist" },
    { t: "Route to a human if price or contract is asked", s: "escalation" },
    { t: "Never promise dates that are not in the calendar", s: "hard rule" },
  ],
  Tools: [
    { t: "crm.record.create", s: "read+write" },
    { t: "calendar.slots.list", s: "read" },
    { t: "whatsapp.thread.reply", s: "write" },
    { t: "sheets.lead_log.append", s: "write" },
  ],
  "Run log": [
    { t: "08:12 · Enquiry #4192 read · intent: demo request", s: "ok" },
    { t: "08:12 · Scored 82/100 · assigned to Rahul", s: "ok" },
    { t: "08:13 · Reply sent · meeting slot offered", s: "ok" },
    { t: "09:40 · Discount requested → approval held for human", s: "gate" },
  ],
} as const;

export function AgentConsole() {
  const tabs = Object.keys(agentTabs) as (keyof typeof agentTabs)[];
  const [tab, setTab] = useState<(typeof tabs)[number]>("Instructions");
  return (
    <VizFrame
      label="agent · operations assistant"
      status="guarded"
      note="Agents act inside written instructions. Anything ambiguous, financial or contractual stops at a human approval gate."
    >
      <div className="flex gap-1 rounded-lg border border-[#152a3c] bg-[#04101a] p-1" role="tablist" aria-label="Agent configuration">
        {tabs.map((t) => (
          <button
            key={t}
            role="tab"
            type="button"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={cn(
              "flex-1 rounded-md px-2 py-1.5 font-mono text-[0.625rem] uppercase tracking-[0.1em] transition-all duration-300",
              tab === t ? "bg-[#0b2437] text-[#bfe9ff] shadow-[inset_0_0_0_1px_rgba(0,160,255,0.28)]" : "text-[#5f7f99] hover:text-[#9fcbe8]"
            )}
          >
            {t}
          </button>
        ))}
      </div>
      <ul className="mt-3 space-y-1.5" role="tabpanel" aria-label={tab}>
        {agentTabs[tab].map((r) => (
          <li key={r.t} className="flex items-start gap-2.5 rounded-lg border border-[#12283c] bg-[#061220]/60 px-3 py-2.5 transition-colors hover:border-[#1d3a52]">
            <span
              className={cn(
                "mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-[5px]",
                r.s === "gate" ? "bg-[#f04438]/15 text-[#ff8f86]" : r.s === "hard rule" ? "bg-[#008cff]/15 text-[#7fd8ff]" : "bg-[#22c55e]/15 text-[#5ee08f]"
              )}
            >
              <Icon name={r.s === "gate" ? "shield" : "check"} className="h-2.5 w-2.5" accent={false} strokeWidth={2.6} />
            </span>
            <span className="min-w-0 flex-1 text-[0.8125rem] leading-snug text-[#c7dbe9]">{r.t}</span>
            <span className="shrink-0 font-mono text-[0.5625rem] uppercase tracking-[0.1em] text-[#4d6f8a]">{r.s}</span>
          </li>
        ))}
      </ul>
    </VizFrame>
  );
}

/* ═══════════════════════════════════════════════════════════════
   3. Chat — qualification conversation
   ═══════════════════════════════════════════════════════════════ */
const chat = [
  { from: "visitor", text: "Do you handle WhatsApp + CRM automation together?" },
  { from: "ai", text: "Yes — we connect WhatsApp to your CRM so every enquiry is captured, replied to and followed up automatically. Which CRM do you use today?" },
  { from: "visitor", text: "Zoho. We miss a lot of evening enquiries." },
  { from: "ai", text: "Understood. That is a common pattern: after-hours messages go cold before anyone sees them. I have noted Zoho CRM, evening volume, and 24×7 first reply." },
  { from: "system", text: "Lead created · score 78 · owner assigned · human reply drafted for review" },
];

export function ChatThread() {
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(reduce ? chat.length : 0);
  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => setShown((s) => (s < chat.length ? s + 1 : 1)), 1800);
    return () => window.clearInterval(id);
  }, [reduce]);

  return (
    <VizFrame label="assistant · website chat" status="answering" note="Answers come from an approved knowledge set. Low confidence or a request for a price goes straight to a person.">
      <div className="space-y-2.5">
        {chat.slice(0, Math.max(1, shown)).map((m, i) => (
          <div key={i} className={cn("flex", m.from === "visitor" ? "justify-end" : "justify-start")}>
            {m.from === "system" ? (
              <p className="w-full rounded-lg border border-dashed border-[#1f4a6b] bg-[#071523] px-3 py-2 font-mono text-[0.625rem] uppercase tracking-[0.08em] text-[#8fd7ff]">
                {m.text}
              </p>
            ) : (
              <div
                className={cn(
                  "max-w-[86%] rounded-2xl px-3.5 py-2.5 text-[0.875rem] leading-snug",
                  m.from === "visitor"
                    ? "rounded-br-md bg-[#0f2b42] text-[#dbeaf6]"
                    : "rounded-bl-md bg-[#0a1c2c] text-[#e6f2fa] ring-1 ring-inset ring-[#173350]"
                )}
              >
                <span className="mb-1 block font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-[#5f89a8]">
                  {m.from === "visitor" ? "visitor" : "rockxflow ai"}
                </span>
                {m.text}
              </div>
            )}
          </div>
        ))}
        {!reduce && shown < chat.length ? (
          <div className="flex items-center gap-1.5 pl-1 text-[#4d6f8a]">
            <span className="flex gap-1" aria-hidden="true">
              {[0, 1, 2].map((d) => (
                <span key={d} className="rx-anim-pulse h-1.5 w-1.5 rounded-full bg-[#00a6ff]" style={{ animationDelay: `${d * 0.16}s` }} />
              ))}
            </span>
            <span className="font-mono text-[0.5625rem] uppercase tracking-[0.12em]">typing</span>
          </div>
        ) : null}
      </div>
    </VizFrame>
  );
}

/* ═══════════════════════════════════════════════════════════════
   4. Voice — waveform + call flow
   ═══════════════════════════════════════════════════════════════ */
const BARS = [12, 26, 44, 30, 58, 74, 46, 34, 62, 84, 52, 28, 40, 66, 92, 58, 36, 22, 48, 70, 40, 24, 54, 30, 16, 42, 62, 34, 20, 10];

export function VoiceWave() {
  const reduce = useReducedMotion();
  const uid = useId().replace(/:/g, "");
  const flow = ["Call answered", "Intent detected", "Details captured", "Slot confirmed", "Summary to CRM"];

  return (
    <VizFrame label="voice agent · inbound" status="on call 00:41" note="Every call ends with a transcript, a structured record and — when needed — a warm transfer with context already attached.">
      <div className="relative overflow-hidden rounded-xl border border-[#152a3c] bg-[#04101a] p-4">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-[#8fd7ff]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 rounded-full bg-[#22c55e]" />
              {!reduce ? <span className="rx-anim-ring absolute inset-0 rounded-full bg-[#22c55e]" /> : null}
            </span>
            +91 •••• ••6 8580
          </span>
          <span className="font-mono text-[0.625rem] text-[#4d6f8a]">enquiry · booking</span>
        </div>
        <div className="mt-3.5 flex h-16 items-center gap-[3px]" aria-hidden="true">
          {BARS.map((h, i) => (
            <span
              key={i}
              className={cn("flex-1 rounded-full", !reduce && "rx-anim-pulse")}
              style={{
                height: `${h}%`,
                background: `linear-gradient(to top, rgba(0,140,255,0.25), ${i % 3 === 0 ? "#00d9ff" : "#2f9fe0"})`,
                animationDelay: `${(i % 10) * 0.12}s`,
                animationDuration: "1.9s",
                opacity: reduce ? 0.5 + (h / 100) * 0.5 : undefined,
              }}
            />
          ))}
        </div>
        <div className="mt-3.5 rounded-lg border border-[#12283c] bg-[#061220] px-3 py-2.5">
          <p className="font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-[#5f89a8]">live transcript</p>
          <p className="mt-1 text-[0.8125rem] leading-snug text-[#d3e5f2]">
            “Hi, I want to book a site visit this Saturday…”{" "}
            <span className={cn("inline-block h-3.5 w-px translate-y-0.5 bg-[#00d9ff]", !reduce && "rx-anim-caret")} aria-hidden="true" />
          </p>
        </div>
        <svg viewBox="0 0 100 12" className="mt-3 h-6 w-full opacity-70" aria-hidden="true" preserveAspectRatio="none">
          <path
            id={`vp${uid}`}
            d="M0 6 C 12 1, 20 11, 32 6 S 52 1, 62 7 S 84 11, 100 5"
            fill="none"
            stroke="url(#vg)"
            strokeWidth="0.5"
            className={reduce ? undefined : "rx-anim-flow"}
            vectorEffect="non-scaling-stroke"
          />
          <defs>
            <linearGradient id="vg" x1="0" x2="1">
              <stop offset="0" stopColor="#0757a8" />
              <stop offset="0.6" stopColor="#00d9ff" />
              <stop offset="1" stopColor="#008cff" stopOpacity="0.2" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <ol className="mt-3 grid grid-cols-2 gap-1.5 sm:grid-cols-5">
        {flow.map((f, i) => (
          <li key={f} className={cn("rounded-lg border px-2 py-2 text-[0.6875rem] leading-tight", i < 3 ? "border-[#1d3a52] bg-[#0a1c2c] text-[#c7e4f7]" : "border-[#132335] bg-[#050e18] text-[#7f97ac]")}>
            <span className="mb-1 block font-mono text-[0.5625rem] text-[#4d6f8a]">{String(i + 1).padStart(2, "0")}</span>
            {f}
          </li>
        ))}
      </ol>
    </VizFrame>
  );
}

/* ═══════════════════════════════════════════════════════════════
   5. WhatsApp — original chat UI, workflow at the side
   ═══════════════════════════════════════════════════════════════ */
const wa = [
  { from: "them", text: "Is the 2BHK on Sector 12 still available?" },
  { from: "you", text: "Yes — it is available for viewing this week. Would Saturday 11:00 or Sunday 16:00 suit you better?" },
  { from: "them", text: "Saturday 11 works." },
  { from: "you", text: "Booked: Sat 11:00, Sector 12. I have sent the location pin and our agent will meet you at the gate." },
];

export function WhatsAppFlow() {
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(reduce ? wa.length : 0);
  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => setShown((s) => (s < wa.length ? s + 1 : 1)), 1700);
    return () => window.clearInterval(id);
  }, [reduce]);

  const chain = ["Message in", "AI understands", "Reply sent", "Lead captured", "CRM synced", "Follow-up set", "Human takes over"];

  return (
    <VizFrame label="whatsapp · business messaging" status="replied in 3s" note="Illustrative conversation. Replies use your own approved wording; anything sensitive is handed to your team with the thread attached.">
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <div className="overflow-hidden rounded-xl border border-[#123a2f] bg-[#07130f]">
          <div className="flex items-center gap-2.5 border-b border-[#0f2a22] bg-[#0b1c17] px-3 py-2">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-[#123a2f] font-mono text-[0.625rem] text-[#7fe0b6]">RX</span>
            <span className="min-w-0">
              <span className="block truncate text-[0.8125rem] font-semibold text-[#dff3ea]">Rockxflow Demo Line</span>
              <span className="block font-mono text-[0.5625rem] uppercase tracking-[0.1em] text-[#4f8a72]">online · automated + human</span>
            </span>
          </div>
          <div className="space-y-2 p-3" style={{ backgroundImage: "radial-gradient(rgba(120,220,180,0.05) 1px, transparent 1px)", backgroundSize: "12px 12px" }}>
            {wa.slice(0, Math.max(1, shown)).map((m, i) => (
              <div key={i} className={cn("flex", m.from === "them" ? "justify-start" : "justify-end")}>
                <p
                  className={cn(
                    "max-w-[85%] rounded-xl px-3 py-2 text-[0.8125rem] leading-snug shadow-[0_1px_1px_rgba(0,0,0,0.4)]",
                    m.from === "them" ? "rounded-tl-sm bg-[#123028] text-[#dff3ea]" : "rounded-tr-sm bg-[#0b3a2c] text-[#eafff6]"
                  )}
                >
                  {m.text}
                  <span className="mt-1 block text-right font-mono text-[0.5rem] uppercase tracking-[0.1em] text-[#5f9a80]">
                    {m.from === "them" ? "09:41" : "sent ✓✓"}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>

        <ol className="space-y-1.5">
          {chain.map((c, i) => {
            const lit = i <= Math.min(shown, chain.length - 1);
            return (
              <li key={c} className={cn("flex items-center gap-2.5 rounded-lg border px-2.5 py-1.5 text-[0.75rem] transition-all duration-500", lit ? "border-[#1d3a52] bg-[#08202f] text-[#c7e4f7]" : "border-[#132335] bg-[#050e18] text-[#61798f]")}>
                <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full transition-colors duration-500", lit ? "bg-[#00d9ff]" : "bg-[#22405a]")} aria-hidden="true" />
                {c}
              </li>
            );
          })}
        </ol>
      </div>
    </VizFrame>
  );
}

/* ═══════════════════════════════════════════════════════════════
   6. CRM board — pipeline with the automation trail
   ═══════════════════════════════════════════════════════════════ */
const columns = [
  { name: "New", tone: "#4d6f8a", cards: [{ src: "Website form", note: "score 82 · owner: Rahul", age: "2m" }, { src: "WhatsApp", note: "score 54 · needs detail", age: "14m" }] },
  { name: "Qualified", tone: "#00a6ff", cards: [{ src: "Referral", note: "call booked · Fri 15:00", age: "1h" }, { src: "Voice agent", note: "summary attached", age: "3h" }] },
  { name: "Proposal", tone: "#00d9ff", cards: [{ src: "Inbound email", note: "draft sent · awaiting reply", age: "1d" }] },
  { name: "Follow-up", tone: "#22c55e", cards: [{ src: "Exhibition list", note: "sequence step 2 of 4", age: "2d" }] },
];

export function CrmBoard() {
  const [pick, setPick] = useState<{ col: number; card: number } | null>(null);
  const trail = [
    { k: "Trigger", v: "Form submitted · source tagged" },
    { k: "Qualify", v: "AI read: budget, urgency, fit → 82" },
    { k: "Route", v: "Owner assigned by region + capacity" },
    { k: "Act", v: "Reply + reminder created" },
    { k: "Record", v: "CRM + sheet + Slack updated" },
  ];

  return (
    <VizFrame label="crm · sales pipeline" status="auto-maintained" note="Select a card to see the automation that placed it there. Generic demo data — no client records.">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {columns.map((c, ci) => (
          <div key={c.name} className="rounded-xl border border-[#132335] bg-[#050e18] p-2">
            <p className="mb-2 flex items-center justify-between px-0.5 font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-[#6f8ca5]">
              {c.name}
              <span className="grid h-4 min-w-4 place-items-center rounded px-1 text-[0.5625rem]" style={{ background: `${c.tone}22`, color: c.tone }}>
                {c.cards.length}
              </span>
            </p>
            <div className="space-y-1.5">
              {c.cards.map((card, di) => {
                const on = pick?.col === ci && pick?.card === di;
                return (
                  <button
                    key={card.src}
                    type="button"
                    onClick={() => setPick(on ? null : { col: ci, card: di })}
                    aria-pressed={on}
                    className={cn(
                      "w-full rounded-lg border px-2 py-2 text-left transition-all duration-300",
                      on ? "border-[#2a76ad] bg-[#0a2133] shadow-[0_10px_24px_-16px_rgba(0,190,255,0.7)]" : "border-[#152a3c] bg-[#071523] hover:border-[#24475f]"
                    )}
                  >
                    <span className="block truncate text-[0.78125rem] font-semibold text-[#dbeaf6]">{card.src}</span>
                    <span className="mt-0.5 block truncate text-[0.6875rem] text-[#7e97ad]">{card.note}</span>
                    <span className="mt-1.5 flex items-center justify-between font-mono text-[0.5625rem] text-[#4d6f8a]">
                      <span>{card.age} ago</span>
                      <span>{on ? "showing trail" : "trail"}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className={cn("mt-3 overflow-hidden rounded-xl border border-[#152a3c] bg-[#04101a] transition-all duration-500", pick ? "max-h-52 opacity-100" : "max-h-0 border-transparent opacity-0")}>
        <ol className="grid gap-1.5 p-3 sm:grid-cols-5">
          {trail.map((t, i) => (
            <li key={t.k} className="rounded-lg border border-[#12283c] bg-[#061220] px-2.5 py-2">
              <span className="block font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-[#00d9ff]">
                {String(i + 1).padStart(2, "0")} {t.k}
              </span>
              <span className="mt-1 block text-[0.75rem] leading-snug text-[#a8c0d4]">{t.v}</span>
            </li>
          ))}
        </ol>
      </div>
    </VizFrame>
  );
}

/* ═══════════════════════════════════════════════════════════════
   7. Documents — intake, extraction, validation, structured output
   ═══════════════════════════════════════════════════════════════ */
export function DocumentPipeline() {
  const reduce = useReducedMotion();
  const fields = [
    { k: "vendor", v: "Northline Logistics", ok: true },
    { k: "invoice_no", v: "NL-20418", ok: true },
    { k: "amount", v: "₹1,84,500.00", ok: true },
    { k: "due_date", v: "2026-09-24", ok: true },
    { k: "gst", v: "— not found", ok: false },
  ];
  return (
    <VizFrame label="document ai · intake" status="1 flagged" note="Confidence below threshold never becomes a silent write: the item is queued for a person with the source highlighted.">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="relative overflow-hidden rounded-xl border border-[#152a3c] bg-[#081625] p-3">
          <div className="flex items-center justify-between font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-[#5f89a8]">
            <span>invoice-scan.pdf</span>
            <span>page 1/1</span>
          </div>
          <div className="mt-3 space-y-1.5" aria-hidden="true">
            {[92, 68, 100, 84, 40, 96, 72, 88, 52].map((w, i) => (
              <span key={i} className={cn("block h-1.5 rounded-sm", i === 2 || i === 5 ? "bg-[#0d3f60]" : "bg-[#12283c]")} style={{ width: `${w}%` }} />
            ))}
          </div>
          {!reduce ? (
            <span className="rx-anim-scan pointer-events-none absolute inset-x-0 top-0 h-10" style={{ background: "linear-gradient(to bottom, transparent, rgba(0,200,255,0.10), transparent)" }} aria-hidden="true" />
          ) : null}
          <p className="mt-3 font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-[#4d6f8a]">classification · invoice · 0.98</p>
        </div>

        <div className="rounded-xl border border-[#152a3c] bg-[#04101a] p-3">
          <p className="font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-[#5f89a8]">structured output</p>
          <ul className="mt-2 space-y-1.5">
            {fields.map((f) => (
              <li key={f.k} className="flex items-center justify-between gap-2 rounded-lg border border-[#12283c] bg-[#061220] px-2.5 py-1.5">
                <span className="font-mono text-[0.6875rem] text-[#7fd8ff]">{f.k}</span>
                <span className={cn("min-w-0 flex-1 truncate text-right text-[0.75rem]", f.ok ? "text-[#dbeaf6]" : "text-[#ff9c93]")}>{f.v}</span>
                <span className={cn("grid h-4 w-4 place-items-center rounded-full", f.ok ? "bg-[#22c55e]/15 text-[#5ee08f]" : "bg-[#f04438]/15 text-[#ff8f86]")}>
                  <Icon name={f.ok ? "check" : "shield"} className="h-2.5 w-2.5" accent={false} strokeWidth={2.6} />
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-2.5 border-t border-[#12283c] pt-2 font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-[#ff9c93]">1 field → review queue</p>
        </div>
      </div>
    </VizFrame>
  );
}

/* ═══════════════════════════════════════════════════════════════
   8. Integrations — hub with tool constellation
   ═══════════════════════════════════════════════════════════════ */
export function IntegrationOrbit({ items }: { items: string[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const reduce = useReducedMotion();
  const radius = 42;
  return (
    <VizFrame label="integration fabric" status="authenticated" note="We build connectors for systems you already use. Listing a product here is not a partnership claim.">
      <div className="relative mx-auto aspect-square w-full max-w-[26rem]">
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
          {items.map((_, i) => {
            const a = (i / items.length) * Math.PI * 2 - Math.PI / 2;
            const x = 50 + Math.cos(a) * radius;
            const y = 50 + Math.sin(a) * radius;
            return (
              <g key={i}>
                <line
                  x1="50"
                  y1="50"
                  x2={x}
                  y2={y}
                  stroke={hover === i ? "#00d9ff" : "#12324a"}
                  strokeWidth={hover === i ? 0.8 : 0.4}
                  strokeDasharray={reduce ? undefined : "2 3"}
                  style={{ transition: "stroke 240ms ease, stroke-width 240ms ease" }}
                />
                <circle cx={x} cy={y} r={hover === i ? 2.2 : 1.5} fill={hover === i ? "#8ee9ff" : "#2b5b7a"} style={{ transition: "r 240ms ease" }} />
              </g>
            );
          })}
          <circle cx="50" cy="50" r="11" fill="none" stroke="#1d3a52" strokeWidth="0.5" />
          <circle cx="50" cy="50" r="15" fill="none" stroke="#12324a" strokeWidth="0.4" strokeDasharray={reduce ? undefined : "1 4"} className={reduce ? undefined : "rx-anim-flow"} />
        </svg>
        <div className="absolute left-1/2 top-1/2 grid h-24 w-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-2xl border border-[#1d3a52] bg-[#08202f] text-center shadow-[0_0_40px_-12px_rgba(0,190,255,0.5)]">
          <span>
            <Icon name="agent" className="mx-auto h-5 w-5 text-[#7fd8ff]" accent={false} strokeWidth={1.6} />
            <span className="mt-1 block font-mono text-[0.5625rem] uppercase leading-tight tracking-[0.1em] text-[#8fd7ff]">Rockxflow<br />layer</span>
          </span>
        </div>
        <ul className="absolute inset-0">
          {items.map((it, i) => {
            const a = (i / items.length) * Math.PI * 2 - Math.PI / 2;
            const x = 50 + Math.cos(a) * radius;
            const y = 50 + Math.sin(a) * radius;
            return (
              <li key={it} className="absolute" style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%,-50%)" }}>
                <button
                  type="button"
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                  onFocus={() => setHover(i)}
                  onBlur={() => setHover(null)}
                  className={cn(
                    "whitespace-nowrap rounded-md border px-2 py-1 font-mono text-[0.5625rem] uppercase tracking-[0.08em] transition-all duration-300",
                    hover === i ? "border-[#2a76ad] bg-[#0a2133] text-[#bfe9ff]" : "border-[#132335] bg-[#061220]/80 text-[#7e97ad]"
                  )}
                >
                  {it}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </VizFrame>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Router used by the services page + home tiles
   ═══════════════════════════════════════════════════════════════ */
export function ServiceVisual({ kind, steps }: { kind: string; steps: readonly string[] }) {
  switch (kind) {
    case "agent":
      return <AgentConsole />;
    case "chat":
      return <ChatThread />;
    case "voice":
      return <VoiceWave />;
    case "whatsapp":
      return <WhatsAppFlow />;
    case "crm":
      return <CrmBoard />;
    case "documents":
      return <DocumentPipeline />;
    case "integrations":
      return <IntegrationOrbit items={["Website", "Gmail", "WhatsApp", "Slack", "Notion", "HubSpot", "Sheets", "CRM", "Calendar", "API"]} />;
    case "dashboard":
      return <DashboardPanel tone="dark" />;
    default:
      return <PipelineDiagram steps={steps} caption="Each step is verified before the next runs — failures land in a queue, not in a void." />;
  }
}
