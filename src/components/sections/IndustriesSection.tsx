import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";
import { Cta } from "@/components/ui/Cta";
import { industries } from "@/lib/site";

/**
 * Where these systems can be applied — phrased as opportunity, never as
 * portfolio. No client logos, no invented engagements.
 */
export function IndustriesSection() {
  return (
    <section id="industries" className="rx-section relative overflow-hidden bg-[#04080f] scroll-mt-24">
      <div aria-hidden="true" className="absolute inset-0">
        <img
          src="/media/flow_dark-1280.webp"
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover opacity-[0.55]"
          style={{ maskImage: "radial-gradient(120% 90% at 70% 20%, #000 8%, transparent 72%)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#04080f] via-[#04080f]/72 to-[#04080f]" />
      </div>

      <div className="rx-shell relative">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            tone="dark"
            eyebrow="Where this applies"
            title="Same Pattern, Any Operation."
            support="Volume of enquiries, repetitive documents, tools that do not talk. Change the vocabulary and the architecture is nearly identical."
          />
          <Reveal delay={0.08}>
            <p className="t-small max-w-[19rem] border-l border-[#1d3a52] pl-4 lg:text-right lg:border-l-0 lg:border-r lg:pl-0 lg:pr-4">
              Presented as example automation opportunities — not as past engagements.
            </p>
          </Reveal>
        </div>

        <div
          className="mt-11 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          tabIndex={0}
          role="list"
          aria-label="Industry examples"
        >
          {industries.map((ind, i) => (
            <Reveal key={ind.name} delay={Math.min(i * 0.05, 0.2)} className="shrink-0 snap-start">
              <article className="group flex h-full w-[17.5rem] flex-col justify-between rounded-2xl border border-[#16283a] bg-[#061220]/75 p-5 transition-all duration-500 hover:-translate-y-1 hover:border-[#2a6f9f] hover:bg-[#0a1c2c] sm:w-[19rem]">
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-[1.125rem] font-bold leading-snug tracking-[-0.02em] text-[#eaf4fb]">{ind.name}</h3>
                    <span className="t-mono text-[#33536d]">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <p className="mt-1.5 font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-[#5f89a8]">{ind.note}</p>
                  <ul className="mt-4 space-y-2.5">
                    {ind.items.map((it) => (
                      <li key={it} className="flex items-start gap-2.5 text-[0.875rem] leading-snug text-[#a8c0d4]">
                        <span aria-hidden="true" className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#00d9ff] transition-transform duration-500 group-hover:scale-150" />
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-5 flex items-center justify-between border-t border-[#12283c] pt-3">
                  <span className="t-mono flex items-center gap-1.5 text-[#5f7f99]">
                    <Icon name="pipeline" className="h-3.5 w-3.5" accent={false} strokeWidth={1.7} />
                    2–3 workflows
                  </span>
                  <span className="t-mono text-[0.5625rem] uppercase tracking-[0.12em] text-[#33536d] transition-colors group-hover:text-[#8fd7ff]">
                    typical first scope
                  </span>
                </div>
              </article>
            </Reveal>
          ))}

          <Reveal delay={0.24} className="shrink-0 snap-start">
            <div className="flex h-full w-[17.5rem] flex-col justify-between rounded-2xl border border-dashed border-[#24445e] bg-[#04101a]/60 p-5 sm:w-[19rem]">
              <div>
                <h3 className="font-display text-[1.125rem] font-bold leading-snug tracking-[-0.02em] text-[#eaf4fb]">Your industry here</h3>
                <p className="mt-2 text-[0.875rem] leading-relaxed text-[#9db4c8]">
                  Send us the three sentences you repeat most at work. That is usually the workflow.
                </p>
              </div>
              <Cta href="/contact?type=discovery" variant="onDark" size="sm" icon="arrow" className="mt-5 w-full">
                Describe your process
              </Cta>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
