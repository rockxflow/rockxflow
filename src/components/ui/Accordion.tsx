"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export type AccordionItem = { q: string; a: string };

/**
 * Disclosure list for FAQ content. Real buttons with aria-expanded plus a
 * height-animating grid track — animates smoothly without measuring, and stays
 * readable with JavaScript unavailable.
 */
export function Accordion({
  items,
  tone = "light",
  idBase,
}: {
  items: readonly AccordionItem[];
  tone?: "light" | "dark";
  idBase: string;
}) {
  const [open, setOpen] = useState<number | null>(0);
  const dark = tone === "dark";

  return (
    <div className={cn("divide-y", dark ? "divide-[#152a3c] border-y border-[#152a3c]" : "divide-[#e9eef4] border-y border-[#e9eef4]")}>
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={it.q}>
            <h3>
              <button
                type="button"
                id={`${idBase}-btn-${i}`}
                aria-expanded={isOpen}
                aria-controls={`${idBase}-panel-${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
                className={cn(
                  "group flex w-full items-start gap-4 py-4 text-left transition-colors duration-300",
                  dark ? "hover:text-white" : "hover:text-[#0a0f14]"
                )}
              >
                <span className={cn("t-mono mt-1 shrink-0", dark ? "text-[#3f6f8f]" : "text-[#aab4bf]")}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={cn("flex-1 font-display text-[1.0625rem] font-bold leading-snug tracking-[-0.018em]", dark ? "text-[#dbeaf6]" : "text-[#0a0f14]")}>
                  {it.q}
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg border transition-all duration-400",
                    isOpen
                      ? "rotate-45 border-[#008cff] text-[#008cff]"
                      : dark
                        ? "border-[#1d3a52] text-[#8fd7ff]"
                        : "border-[#e4eaf1] text-[#66717d]"
                  )}
                >
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
              </button>
            </h3>
            <div
              id={`${idBase}-panel-${i}`}
              role="region"
              aria-labelledby={`${idBase}-btn-${i}`}
              className={cn("grid transition-all duration-500 ease-out", isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}
            >
              <div className="overflow-hidden">
                <p className={cn("max-w-2xl pb-5 pl-10 text-[0.9375rem] leading-relaxed", dark ? "text-[#9db4c8]" : "text-[#414c57]")}>{it.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
