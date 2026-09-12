import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, SectionRule } from "@/components/ui/PageHeader";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";
import { Cta } from "@/components/ui/Cta";
import { TextLink } from "@/components/ui/Cta";
import { MediaImage } from "@/components/ui/MediaImage";
import { SystemSection } from "@/components/sections/SystemSection";
import { FinalCta } from "@/components/sections/FinalCta";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { media } from "@/lib/media";
import { pillars, services, site, strategyCallHref } from "@/lib/site";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "About Rockxflow | AI Automation Agency",
    description:
      "Rockxflow is an AI automation agency focused on turning business processes into intelligent systems — practical AI, connected tools, human oversight and systems built to scale.",
    path: "/about",
    keywords: ["AI automation agency about", "practical AI for business", "automation consultancy"],
  }),
  alternates: { canonical: "/about" },
};

const trail = [{ name: "Home", path: "/" }, { name: "About", path: "/about" }];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="Building Smarter Systems for Modern Businesses."
        support={
          <>
            Rockxflow is an AI automation agency focused on turning business processes into intelligent systems. We are
            not a chatbot shop with a new label — we build the plumbing that makes work move on its own.
          </>
        }
        trail={trail}
        accentWords={["smarter", "systems."]}
        primary={{ href: strategyCallHref, label: "Book a Strategy Call" }}
        secondary={{ href: "/services", label: "What we build" }}
        meta={[
          { label: "Category", value: site.category },
          { label: "How we work", value: "Remote-first, end to end" },
          { label: "Approach", value: "Map → Design → Build → Integrate → Test → Launch → Optimise" },
        ]}
      />

      {/* Statement */}
      <section className="rx-section bg-white">
        <div className="rx-shell">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
            <div>
              <SectionRule label="What we believe" />
              <h2 className="t-h1 mt-5 max-w-3xl">Most businesses don’t have a technology problem. They have a repetition problem.</h2>
              <Reveal delay={0.08}>
                <div className="t-body mt-6 space-y-5 max-w-2xl">
                  <p>
                    Somewhere between the tools, the inboxes and the spreadsheets, your team became the integration layer.
                    People read an email, retype it into a form, chase someone on chat, update a sheet, and repeat —
                    all day, on work that has a clear shape and needs no creativity at all.
                  </p>
                  <p>
                    Modern AI is finally good enough to take that shape: reading unstructured input, making bounded
                    decisions, and acting through your existing systems. Not to replace judgement — to remove the
                    scaffolding around it.
                  </p>
                  <p>
                    That is the whole thesis of Rockxflow. Understand a process precisely, then build a system that
                    performs it reliably, visibly and with a human in the places where judgement matters.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={0.14}>
                <blockquote className="mt-9 border-l-2 border-[#008cff] pl-5">
                  <p className="font-display text-[1.25rem] font-bold leading-snug tracking-[-0.02em] text-[#0a0f14]">
                    “If we cannot explain what the automation does when it fails, it is not ready to launch.”
                  </p>
                  <footer className="t-small mt-2.5">— the review standard we hold every system to</footer>
                </blockquote>
              </Reveal>
            </div>

            <Reveal y={22} delay={0.1}>
              <div className="lg:sticky lg:top-28">
                <figure className="overflow-hidden rounded-2xl border border-[#e4eaf1]">
                  <MediaImage
                    manifest={media.heroB}
                    alt="Abstract render of a luminous network node with blue light paths radiating outward"
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    mask
                  />
                  <figcaption className="border-t border-hairline bg-white px-4 py-3 text-[0.8125rem] leading-relaxed text-[#66717d]">
                    One decision point, many connections. The value is rarely in the AI itself — it is in how cleanly it
                    is wired to what your team already uses.
                  </figcaption>
                </figure>

                <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[#e4eaf1] bg-[#e4eaf1]">
                  {[
                    { k: "We are paid for", v: "hours saved, leads answered, errors avoided" },
                    { k: "We are not", v: "resellers of any single platform" },
                    { k: "Best fit", v: "repetitive, high-volume, rule-shaped work" },
                    { k: "Poor fit", v: "one-off tasks or unexamined processes" },
                  ].map((r) => (
                    <div key={r.k} className="bg-white px-4 py-3.5">
                      <dt className="t-mono uppercase tracking-[0.12em] text-[#8b97a3]">{r.k}</dt>
                      <dd className="mt-1 text-[0.875rem] leading-snug text-[#0a0f14]">{r.v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* How we approach automation */}
      <section className="rx-section bg-[color:var(--color-canvas)]">
        <div className="rx-shell">
          <SectionHeading
            eyebrow="Approach"
            title="Practical AI, Engineered Like Operations Software."
            support="Four commitments shape every architecture decision we make — and they are the reason our builds survive contact with real workloads."
          />
          <RevealGroup className="mt-12 grid gap-4 md:grid-cols-2">
            {[
              {
                t: "Reliability over cleverness",
                b: "A model that guesses well is useless if the workflow loses a record. Validation, retries, dedupe and alerting are part of the build, not an afterthought.",
                icon: "shield" as const,
              },
              {
                t: "Deterministic where it counts",
                b: "LLMs read and reason; hard rules decide. Anything involving money, promises or policy is expressed as code you can audit, not prose you hope is followed.",
                icon: "pipeline" as const,
              },
              {
                t: "Human oversight by design",
                b: "Approval gates, escalation thresholds and full activity logs. AI agents assist your team; they do not quietly become your team.",
                icon: "agent" as const,
              },
              {
                t: "Built to be handed over",
                b: "Documented flows, readable naming, your accounts where platforms allow it. A system that only we understand is a liability, not a deliverable.",
                icon: "connect" as const,
              },
            ].map((c, i) => (
              <RevealItem key={c.t}>
                <article className="group h-full rounded-2xl border border-[#e4eaf1] bg-white p-5 transition-all duration-500 hover:border-[#bcdcf7] hover:shadow-[var(--shadow-lift)] sm:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <span className="grid h-10 w-10 place-items-center rounded-xl border border-[#e4eaf1] bg-[#f7f9fc] text-[#0757a8] transition-transform duration-500 group-hover:-translate-y-0.5">
                      <Icon name={c.icon} className="h-5 w-5" accent={false} strokeWidth={1.6} />
                    </span>
                    <span className="t-mono text-[#c3ccd6]">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <h3 className="mt-4 font-display text-[1.1875rem] font-bold tracking-[-0.022em] text-[#0a0f14]">{c.t}</h3>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-[#414c57]">{c.b}</p>
                </article>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <SystemSection />

      {/* Principles + pillars recap, typographic */}
      <section className="rx-section bg-white">
        <div className="rx-shell">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-16">
            <div>
              <SectionRule label="Why it matters" />
              <h2 className="t-h2 mt-4">Practical automation matters because theory does not ship.</h2>
              <Reveal delay={0.06}>
                <div className="t-body mt-5 space-y-4">
                  <p>
                    Any process you describe can be automated somewhere. The hard part is knowing which one pays for
                    itself first, which step a machine should never own, and what happens the day the input is slightly
                    different from yesterday.
                  </p>
                  <p>
                    We treat automation as infrastructure: boring on purpose, documented, monitored, and boring in the
                    best way — it simply keeps working while the business grows around it.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={0.12}>
                <ul className="mt-8 grid gap-2.5 sm:grid-cols-2">
                  {pillars.map((p) => (
                    <li key={p.key} className="rounded-xl border border-[#e4eaf1] bg-[#f9fbfd] px-4 py-3.5">
                      <span className="font-display text-[0.8125rem] font-bold uppercase tracking-[0.06em] text-[#0757a8]">{p.title}</span>
                      <span className="mt-1 block text-[0.875rem] leading-snug text-[#414c57]">{p.line}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

            <div>
              <SectionRule label="What we work on" />
              <h2 className="t-h2 mt-4">Nine services, one operating system for your business.</h2>
              <Reveal delay={0.06}>
                <ol className="mt-6 divide-y divide-[#eef2f6] border-y border-[#eef2f6]">
                  {services.map((svc, i) => (
                    <li key={svc.slug}>
                      <Link href={`/services#${svc.slug}`}
                        className="group flex items-center justify-between gap-4 py-3 transition-colors hover:bg-[#fafcfe]"
                      >
                        <span className="flex items-center gap-3.5">
                          <span className="t-mono w-6 text-[#aab4bf] transition-colors group-hover:text-[#008cff]">{svc.index}</span>
                          <span className="font-display text-[1rem] font-semibold tracking-[-0.015em] text-[#0a0f14]">{svc.title}</span>
                        </span>
                        <Icon name="arrow" className="h-4 w-4 shrink-0 text-[#c3ccd6] transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#008cff]" accent={false} strokeWidth={2} />
                      </Link>
                    </li>
                  ))}
                </ol>
              </Reveal>
              <Reveal delay={0.12}>
                <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
                  <Cta href={strategyCallHref} size="sm">
                    Book a Strategy Call
                  </Cta>
                  <TextLink href="/solutions">See solutions by outcome</TextLink>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <FinalCta />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(trail)) }} />
    </>
  );
}
