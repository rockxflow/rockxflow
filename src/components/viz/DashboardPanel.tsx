"use client";

import { useId, useState } from "react";
import { useReducedMotion } from "motion/react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

/**
 * Illustrative operations dashboard (SVG, no chart library). The data is
 * synthetic and labelled as such — we never publish invented client metrics.
 */
const series = [38, 46, 41, 55, 63, 58, 71, 68, 79, 86, 82, 94];
const replySeconds = [420, 360, 240, 180, 96, 62, 41, 28, 19, 12, 8, 4];
const labels = ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8", "W9", "W10", "W11", "W12"];

export function DashboardPanel({ tone = "light" }: { tone?: "light" | "dark" }) {
  const uid = useId().replace(/:/g, "");
  const reduce = useReducedMotion();
  const [hover, setHover] = useState<number | null>(null);

  const W = 520;
  const H = 200;
  const max = Math.max(...series);
  const min = Math.min(...series);
  const x = (i: number) => 14 + (i * (W - 28)) / (series.length - 1);
  const y = (v: number) => H - 22 - ((v - min) / (max - min)) * (H - 52);
  const line = series.map((v, i) => `${i ? "L" : "M"} ${x(i)} ${y(v)}`).join(" ");
  const area = `${line} L ${x(series.length - 1)} ${H - 8} L ${x(0)} ${H - 8} Z`;

  const dark = tone === "dark";
  const grid = dark ? "#132a3e" : "#eef2f6";
  const text = dark ? "#7e97ad" : "#96a2ae";
  const maxReply = Math.max(...replySeconds);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border p-5 sm:p-6",
        dark ? "border-[#16283a] bg-[#061220]" : "border-[#e4eaf1] bg-[#f9fbfd] shadow-[var(--shadow-soft)]"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className={cn("t-eyebrow", dark && "!text-[#66bfff]")}>Illustrative ops dashboard</p>
          <h3 className={cn("mt-2 font-display text-[1.125rem] font-bold tracking-[-0.02em]", dark ? "text-[#eaf4fb]" : "text-[#0a0f14]")}>
            Response & pipeline, week by week
          </h3>
        </div>
        <span className={cn("flex items-center gap-1.5 rounded-md border px-2 py-1 font-mono text-[0.5625rem] uppercase tracking-[0.12em]", dark ? "border-[#1d3a52] text-[#7e97ad]" : "border-[#e4eaf1] bg-white text-[#66717d]")}>
          <Icon name="clock" className="h-3 w-3" accent={false} strokeWidth={1.8} />
          scheduled
        </span>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2.5">
        {[
          { k: "Leads captured", v: "auto", note: "all sources" },
          { k: "Median first reply", v: "seconds", note: "vs hours" },
          { k: "Records needing fix-up", v: "near zero", note: "validated on entry" },
        ].map((m) => (
          <div key={m.k} className={cn("rounded-xl border px-3 py-2.5", dark ? "border-[#152a3c] bg-[#04101a]" : "border-[#e9eef4] bg-white")}>
            <p className={cn("font-mono text-[0.5625rem] uppercase tracking-[0.1em]", text)}>{m.k}</p>
            <p className={cn("mt-1 font-display text-[1.0625rem] font-bold tracking-[-0.02em]", dark ? "text-[#8fe4ff]" : "text-[#0757a8]")}>{m.v}</p>
            <p className={cn("text-[0.6875rem]", text)}>{m.note}</p>
          </div>
        ))}
      </div>

      <div className={cn("relative mt-5 rounded-xl border p-3", dark ? "border-[#152a3c] bg-[#04101a]" : "border-[#e9eef4] bg-white")}>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Sample twelve-week trend: captured leads rising while median reply time falls. Illustrative data.">
          <defs>
            <linearGradient id={`a${uid}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#008cff" stopOpacity="0.28" />
              <stop offset="1" stopColor="#008cff" stopOpacity="0" />
            </linearGradient>
            <linearGradient id={`s${uid}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#0757a8" />
              <stop offset="0.6" stopColor="#008cff" />
              <stop offset="1" stopColor="#00d9ff" />
            </linearGradient>
          </defs>
          {[0, 1, 2, 3].map((i) => (
            <line key={i} x1="14" x2={W - 14} y1={26 + i * 44} y2={26 + i * 44} stroke={grid} strokeWidth="1" />
          ))}
          <path d={area} fill={`url(#a${uid})`} />
          <path
            d={line}
            fill="none"
            stroke={`url(#s${uid})`}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn(reduce ? undefined : "rx-anim-flow")}
            style={reduce ? undefined : { strokeDasharray: "5 9" }}
          />
          {series.map((v, i) => (
            <g key={i} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
              <rect x={x(i) - 12} y={0} width="24" height={H} fill="transparent" />
              <circle
                cx={x(i)}
                cy={y(v)}
                r={hover === i ? 4.6 : 2.4}
                fill={dark ? "#04101a" : "#fff"}
                stroke="#00d9ff"
                strokeWidth="2"
                style={{ transition: "r 220ms ease" }}
              />
            </g>
          ))}
          {labels.map((l, i) => (
            <text key={l} x={x(i)} y={H - 6} textAnchor="middle" fontSize="9" fill={text} fontFamily="var(--font-mono)">
              {i % 2 === 0 ? l : ""}
            </text>
          ))}
        </svg>
        {hover !== null ? (
          <p className={cn("absolute right-4 top-4 rounded-md border px-2 py-1 font-mono text-[0.625rem]", dark ? "border-[#1d3a52] bg-[#061220] text-[#8fd7ff]" : "border-[#e4eaf1] bg-white text-[#0757a8]")}>
            {labels[hover]} · leads {series[hover]} · reply {replySeconds[hover]}s
          </p>
        ) : null}
      </div>

      <div className="mt-4">
        <p className={cn("font-mono text-[0.5625rem] uppercase tracking-[0.12em]", text)}>Median first-reply time, seconds</p>
        <div className="mt-2 flex h-14 items-end gap-1">
          {replySeconds.map((v, i) => (
            <div
              key={i}
              className={cn("flex-1 rounded-t-[3px] transition-all duration-500", hover === i ? "bg-[#00d9ff]" : "bg-[#008cff]/55")}
              style={{ height: `${Math.max(6, (v / maxReply) * 100)}%` }}
              title={`${labels[i]}: ${v}s`}
            />
          ))}
        </div>
      </div>

      <p className={cn("mt-4 border-t pt-3 text-[0.75rem] leading-relaxed", dark ? "border-[#12283c] text-[#6f8ca5]" : "border-[#e9eef4] text-[#66717d]")}>
        Shape only: real dashboards are built from your data sources, with KPI definitions agreed during mapping.
      </p>
    </div>
  );
}
