"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { track } from "@/lib/analytics";

/**
 * Zero-dependency analytics glue. Any element can opt in declaratively from a
 * server component:  data-track="cta_email" data-placement="footer"
 * Scroll depth is reported once per page section milestone.
 */
export function AnalyticsBridge() {
  const pathname = usePathname();

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const t = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-track]");
      if (!t) return;
      const name = t.dataset.track;
      if (!name) return;
      track(name as never, {
        placement: t.dataset.placement ?? "unspecified",
        label: (t.textContent ?? "").trim().slice(0, 60) || undefined,
        href: t.getAttribute("href") ?? undefined,
      });
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  useEffect(() => {
    let done = [false, false, false, false];
    const marks = [0.25, 0.5, 0.75, 1];
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      if (max <= 200) return;
      const p = window.scrollY / max;
      marks.forEach((m, i) => {
        if (!done[i] && p >= m) {
          done[i] = true;
          track("scroll_depth" as never, { depth: m * 100, path: pathname });
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      done = [false, false, false, false];
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname]);

  return null;
}
