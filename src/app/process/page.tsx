import type { Metadata } from "next";
import { PageHeader, SectionRule } from "@/components/ui/PageHeader";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ProcessTimeline } from "@/components/sections/ProcessSection";
import { SignatureWorkflow } from "@/components/sections/SignatureWorkflow";
import { FinalCta } from "@/components/sections/FinalCta";
import { Icon } from "@/components/ui/Icon";
import { Cta } from "@/components/ui/Cta";
import { MediaImage } from "@/components/ui/MediaImage";
import { media } from "@/lib/media";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { principles, strategyCallHref } from "@/lib/site";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Our AI Automation Process | Discover to Optimise",
    description:
      "How Rockxflow delivers automation: discover, map, design, build, integrate, test, launch and optimise — with documented handover at every stage.",
    path: "/process",
    keywords: ["AI automation process", "automation implementation", "workflow mapping", "AI integration lifecycle"],
  }),
  alternates: { canonical: "/process" },
};

const trail = [{ name: "Home", path: "/" }, { name: "Process", path: "/process" }];

export default function ProcessPage() {
  return (
    <>
      <PageHeader
        tone="dark"
        eyebrow="Process"
        title="From Business Problem to Intelligent System."
        support="Eight stages, no mystery. You always know what is being built, why, and what lands in your hands at the end of each step."
        trail={trail}
        primary={{ href: strategyCallHref, label: "Start with a Strategy Call" }}
        secondary={{ href: "/solutions", label: "See what it delivers" }}
        meta={[
          { label: "Typical first build", value: "4–8 weeks, one to three workflows" },
          { label: "Your time commitment", value: "About 2–4 working sessions per phase" },
          { label: "Handover", value: "Documentation, dashboards and a team walkthrough" },
        ]}
      />

      <div className="rx-dark relative overflow-hidden py-16 md:py-20">
        <div className="rx-grid absolute inset-0" aria-hidden="true" />
        <div className="rx-shell relative">
          <SectionHeading
            tone="dark"
            eyebrow="The eight stages"
            title="A Process Built for Systems That Must Keep Working."
            support="Scroll the timeline, or open any stage to see exactly what you receive. Nothing here is optional paperwork — each output exists because a later step depends on it."
          />
          <ProcessTimeline />
        </div>
      </div>

      <section className="rx-section bg-white">
        <div className="rx-shell">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <SectionRule label="What we need from you" />
              <h2 className="t-h2 mt-4">Four things that make a build succeed</h2>
              <Reveal>
                <ul className="mt-6 space-y-4">
                  {[
                    { t: "A person who owns the process", d: "Someone who can answer “what actually happens when X is missing?” and approve the rules." },
                    { t: "Access to the systems involved", d: "CRM, mailbox, sheets, messaging accounts — scoped to the minimum the workflow needs." },
                    { t: "A week of real volume", d: "Recent examples, so the build is tested against what actually arrives and not what we imagine." },
                    { t: "Willingness to change the process", d: "Automation that mirrors a broken process just makes the broken part faster." },
                  ].map((r, i) => (
                    <li key={r.t} className="flex gap-4">
                      <span className="t-mono mt-1 shrink-0 text-[#008cff]">{String(i + 1).padStart(2, "0")}</span>
                      <span>
                        <span className="block font-display text-[1.0625rem] font-bold tracking-[-0.018em] text-[#0a0f14]">{r.t}</span>
                        <span className="mt-1 block text-[0.9375rem] leading-relaxed text-[#414c57]">{r.d}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

            <div>
              <SectionRule label="Commitments we make" />
              <h2 className="t-h2 mt-4">Working principles, in writing</h2>
              <Reveal delay={0.06}>
                <div className="mt-6 space-y-2.5">
                  {principles.map((p) => (
                    <div
                      key={p.title}
                      className="group flex items-start gap-3.5 rounded-xl border border-[#e4eaf1] bg-[#f9fbfd] p-4 transition-all duration-500 hover:border-[#cfe3f7] hover:bg-white"
                    >
                      <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-[#e4eaf1] bg-white text-[#0757a8] transition-transform duration-500 group-hover:scale-105">
                        <Icon name="shield" className="h-3.5 w-3.5" accent={false} strokeWidth={1.8} />
                      </span>
                      <span>
                        <span className="block font-display text-[0.9375rem] font-bold uppercase tracking-[0.02em] text-[#0a0f14]">{p.title}</span>
                        <span className="mt-1 block text-[0.875rem] leading-relaxed text-[#414c57]">{p.body}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>

          <Reveal delay={0.1}>
            <figure className="mt-14 grid items-center gap-6 overflow-hidden rounded-2xl border border-[#e4eaf1] bg-[#f7f9fc] p-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-8 lg:p-6">
              <div>
                <p className="t-eyebrow">After launch</p>
                <h2 className="t-h3 mt-3">The part most builds skip</h2>
                <p className="t-body mt-3 max-w-lg">
                  Once a system is live, the work becomes watching it: which cases humans overrode, which rules were too
                  strict, where volume shifted. That review is scheduled, not optional — it is how a workflow stays
                  correct as your business moves.
                </p>
                <Cta href="/contact?type=support" size="sm" className="mt-5" event="nav_cta_click" eventProps={{ placement: "process_aftercare" }}>
                  Talk about ongoing optimisation
                </Cta>
              </div>
              <MediaImage
                manifest={media.heroC}
                alt="Glowing ring of connected nodes representing a continuously optimised automation loop"
                sizes="(min-width: 1024px) 46vw, 100vw"
                className="rounded-xl"
                mask
              />
            </figure>
          </Reveal>
        </div>
      </section>

      <SignatureWorkflow />
      <FinalCta />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(trail)) }} />
    </>
  );
}
