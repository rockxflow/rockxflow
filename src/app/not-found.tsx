"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import { LogoLockup } from "@/components/ui/Logo";
import { Icon } from "@/components/ui/Icon";
import { nav, site } from "@/lib/site";

const nodes = ["Website Form", "AI Analysis", "Qualification", "CRM", "Follow-up"];

export default function NotFound() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => setI((n) => (n + 1) % (nodes.length + 1)), 1100);
    return () => window.clearInterval(id);
  }, [reduce]);

  const breakAt = 3; // the record never reaches the CRM

  return (
    <div
        data-nav-tone="dark"
        className="relative flex min-h-dvh items-center overflow-hidden bg-[#030509] text-[color:var(--color-on-dark)]"
      >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="rx-grid absolute inset-0" />
        <div className="absolute inset-0" style={{ background: "radial-gradient(70% 55% at 50% 0%, rgba(0,140,255,0.16), transparent 62%)" }} />
      </div>

      <div className="rx-shell relative py-24">
        <div className="mx-auto max-w-2xl text-center">
          <Link href="/" aria-label={`${site.name} — home`} className="inline-flex">
            <LogoLockup className="w-44" />
          </Link>

          <p className="t-mono mt-10 uppercase tracking-[0.24em] text-[#66bfff]">Status · route not found</p>
          <h1 className="t-h1 mt-4 text-[color:var(--color-on-dark)]">404 — This Workflow Doesn’t Exist.</h1>
          <p className="t-lede mt-5 text-[#a9c0d4]">Looks like this path didn’t make it through the automation.</p>
        </div>

        {/* Broken pipeline: the packet dies before it reaches the system of record */}
        <div className="mx-auto mt-12 max-w-3xl">
          <ol className="relative flex flex-wrap items-center justify-center gap-x-2 gap-y-3">
            {nodes.map((n, idx) => {
              const lit = idx <= i;
              const broken = idx === breakAt;
              return (
                <li key={n} className="flex items-center gap-2">
                  <span
                    className={[
                      "rounded-xl border px-3 py-2 font-mono text-[0.6875rem] uppercase tracking-[0.1em] transition-all duration-500",
                      broken
                        ? "border-dashed border-[#7c2b26] bg-[#1a0908] text-[#ff9c93]"
                        : lit
                          ? "border-[#2a76ad] bg-[#08202f] text-[#bfe9ff]"
                          : "border-[#152a3c] bg-[#050e18] text-[#456a86]",
                    ].join(" ")}
                    style={lit && !broken && !reduce ? { boxShadow: "0 0 0 4px rgba(0,140,255,0.07)" } : undefined}
                  >
                    {broken ? "Unrouted" : n}
                  </span>
                  {idx < nodes.length - 1 ? (
                    <span aria-hidden="true" className="relative hidden h-px w-6 sm:block">
                      <span className={idx >= breakAt - 1 ? "absolute inset-0 border-t border-dashed border-[#7c2b26]" : "absolute inset-0 bg-[#1d4b6b]"} />
                    </span>
                  ) : null}
                </li>
              );
            })}
          </ol>
          <p className="mt-5 flex items-center justify-center gap-2 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-[#5f89a8]">
            <Icon name="shield" className="h-3.5 w-3.5 text-[#ff9c93]" accent={false} strokeWidth={1.8} />
            exception: requested route not in workflow map
          </p>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link href="/" className="rx-btn rx-btn-primary">
            Back to Home
            <Icon name="arrow" className="h-4 w-4" accent={false} strokeWidth={2} />
          </Link>
          <Link href="/services" className="rx-btn rx-btn-on-dark">
            Explore Services
          </Link>
          <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="rx-btn rx-btn-on-dark">
            <Icon name="whatsapp" className="h-4 w-4" accent={false} strokeWidth={1.7} />
            Tell us what you were looking for
          </a>
        </div>

        <nav aria-label="Site pages" className="mx-auto mt-14 max-w-2xl border-t border-[#12283c] pt-6">
          <p className="t-mono uppercase tracking-[0.16em] text-[#4d6f8a]">Everything else is here</p>
          <ul className="mt-3 flex flex-wrap justify-center gap-2">
            {nav.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  className="rounded-lg border border-[#152a3c] bg-[#061220]/70 px-3 py-1.5 text-[0.875rem] text-[#b8d0e2] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#2a76ad] hover:text-white"
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
