import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";
import { Cta, TextLink } from "@/components/ui/Cta";
import { AutomationSelector } from "@/components/sections/AutomationSelector";
import { IndustriesSection } from "@/components/sections/IndustriesSection";
import { FinalCta } from "@/components/sections/FinalCta";
import { buildMetadata, breadcrumbJsonLd, siteUrl } from "@/lib/seo";
import { industries, services, solutions, strategyCallHref } from "@/lib/site";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "AI Automation Solutions for Business Outcomes",
    description:
      "Automation built around your business: more leads captured, automatic follow-up, faster responses, less admin, connected tools, automated reporting and better customer experience.",
    path: "/solutions",
    keywords: [
      "business automation solutions",
      "lead automation",
      "customer support automation",
      "operations automation",
      "AI business solutions",
    ],
  }),
  alternates: { canonical: "/solutions" },
};

const trail = [{ name: "Home", path: "/" }, { name: "Solutions", path: "/solutions" }];

export default function SolutionsPage() {
  return (
    <>
      <PageHeader
        tone="dark"
        eyebrow="Solutions"
        title="Automation Built Around Your Business."
        support="Start from the problem, not the product. Each solution below is stated as a business result, then unpacked into the automation that produces it."
        trail={trail}
        primary={{ href: strategyCallHref, label: "Book a Strategy Call" }}
        secondary={{ href: "/services", label: "Browse services" }}
        meta={[
          { label: "How to read this", value: "Problem → Automation → Business result" },
          { label: "Nothing invented", value: "No claimed percentages or unnamed clients" },
          { label: "Best first step", value: "Pick the one line that stings most" },
        ]}
      />

      <section className="rx-section bg-white">
        <div className="rx-shell">
          <RevealGroup className="grid gap-4 md:grid-cols-2">
            {solutions.map((s, i) => (
              <RevealItem key={s.slug}>
                <article
                  id={s.slug}
                  className="group relative flex h-full scroll-mt-28 flex-col overflow-hidden rounded-2xl border border-[#e4eaf1] bg-white p-5 transition-all duration-500 hover:border-[#bcdcf7] hover:shadow-[var(--shadow-lift)] sm:p-6"
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 -top-px h-px scale-x-0 bg-gradient-to-r from-transparent via-[#008cff] to-transparent transition-transform duration-700 group-hover:scale-x-100"
                  />
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="font-display text-[1.25rem] font-bold leading-snug tracking-[-0.02em] text-[#0a0f14]">{s.title}</h2>
                    <span className="t-mono shrink-0 text-[#c3ccd6]">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <p className="mt-1.5 text-[0.9375rem] font-medium text-[#0757a8]">{s.blurb}</p>

                  <dl className="mt-5 space-y-3 border-t border-[#eef2f6] pt-4">
                    {[
                      { k: "Problem", v: s.problem, tone: "text-[#f04438]", icon: "clock" as const },
                      { k: "Automation", v: s.automation, tone: "text-[#008cff]", icon: "automate" as const },
                      { k: "Business result", v: s.result, tone: "text-[#22c55e]", icon: "check" as const },
                    ].map((row) => (
                      <div key={row.k} className="flex gap-3">
                        <span className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-lg border border-[#e4eaf1] bg-[#f7f9fc] ${row.tone}`}>
                          <Icon name={row.icon} className="h-3.5 w-3.5" accent={false} strokeWidth={1.9} />
                        </span>
                        <span className="min-w-0">
                          <dt className={`t-mono uppercase tracking-[0.14em] ${row.tone}`}>{row.k}</dt>
                          <dd className="mt-0.5 text-[0.9375rem] leading-relaxed text-[#414c57]">{row.v}</dd>
                        </span>
                      </div>
                    ))}
                  </dl>

                  <div className="mt-5 flex flex-wrap gap-1.5 border-t border-[#eef2f6] pt-4">
                    {s.services.map((svc) => (
                      <LinkChip key={svc} label={svc} />
                    ))}
                  </div>
                </article>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal delay={0.1}>
            <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-2xl border border-[#e4eaf1] bg-[#f7f9fc] p-5 sm:flex-row sm:items-center">
              <p className="max-w-2xl text-[0.9375rem] leading-relaxed text-[#414c57]">
                <span className="font-semibold text-[#0a0f14]">On results: </span>
                we do not publish percentage claims. What we publish is the method — mapping, build, testing, monitoring —
                and your own baseline once a system is live.
              </p>
              <Cta href="/process" variant="ghost" size="sm" icon="arrow">
                See the method
              </Cta>
            </div>
          </Reveal>
        </div>
      </section>

      <AutomationSelector />

      <section className="rx-section bg-white">
        <div className="rx-shell">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
            <SectionHeading
              eyebrow="Where to start"
              title="Pick One Process. Ship It. Then Extend."
              support="The fastest way to doubt automation is to automate everything at once. We prefer one workflow, measured properly, then a second that inherits the same architecture."
            />
            <RevealGroup className="space-y-3">
              {[
                { t: "Start with volume", b: "The workflow people complain about most is usually the one that repeats most — that is where hours come back fastest." },
                { t: "Keep a human in the loop", b: "Anything with money, promises or escalation potential stays reviewed. Automation prepares, people decide." },
                { t: "Measure before and after", b: "Time per case, response time, missed follow-ups. Three numbers are enough to know whether it worked." },
                { t: "Then reuse the pattern", b: "Once intake, routing and notification exist, the next workflow is a fraction of the effort." },
              ].map((r, i) => (
                <RevealItem key={r.t}>
                  <div className="flex gap-4 rounded-2xl border border-[#e4eaf1] bg-[#f9fbfd] p-4 transition-colors duration-400 hover:border-[#cfe3f7] hover:bg-white">
                    <span className="t-mono mt-0.5 text-[#008cff]">{String(i + 1).padStart(2, "0")}</span>
                    <span>
                      <h3 className="font-display text-[1.0625rem] font-bold tracking-[-0.018em] text-[#0a0f14]">{r.t}</h3>
                      <p className="mt-1 text-[0.9375rem] leading-relaxed text-[#414c57]">{r.b}</p>
                    </span>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>

          <Reveal delay={0.12}>
            <div className="mt-12 grid gap-3 rounded-2xl border border-[#e4eaf1] bg-[#f7f9fc] p-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="sm:col-span-2 lg:col-span-2">
                <p className="t-eyebrow">Applied by context</p>
                <p className="t-body mt-2 max-w-md">
                  {industries.length} operating contexts shown as example automation opportunities — the same solutions,
                  described in the language of each business.
                </p>
                <TextLink href="/about" className="mt-3">
                  How we decide what is worth automating
                </TextLink>
              </div>
              <ul className="grid gap-1.5 sm:col-span-2 lg:col-span-2 lg:grid-cols-2">
                {industries.slice(0, 6).map((ind) => (
                  <li key={ind.name} className="flex items-center gap-2 text-[0.875rem] text-[#414c57]">
                    <span className="h-1 w-1 shrink-0 rounded-full bg-[#008cff]" aria-hidden="true" />
                    {ind.name}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      <IndustriesSection />
      <FinalCta />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            breadcrumbJsonLd(trail),
            {
              "@context": "https://schema.org",
              "@type": "ItemList",
              name: "Rockxflow business solutions",
              itemListElement: solutions.map((s, i) => ({
                "@type": "ListItem",
                position: i + 1,
                item: {
                  "@type": "Solution",
                  name: s.title,
                  sentence: s.blurb,
                  url: `${siteUrl}/solutions#${s.slug}`,
                  serviceType: "Business automation",
                },
              })),
              numberOfItems: solutions.length,
            },
          ]),
        }}
      />
    </>
  );
}

function LinkChip({ label }: { label: string }) {
  const slug = services.find((s) => s.title === label)?.slug;
  const href = slug ? `/services#${slug}` : "/services";
  return (
    <Link
      href={href}
      className="rounded-lg border border-[#e4eaf1] bg-white px-2.5 py-1 font-mono text-[0.625rem] uppercase tracking-[0.08em] text-[#5a6673] transition-all duration-300 hover:-translate-y-px hover:border-[#bcdcf7] hover:text-[#0757a8]"
    >
      {label}
    </Link>
  );
}
