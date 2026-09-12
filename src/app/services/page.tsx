import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, SectionRule } from "@/components/ui/PageHeader";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";
import { Cta, TextLink } from "@/components/ui/Cta";
import { ServiceVisual } from "@/components/viz/ServiceVisuals";
import { ServicesIndex } from "@/components/sections/ServicesIndex";
import { Accordion } from "@/components/ui/Accordion";
import { FinalCta } from "@/components/sections/FinalCta";
import { FaqBlock } from "@/components/sections/FaqBlock";
import { buildMetadata, breadcrumbJsonLd, servicesJsonLd, faqJsonLd } from "@/lib/seo";
import { faqs, services, site, strategyCallHref } from "@/lib/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "AI Automation Services | AI Workflow Automation, Agents, Chatbots, Voice AI",
    description:
      "Rockxflow builds AI workflow automation, AI agents, chatbots, voice AI, WhatsApp and CRM automation, document AI, dashboards and custom AI integrations for businesses.",
    path: "/services",
    keywords: [
      "AI Workflow Automation",
      "AI Agents",
      "AI Chatbots",
      "AI Voice Agents",
      "WhatsApp Automation",
      "CRM Automation",
      "Document AI",
      "AI Dashboards & Reporting",
      "Custom AI Integrations",
    ],
  }),
  alternates: { canonical: "/services" },
};

const trail = [{ name: "Home", path: "/" }, { name: "Services", path: "/services" }];

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="AI Automation Services Built Around Your Business."
        support={
          <>
            Nine capabilities that combine into working systems. Each one starts from a process that costs you time —
            never from a technology we want to sell.
          </>
        }
        trail={trail}
        primary={{ href: strategyCallHref, label: "Book a Strategy Call" }}
        secondary={{ href: "/solutions", label: "See solutions by outcome" }}
        meta={[
          { label: "Capabilities", value: `${services.length} core services, usually combined` },
          { label: "Typical first build", value: "1–3 workflows, live inside 4–8 weeks" },
          { label: "Starting point", value: "A mapped process and a measurable pain" },
        ]}
      />

      <div className="rx-section relative bg-white pt-14 md:pt-16">
        <div className="rx-shell">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] lg:gap-12">
            <aside className="hidden lg:block">
              <ServicesIndex items={services.map((s) => ({ slug: s.slug, index: s.index, title: s.title }))} />
            </aside>

            <div className="lg:hidden">
              <ServicesIndex items={services.map((s) => ({ slug: s.slug, index: s.index, title: s.title }))} />
            </div>

            <div className="mt-0 space-y-4 lg:mt-[-3.5rem] lg:space-y-0">
              {services.map((s, i) => {
                const flip = i % 2 === 1;
                return (
                  <article
                    key={s.slug}
                    id={s.slug}
                    className={cn(
                      "relative scroll-mt-28 border-t border-[#eef2f6] py-12 first:border-t-0 lg:py-16",
                      i === 2 || i === 5 ? "bg-[#f7f9fc]" : "bg-transparent"
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -top-2 right-0 select-none font-display text-[6rem] font-extrabold leading-none tracking-[-0.06em] text-[#0a0f14]/[0.045] lg:text-[9rem]"
                    >
                      {s.index}
                    </span>

                    <div className={cn("relative grid items-start gap-8 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,1.08fr)] lg:gap-10")}>
                      <div className={cn(flip && "lg:order-2")}>
                        <p className="t-eyebrow flex items-center gap-2.5">
                          <span className="text-[#008cff]">{s.index}</span>
                          <span className="h-px w-6 bg-[#9dc6ec]" aria-hidden="true" />
                          {s.kicker}
                        </p>
                        <h2 className="t-h2 mt-3.5">{s.title}</h2>
                        <p className="t-lede mt-4 max-w-xl">{s.summary}</p>

                        <div className="mt-6 rounded-xl border border-[#e4eaf1] bg-white p-4">
                          <p className="t-mono uppercase tracking-[0.14em] text-[#f04438]">The problem today</p>
                          <p className="mt-2 text-[0.9375rem] leading-relaxed text-[#414c57]">{s.problem}</p>
                        </div>

                        <div className="mt-6">
                          <p className="t-mono uppercase tracking-[0.14em] text-[#8b97a3]">What you get</p>
                          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                            {s.deliverables.map((d) => (
                              <li key={d} className="flex items-start gap-2.5 text-[0.9375rem] leading-snug text-[#2b3541]">
                                <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-[#0757a8]" accent={false} strokeWidth={2} />
                                {d}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <p className="mt-6 border-t border-[#eef2f6] pt-4 text-[0.9375rem] leading-relaxed text-[#414c57]">
                          <span className="font-semibold text-[#0a0f14]">Why it matters: </span>
                          {s.benefit}
                        </p>

                        <div className="mt-6 flex flex-wrap items-center gap-3">
                          <Cta href={`/contact?type=service&service=${s.slug}`} size="sm" event="service_open" eventProps={{ service: s.slug }}>
                            Discuss {s.title}
                          </Cta>
                          <TextLink href={site.whatsapp} icon="whatsapp" event="cta_whatsapp" eventProps={{ placement: `service-${s.slug}` }}>
                            Ask a quick question
                          </TextLink>
                        </div>
                      </div>

                      <div className={cn("relative", flip && "lg:order-1")}>
                        <ServiceVisual kind={s.visual} steps={s.steps} />
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="rx-dark relative overflow-hidden">
        <div className="rx-grid absolute inset-0" aria-hidden="true" />
        <div className="rx-shell relative py-16 md:py-20">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14">
            <SectionHeading
              tone="dark"
              eyebrow="Combining services"
              title="Systems Are Made of Workflows, Not Services."
              support="Most businesses start with one workflow — inbound leads, support messages, document intake — then extend the same architecture to the next process. Here is how typical first builds come together."
            />
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { t: "Sales engine", a: "AI Workflow Automation", b: "CRM & Sales Automation", c: "WhatsApp Automation" },
                { t: "Support desk", a: "AI Chatbots", b: "Voice AI", c: "AI Dashboards & Reporting" },
                { t: "Back office", a: "Document AI", b: "AI Agents", c: "Custom AI Integrations" },
                { t: "Leadership view", a: "AI Dashboards & Reporting", b: "Custom AI Integrations", c: "AI Workflow Automation" },
              ].map((row, i) => (
                <Reveal key={row.t} delay={i * 0.06}>
                  <div className="group h-full rounded-2xl border border-[#16283a] bg-[#061220]/70 p-4 transition-all duration-500 hover:border-[#2a6f9f] hover:bg-[#0a1c2c]">
                    <p className="flex items-center justify-between font-display text-[1rem] font-bold tracking-[-0.02em] text-[#eaf4fb]">
                      {row.t}
                      <span className="t-mono text-[#33536d] transition-colors group-hover:text-[#8fd7ff]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </p>
                    <ul className="mt-3 space-y-1.5">
                      {[row.a, row.b, row.c].map((x) => (
                        <li key={x} className="flex items-center gap-2 text-[0.8125rem] text-[#a8c0d4]">
                          <span className="h-1 w-1 shrink-0 rounded-full bg-[#00d9ff]" aria-hidden="true" />
                          {x}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <div className="mt-12">
            <SectionRule label="Frequently asked" tone="dark" />
            <FaqBlock items={faqs.slice(0, 4)} tone="dark" />
          </div>

          <div className="mt-10 flex flex-col gap-4 rounded-2xl border border-[#1d3a52] bg-[#071523] p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-xl text-[0.9375rem] leading-relaxed text-[#b3c2d1]">
              Prefer to start with the outcome rather than the service list? The solutions page reframes everything by
              business problem.
            </p>
            <div className="flex shrink-0 gap-2.5">
              <Cta href="/solutions" variant="onDark" size="sm" icon="arrow">
                View solutions
              </Cta>
              <Link
                href="/process"
                className="rx-btn rx-btn-on-dark rx-btn-sm"
                aria-label="How we work, step by step"
              >
                How we work
              </Link>
            </div>
          </div>
        </div>
      </div>

      <FinalCta />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([servicesJsonLd(), breadcrumbJsonLd(trail), faqJsonLd(faqs.slice(0, 4))]) }}
      />
    </>
  );
}
