import type { ReactNode } from "react";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";
import { site, strategyCallHref } from "@/lib/site";
import { Breadcrumbs, type Crumb } from "@/components/ui/PageHeader";

export type Section = { id: string; h: string; p: (string | ReactNode)[]; list?: string[] };

/** Shared shell for Privacy & Terms: readable typography, an index, and a live contact route. */
export function LegalPage({
  eyebrow,
  title,
  intro,
  updated,
  trail,
  sections,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  updated: string;
  trail: Crumb[];
  sections: Section[];
}) {
  return (
    <>
      <header className="relative overflow-hidden border-b border-[#e4eaf1] bg-white pt-28 pb-12 md:pt-36">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(10,15,20,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(10,15,20,0.035) 1px, transparent 1px)",
              backgroundSize: "96px 96px",
              maskImage: "radial-gradient(80% 70% at 15% 0%, #000 10%, transparent 68%)",
            }}
          />
        </div>
        <div className="rx-shell relative">
          <Breadcrumbs trail={trail} />
          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.6fr)] lg:gap-16">
            <div>
              <p className="t-eyebrow">{eyebrow}</p>
              <h1 className="t-h1 mt-4">{title}</h1>
              <p className="t-lede mt-5 max-w-2xl">{intro}</p>
              <p className="t-small mt-5 flex items-center gap-2">
                <Icon name="clock" className="h-3.5 w-3.5 text-[#0757a8]" accent={false} strokeWidth={1.8} />
                Last updated: {updated}
              </p>
            </div>
            <Reveal delay={0.08}>
              <div className="rounded-2xl border border-[#e4eaf1] bg-[#f7f9fc] p-4">
                <p className="t-mono uppercase tracking-[0.14em] text-[#8b97a3]">In this document</p>
                <ol className="mt-3 space-y-1.5">
                  {sections.map((s, i) => (
                    <li key={s.id}>
                      <a href={`#${s.id}`} className="group flex items-baseline gap-2 text-[0.875rem] text-[#414c57] transition-colors hover:text-[#0757a8]">
                        <span className="t-mono text-[#aab4bf] group-hover:text-[#008cff]">{String(i + 1).padStart(2, "0")}</span>
                        <span className="underline-offset-2 group-hover:underline">{s.h}</span>
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            </Reveal>
          </div>
        </div>
      </header>

      <article className="rx-section bg-[color:var(--color-canvas)]">
        <div className="rx-narrow">
          <div className="rx-legal">
            {sections.map((s, i) => (
              <section key={s.id} id={s.id} className="scroll-mt-28">
                <h2>
                  <span className="t-mono mr-3 text-[#008cff]">{String(i + 1).padStart(2, "0")}</span>
                  {s.h}
                </h2>
                {s.p.map((para, k) => (
                  <p key={k}>{para}</p>
                ))}
                {s.list ? (
                  <ul>
                    {s.list.map((li) => (
                      <li key={li}>{li}</li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-[#e4eaf1] bg-white p-5 sm:flex sm:items-center sm:justify-between sm:gap-6">
            <div>
              <p className="t-eyebrow">Questions about this document</p>
              <p className="t-body mt-2 max-w-md text-[0.9375rem]">
                Write to us and we will answer in plain language — including anything you would like clarified before an
                engagement.
              </p>
            </div>
            <div className="mt-4 flex shrink-0 flex-col gap-2 sm:mt-0">
              <a href={`mailto:${site.email}`} className="rx-btn rx-btn-ghost rx-btn-sm">
                <Icon name="mail" className="h-4 w-4" accent={false} strokeWidth={1.7} />
                {site.email}
              </a>
              <Link href={strategyCallHref} className="rx-btn rx-btn-primary rx-btn-sm">
                Contact form
                <Icon name="arrow" className="h-3.5 w-3.5" accent={false} strokeWidth={2} />
              </Link>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
