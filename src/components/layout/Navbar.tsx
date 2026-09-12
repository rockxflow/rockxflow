"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import Logo from "@/components/ui/Logo";
import { Icon } from "@/components/ui/Icon";
import { nav, site, strategyCallHref } from "@/lib/site";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const toggle = useRef<HTMLButtonElement>(null);
  const { scrollYProgress } = useScroll();
  const progress = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setScrolled(window.scrollY > 12));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Close on navigation, lock scroll and restore focus when the sheet closes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    const t = window.setTimeout(() => document.querySelector<HTMLElement>("#rx-menu a")?.focus(), 80);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
    };
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <a
        href="#main"
        className="sr-only rounded-lg bg-[#0a0f14] px-4 py-2.5 font-display text-[0.875rem] font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60]"
      >
        Skip to content
      </a>

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled
            ? "border-b border-[#e4eaf1]/90 bg-[#f7f9fc]/82 backdrop-blur-xl backdrop-saturate-150 shadow-[0_1px_0_rgba(255,255,255,0.7)_inset,0_10px_30px_-24px_rgba(3,5,9,0.4)]"
            : "border-b border-transparent bg-transparent"
        )}
      >
        <div className="rx-shell flex h-[4.5rem] items-center justify-between gap-6 md:h-20">
          <Link
            href="/"
            className="group flex items-center gap-2.5 rounded-lg py-1.5"
            aria-label={`${site.name} — home`}
          >
            <Logo tone="dark" size="md" />
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
            {nav.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group relative rounded-lg px-3.5 py-2 font-display text-[0.875rem] font-semibold tracking-[-0.01em] transition-colors duration-300",
                    active ? "text-[#0a0f14]" : "text-[#5a6673] hover:text-[#0a0f14]"
                  )}
                >
                  {item.label}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute inset-x-3.5 -bottom-0.5 h-[2px] origin-left rounded-full bg-gradient-to-r from-[#008cff] to-[#00d9ff] transition-transform duration-400",
                      active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2.5">
            <a
              href={site.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("cta_whatsapp" as never, { placement: "nav" })}
              aria-label="Message Rockxflow on WhatsApp"
              className="hidden h-10 w-10 place-items-center rounded-xl border border-[#e4eaf1] bg-white/70 text-[#414c57] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#8fd7ff] hover:text-[#0757a8] md:grid"
            >
              <Icon name="whatsapp" className="h-4.5 w-4.5" accent={false} strokeWidth={1.6} />
            </a>
            <Link
              href={strategyCallHref}
              onClick={() => track("nav_cta_click" as never, { placement: "navbar" })}
              className="rx-btn rx-btn-primary rx-btn-sm hidden sm:inline-flex"
            >
              <span>Book a Strategy Call</span>
              <Icon name="arrow" className="h-3.5 w-3.5" accent={false} strokeWidth={2} />
            </Link>

            <button
              ref={toggle}
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="rx-menu"
              className="grid h-10 w-10 place-items-center rounded-xl border border-[#e4eaf1] bg-white/70 text-[#0a0f14] transition-colors hover:border-[#bcdcf7] lg:hidden"
            >
              <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
              <span className="relative block h-4 w-5" aria-hidden="true">
                <span className={cn("absolute left-0 h-[1.6px] w-full rounded bg-current transition-all duration-400", open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0.5")} />
                <span className={cn("absolute left-0 top-1/2 h-[1.6px] w-full -translate-y-1/2 rounded bg-current transition-all duration-300", open ? "opacity-0" : "opacity-100")} />
                <span className={cn("absolute left-0 h-[1.6px] w-full rounded bg-current transition-all duration-400", open ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0.5")} />
              </span>
            </button>
          </div>
        </div>

        <div aria-hidden="true" className="relative h-px w-full bg-transparent">
          <motion.div
            className={cn("h-px origin-left bg-gradient-to-r from-[#0757a8] via-[#008cff] to-[#00d9ff] transition-opacity duration-300", scrolled ? "opacity-100" : "opacity-0")}
            style={{ scaleX: reduce ? 1 : progress }}
          />
        </div>
      </header>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            id="rx-menu"
            key="menu"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.32, ease: [0.22, 0.61, 0.24, 1] }}
            className="fixed inset-x-0 top-[4.5rem] bottom-0 z-40 overflow-y-auto bg-[#f7f9fc]/97 backdrop-blur-xl lg:hidden"
          >
            <div className="rx-shell flex min-h-full flex-col py-6">
              <nav aria-label="Mobile" className="flex flex-col">
                {nav.map((item, i) => {
                  const active = isActive(item.href);
                  return (
                    <motion.div
                      key={item.href}
                      initial={reduce ? false : { opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.05 + i * 0.05, ease: [0.22, 0.61, 0.24, 1] }}
                    >
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "flex items-center justify-between border-b border-[#e4eaf1] py-4 font-display text-[1.5rem] font-bold tracking-[-0.03em] transition-colors",
                          active ? "text-[#0757a8]" : "text-[#0a0f14]"
                        )}
                      >
                        {item.label}
                        <span className="flex items-center gap-2">
                          <span className="t-mono text-[#aab4bf]">{String(i + 1).padStart(2, "0")}</span>
                          <Icon name="arrowUpRight" className={cn("h-4 w-4 transition-colors", active ? "text-[#008cff]" : "text-[#aab4bf]")} accent={false} strokeWidth={2} />
                        </span>
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              <motion.div
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.34, ease: [0.22, 0.61, 0.24, 1] }}
                className="mt-auto pt-8"
              >
                <Link href={strategyCallHref} className="rx-btn rx-btn-primary w-full" onClick={() => track("cta_strategy_call" as never, { placement: "mobile_nav" })}>
                  <span>Book a Strategy Call</span>
                  <Icon name="arrow" className="h-4 w-4" accent={false} strokeWidth={2} />
                </Link>
                <div className="mt-3 grid grid-cols-2 gap-2.5">
                  <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="rx-btn rx-btn-ghost w-full" onClick={() => track("cta_whatsapp" as never, { placement: "mobile_nav" })}>
                    <Icon name="whatsapp" className="h-4 w-4" accent={false} strokeWidth={1.7} />
                    WhatsApp
                  </a>
                  <a href={`mailto:${site.email}`} className="rx-btn rx-btn-ghost w-full" onClick={() => track("cta_email" as never, { placement: "mobile_nav" })}>
                    <Icon name="mail" className="h-4 w-4" accent={false} strokeWidth={1.7} />
                    Email
                  </a>
                </div>
                <p className="t-small mt-5 flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="t-mono uppercase tracking-[0.12em] text-[#0757a8]">{site.tagline}</span>
                  <span className="text-[#c3ccd6]">·</span>
                  <span>{site.location}</span>
                </p>
              </motion.div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
