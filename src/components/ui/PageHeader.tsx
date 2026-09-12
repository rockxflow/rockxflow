import Link from "next/link";
import { Cta } from "@/components/ui/Cta";
import { Icon } from "@/components/ui/Icon";
import { Reveal, SplitWords } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

export type Crumb = { name: string; path: string };

export function Breadcrumbs({ trail, tone = "light" }: { trail: Crumb[]; tone?: "light" | "dark" }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5">
      {trail.map((c, i) => {
        const last = i === trail.length - 1;
        return (
          <span key={c.path} className="flex items-center gap-1.5">
            {i > 0 ? (
              <span aria-hidden="true" className={cn("h-3 w-px", tone === "dark" ? "bg-[#22405a]" : "bg-[#d9e2ec]")} />
            ) : null}
            {last ? (
              <span aria-current="page" className={cn("font-mono text-[0.6875rem] uppercase tracking-[0.12em]", tone === "dark" ? "text-[#9fd6ff]" : "text-[#0a0f14]")}>
                {c.name}
              </span>
            ) : (
              <Link
                href={c.path}
                className={cn(
                  "font-mono text-[0.6875rem] uppercase tracking-[0.12em] transition-colors",
                  tone === "dark" ? "text-[#5f89a8] hover:text-[#cfe8ff]" : "text-[#8b97a3] hover:text-[#0a0f14]"
                )}
              >
                {c.name}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}

/** Interior page masthead — editorial, asymmetric, always owns the single H1. */
export function PageHeader({
  eyebrow,
  title,
  support,
  trail,
  tone = "light",
  accentWords,
  primary,
  secondary,
  meta,
  children,
}: {
  eyebrow: string;
  title: string;
  support: React.ReactNode;
  trail: Crumb[];
  tone?: "light" | "dark";
  accentWords?: string[];
  primary?: { href: string; label: string };
  secondary?: { href: string; label: string };
  meta?: { label: string; value: string }[];
  children?: React.ReactNode;
}) {
  const dark = tone === "dark";
  return (
    <header className={cn("relative overflow-hidden pt-28 pb-14 md:pt-36 md:pb-20", dark ? "rx-dark" : "bg-white")}>
      <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0", dark && "rx-grid")}>
        {!dark ? (
          <>
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(10,15,20,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(10,15,20,0.04) 1px, transparent 1px)",
                backgroundSize: "96px 96px",
                maskImage: "radial-gradient(90% 70% at 20% 0%, #000 10%, transparent 70%)",
              }}
            />
            <div
              className="absolute -right-32 -top-24 h-[34rem] w-[34rem] rounded-full opacity-50"
              style={{ background: "radial-gradient(circle, rgba(0,140,255,0.12), transparent 62%)" }}
            />
          </>
        ) : null}
      </div>

      <div className="rx-shell relative">
        <Breadcrumbs trail={trail} tone={tone} />

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)] lg:gap-16">
          <div>
            <p className={cn("t-eyebrow flex items-center gap-2.5", dark && "!text-[#66bfff]")}>
              <span aria-hidden="true" className={cn("inline-block h-px w-8", dark ? "bg-gradient-to-r from-transparent to-[#3aa6ff]" : "bg-gradient-to-r from-transparent to-[#9dc6ec]")} />
              {eyebrow}
            </p>
            <h1 className={cn("t-h1 mt-5 max-w-4xl", dark && "text-[color:var(--color-on-dark)]")}>
              <SplitWords text={title} accentWords={accentWords} />
            </h1>
            <Reveal delay={0.14}>
              <div className={cn("t-lede mt-6 max-w-2xl", dark ? "text-[#b3c2d1]" : "")}>{support}</div>
            </Reveal>
            {(primary || secondary) && (
              <Reveal delay={0.2}>
                <div className="mt-9 flex flex-wrap items-center gap-3">
                  {primary ? (
                    <Cta href={primary.href} event="nav_cta_click" eventProps={{ placement: "page_header" }}>
                      {primary.label}
                    </Cta>
                  ) : null}
                  {secondary ? (
                    <Cta href={secondary.href} variant={dark ? "onDark" : "ghost"} icon="arrow">
                      {secondary.label}
                    </Cta>
                  ) : null}
                </div>
              </Reveal>
            )}
          </div>

          {meta?.length ? (
            <Reveal delay={0.12}>
              <dl className={cn("grid gap-px overflow-hidden rounded-2xl border", dark ? "border-[#16283a] bg-[#16283a]" : "border-[#e4eaf1] bg-[#e4eaf1]")}>
                {meta.map((m) => (
                  <div key={m.label} className={cn("px-4 py-3.5", dark ? "bg-[#061220]" : "bg-white")}>
                    <dt className={cn("font-mono text-[0.5625rem] uppercase tracking-[0.14em]", dark ? "text-[#5f89a8]" : "text-[#8b97a3]")}>{m.label}</dt>
                    <dd className={cn("mt-1 font-display text-[0.9375rem] font-semibold tracking-[-0.01em]", dark ? "text-[#eaf4fb]" : "text-[#0a0f14]")}>{m.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          ) : null}
        </div>

        {children}
      </div>

      <div aria-hidden="true" className={cn("absolute inset-x-0 bottom-0 h-px", dark ? "bg-gradient-to-r from-transparent via-[#0f7fd0]/60 to-transparent" : "bg-gradient-to-r from-transparent via-[#bcd6ee] to-transparent")} />
    </header>
  );
}

/** Small section marker used inside long pages. */
export function SectionRule({ label, tone = "light" }: { label: string; tone?: "light" | "dark" }) {
  return (
    <div className="flex items-center gap-4 py-2" aria-hidden="true">
      <Icon name="spark" className={cn("h-3.5 w-3.5", tone === "dark" ? "text-[#66bfff]" : "text-[#0757a8]")} accent={false} strokeWidth={1.7} />
      <span className={cn("font-mono text-[0.625rem] uppercase tracking-[0.18em]", tone === "dark" ? "text-[#5f89a8]" : "text-[#8b97a3]")}>{label}</span>
      <span className={cn("h-px flex-1", tone === "dark" ? "bg-[#152a3c]" : "bg-[#e9eef4]")} />
    </div>
  );
}
