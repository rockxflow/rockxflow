import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";
import { MediaImage } from "@/components/ui/MediaImage";
import { media } from "@/lib/media";
import { principles } from "@/lib/site";

/**
 * Trust is built from principles and depth of process — no logos, no quotes,
 * no numbers we cannot substantiate.
 */
export function TrustSection() {
  return (
    <section id="why" className="rx-section relative overflow-hidden bg-white scroll-mt-24">
      <div className="rx-shell">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Why Rockxflow"
              title="Built Like Software. Run Like Operations."
              support="Anyone can wire a chatbot to a spreadsheet. What matters is whether the system still behaves correctly in month seven, on a bad day, when the person who set it up is busy."
            />

            <RevealGroup className="mt-10 grid gap-x-8 gap-y-7 sm:grid-cols-2">
              {principles.map((p, i) => (
                <RevealItem key={p.title}>
                  <div className="group relative pt-5">
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 top-0 h-px bg-[#e9eef4] transition-colors duration-500 group-hover:bg-[#008cff]"
                      style={{ transformOrigin: "left" }}
                    />
                    <p className="t-mono mb-2 flex items-center gap-2 text-[#8b97a3]">
                      <Icon name="check" className="h-3.5 w-3.5 text-[#22c55e]" accent={false} strokeWidth={2.2} />
                      {String(i + 1).padStart(2, "0")}
                    </p>
                    <h3 className="font-display text-[1.0625rem] font-bold tracking-[-0.018em] text-[#0a0f14]">{p.title}</h3>
                    <p className="mt-2 text-[0.9375rem] leading-relaxed text-[#414c57]">{p.body}</p>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>

          <div className="flex flex-col gap-5">
            <Reveal y={22}>
              <figure className="overflow-hidden rounded-2xl border border-[#e4eaf1] bg-[#f7f9fc]">
                <MediaImage
                  manifest={media.systemCore}
                  alt="Abstract render of an intelligent core: data streams from many sources converging into a single organised system"
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  mask
                  imgClassName="transition-transform duration-[1.6s] hover:scale-[1.03]"
                />
                <figcaption className="flex items-center justify-between gap-4 border-t border-hairline px-4 py-3">
                  <span className="t-small">One layer, many sources — the shape we build towards.</span>
                  <span className="t-mono shrink-0 uppercase tracking-[0.12em] text-[#0757a8]">system view</span>
                </figcaption>
              </figure>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="rounded-2xl border border-[#e4eaf1] bg-[#f7f9fc] p-5">
                <p className="t-eyebrow">What we will not do</p>
                <ul className="mt-3.5 space-y-2.5">
                  {[
                    "Promise AI that replaces your team.",
                    "Sell a tool because we earn on it.",
                    "Automate a process nobody has mapped.",
                    "Publish numbers we did not measure.",
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-2.5 text-[0.9375rem] leading-relaxed text-[#414c57]">
                      <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#f04438]" />
                      {t}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 border-t border-[#e4eaf1] pt-3.5 text-[0.8125rem] leading-relaxed text-[#66717d]">
                  If automation is the wrong answer for one of your processes, the honest recommendation is to leave it
                  alone — and we will tell you that on the call.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.14}>
              <figure className="overflow-hidden rounded-2xl border border-[#e4eaf1]">
                <MediaImage
                  manifest={media.operationsLight}
                  alt="A calm, minimal modern workspace with a laptop showing a blurred dashboard"
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  imgClassName="transition-transform duration-[1.6s] hover:scale-[1.03]"
                />
                <figcaption className="border-t border-hairline bg-white px-4 py-3 text-[0.8125rem] text-[#66717d]">
                  The goal is quieter operations: the system humming in the background, people doing the interesting part.
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
