import Link from "next/link";
import { Icon, type IconName } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import type { Service } from "@/lib/site";

/**
 * One service tile used at three densities so the services grid never reads as
 * a repeating card wall: `feature` carries its worked example, `wide` carries
 * the problem, `compact` stays typographic.
 */
export function ServiceTile({
  service,
  variant = "compact",
  tone = "light",
  className,
  href,
}: {
  service: Service;
  variant?: "feature" | "wide" | "compact";
  tone?: "light" | "dark";
  className?: string;
  href?: string;
}) {
  const dark = tone === "dark";
  const link = href ?? `/services#${service.slug}`;
  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border p-5 transition-all duration-500 sm:p-6",
        dark
          ? "border-[#16283a] bg-[#061220]/70 hover:border-[#2a6f9f] hover:bg-[#0a1c2c]"
          : "border-[#e4eaf1] bg-white hover:border-[#bcdcf7] hover:shadow-[var(--shadow-lift)]",
        className
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-px scale-x-0 transition-transform duration-700 group-hover:scale-x-100",
          dark ? "bg-gradient-to-r from-transparent via-[#00d9ff]/70 to-transparent" : "bg-gradient-to-r from-transparent via-[#008cff]/70 to-transparent"
        )}
      />
      <header className="flex items-start justify-between gap-4">
        <span className={cn("grid h-10 w-10 place-items-center rounded-xl border transition-transform duration-500 group-hover:-translate-y-0.5", dark ? "border-[#1d3a52] text-[#8fd7ff]" : "border-[#e4eaf1] text-[#0a72d6]")}>
          <Icon name={service.visual as IconName} className="h-5 w-5" accent={false} strokeWidth={1.6} />
        </span>
        <span className={cn("t-mono", dark ? "text-[#3c5f7d]" : "text-[#c3ccd6]")}>{service.index}</span>
      </header>

      <h3 className={cn("mt-4 font-display text-[1.25rem] font-bold leading-tight tracking-[-0.02em]", dark ? "text-[#f2f8fd]" : "text-[#0a0f14]")}>
        {service.title}
      </h3>
      <p className={cn("mt-2 text-[0.9375rem] leading-relaxed", dark ? "text-[#9db4c8]" : "text-[#414c57]")}>{service.summary}</p>

      {variant !== "compact" ? (
        <p className={cn("mt-4 border-t pt-4 text-[0.875rem] leading-relaxed", dark ? "border-[#14283c] text-[#8fa8bd]" : "border-[#eef2f6] text-[#66717d]")}>
          <span className={cn("font-mono text-[0.625rem] uppercase tracking-[0.14em]", dark ? "text-[#66bfff]" : "text-[#0757a8]")}>
            {variant === "feature" ? "Worked example" : "What it solves"}
          </span>
          <br />
          {variant === "feature" ? service.steps.slice(0, 5).join(" → ") + " → …" : service.problem}
        </p>
      ) : null}

      <footer className="mt-5 flex items-center justify-between gap-3 pt-1">
        <Link
          href={link}
          className={cn(
            "inline-flex items-center gap-1.5 font-display text-[0.875rem] font-semibold tracking-[-0.01em] transition-colors",
            dark ? "text-[#9fdcff] hover:text-white" : "text-[#0757a8] hover:text-[#0a0f14]"
          )}
          aria-label={`${service.title} — read the full breakdown`}
        >
          {service.kicker}
          <Icon name="arrowUpRight" className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" accent={false} strokeWidth={2} />
        </Link>
        {variant === "feature" ? (
          <span className={cn("t-mono", dark ? "text-[#5a7d99]" : "text-[#8b97a3]")}>{service.steps.length} steps</span>
        ) : null}
      </footer>
    </article>
  );
}
