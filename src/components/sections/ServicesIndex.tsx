"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";

/** Sticky capability index with scroll-spy, so a nine-section page stays navigable. */
export function ServicesIndex({ items }: { items: { slug: string; index: string; title: string }[] }) {
  const [active, setActive] = useState(items[0]?.slug ?? "");

  useEffect(() => {
    const els = items
      .map((i) => document.getElementById(i.slug))
      .filter((e): e is HTMLElement => Boolean(e));
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-96px 0px -66% 0px", threshold: 0.01 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);

  return (
    <nav aria-label="Services on this page" className="sticky top-[5.25rem] z-30 -mx-1 mb-10 max-w-full overflow-x-auto overscroll-x-contain px-1 py-2 [scrollbar-width:none] lg:mx-0 lg:mb-0 lg:max-w-none lg:overflow-visible lg:py-0 [&::-webkit-scrollbar]:hidden">
      <div className="flex min-w-max items-center gap-1 rounded-2xl border border-[#e4eaf1] bg-white/85 p-1.5 backdrop-blur-md lg:min-w-0 lg:flex-col lg:items-stretch lg:gap-0 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
        <span className="t-mono mr-2 hidden shrink-0 uppercase tracking-[0.14em] text-[#8b97a3] lg:mb-2 lg:mr-0 lg:block">Jump to</span>
        {items.map((it) => {
          const on = active === it.slug;
          return (
            <Link
              key={it.slug}
              href={`#${it.slug}`}
              aria-current={on ? "true" : undefined}
              className={cn(
                "group flex shrink-0 items-center gap-2 rounded-xl px-2.5 py-1.5 text-left transition-all duration-300 lg:rounded-lg",
                on ? "bg-[#f0f7ff] text-[#0a0f14] lg:shadow-[inset_2px_0_0_#008cff]" : "text-[#66717d] hover:bg-[#f7fafd] hover:text-[#0a0f14]"
              )}
            >
              <span className={cn("t-mono text-[0.5625rem] transition-colors", on ? "text-[#008cff]" : "text-[#aab4bf]")}>{it.index}</span>
              <span className="whitespace-nowrap text-[0.8125rem] font-semibold tracking-[-0.01em] lg:whitespace-normal">{it.title}</span>
              <Icon
                name="arrow"
                className={cn("hidden h-3 w-3 transition-all duration-300 lg:ml-auto", on ? "translate-x-0 text-[#008cff] opacity-100" : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-60")}
                accent={false}
                strokeWidth={2.2}
              />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
