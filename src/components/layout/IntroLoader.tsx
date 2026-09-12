"use client";

import { useEffect, useState } from "react";
import { LogoMark } from "@/components/ui/Logo";
import { useReducedMotion } from "motion/react";

/**
 * First-paint only: the mark draws itself behind a hairline progress rule and
 * clears the moment the page is interactive — never a gate, never a wait.
 * Skipped entirely for repeat views in the same session.
 */
export function IntroLoader() {
  const [phase, setPhase] = useState<"none" | "in" | "out">("none");
  const reduce = useReducedMotion();

  useEffect(() => {
    let seen = false;
    try {
      seen = window.sessionStorage.getItem("rx-intro") === "1";
    } catch {
      seen = false;
    }
    if (seen || reduce) return;
    try {
      window.sessionStorage.setItem("rx-intro", "1");
    } catch {
      /* private mode: skip the intro rather than throw */
      return;
    }

    setPhase("in");
    let closed = false;
    const finish = () => {
      if (closed) return;
      closed = true;
      setPhase("out");
      window.setTimeout(() => setPhase("none"), 420);
    };
    const min = window.setTimeout(() => {
      if (document.readyState === "complete") finish();
      else window.addEventListener("load", finish, { once: true });
    }, 260);
    const cap = window.setTimeout(finish, 900);
    return () => {
      window.clearTimeout(min);
      window.clearTimeout(cap);
      window.removeEventListener("load", finish);
    };
  }, [reduce]);

  if (phase === "none") return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[80] grid place-items-center bg-[#f7f9fc] transition-opacity duration-[420ms] ease-out"
      style={{ opacity: phase === "out" ? 0 : 1, pointerEvents: phase === "out" ? "none" : "auto" }}
    >
      <div className="flex flex-col items-center gap-4">
        <span className="rx-rise">
          <LogoMark className="h-14 w-14" animated tone="dark" />
        </span>
        <span className="relative block h-px w-28 overflow-hidden bg-[#dde5ed]">
          <span
            className="absolute inset-y-0 left-0 block bg-gradient-to-r from-[#0757a8] via-[#008cff] to-[#00d9ff]"
            style={{ animation: "rx-loader 620ms cubic-bezier(0.22,0.61,0.24,1) forwards" }}
          />
        </span>
      </div>
      <style>{`@keyframes rx-loader{from{transform:translateX(-100%)}to{transform:translateX(0)}}`}</style>
    </div>
  );
}
