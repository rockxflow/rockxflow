import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ServiceTile } from "@/components/viz/ServiceTile";
import { Cta } from "@/components/ui/Cta";
import { services } from "@/lib/site";
import { Icon } from "@/components/ui/Icon";

/**
 * Nine services, five different tile geometries — deliberately not a repeating
 * card grid. Index positions are used so the layout reads as an editorial
 * table of capability.
 */
export function ServicesPreviewSection() {
  const by = (slug: string) => services.find((s) => s.slug === slug)!;

  return (
    <section id="services" className="rx-section relative scroll-mt-24 bg-[color:var(--color-canvas)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-64 opacity-70"
        style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.9), transparent)" }}
      />
      <div className="rx-shell relative">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Services"
            title="AI Automation Services Built Around Your Business."
            support="Nine capabilities, usually combined. Most engagements start with one workflow that hurts and grow from there."
          />
          <Reveal delay={0.1}>
            <Cta href="/services" variant="ghost">
              All nine services
            </Cta>
          </Reveal>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-12">
          <Reveal className="md:col-span-7">
            <ServiceTile service={by("ai-workflow-automation")} variant="feature" className="h-full" />
          </Reveal>
          <Reveal delay={0.06} className="md:col-span-5">
            <ServiceTile service={by("ai-agents")} variant="wide" className="h-full" />
          </Reveal>

          <Reveal className="md:col-span-4">
            <ServiceTile service={by("ai-chatbots")} className="h-full" />
          </Reveal>
          <Reveal delay={0.06} className="md:col-span-4">
            <ServiceTile service={by("voice-ai")} className="h-full" />
          </Reveal>
          <Reveal delay={0.12} className="md:col-span-4">
            <ServiceTile service={by("whatsapp-automation")} className="h-full" />
          </Reveal>

          <Reveal className="md:col-span-5">
            <ServiceTile service={by("crm-sales-automation")} variant="wide" className="h-full" />
          </Reveal>
          <Reveal delay={0.06} className="md:col-span-7">
            <ServiceTile service={by("document-ai")} variant="wide" className="h-full" />
          </Reveal>

          <Reveal className="md:col-span-6">
            <ServiceTile service={by("ai-dashboards-reporting")} className="h-full" />
          </Reveal>
          <Reveal delay={0.06} className="md:col-span-6">
            <ServiceTile service={by("custom-ai-integrations")} className="h-full" />
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="mt-4 flex flex-col items-start justify-between gap-4 rounded-2xl border border-[#e4eaf1] bg-white p-5 sm:flex-row sm:items-center">
            <p className="flex items-start gap-3 text-[0.9375rem] leading-relaxed text-[#414c57]">
              <Icon name="integrations" className="mt-0.5 h-5 w-5 shrink-0 text-[#0757a8]" accent={false} strokeWidth={1.6} />
              <span>
                Not sure which capability you need? Describe the process and we will tell you which of these — if any —
                is the right first build.
              </span>
            </p>
            <Cta href="/contact?type=discovery" variant="ghost" size="sm" icon="arrow">
              Scope it with us
            </Cta>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
