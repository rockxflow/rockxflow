import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Icon, type IconName } from "@/components/ui/Icon";
import { TextLink } from "@/components/ui/Cta";
import { DashboardPanel } from "@/components/viz/DashboardPanel";
import { solutions } from "@/lib/site";

const chosen: { title: string; icon: IconName; from: string; to: string }[] = [
  { title: "First reply in seconds", icon: "accelerate", from: "Enquiries wait in a shared inbox", to: "Acknowledged, routed and booked the moment they land" },
  { title: "Nothing falls out", icon: "shield", from: "Follow-ups depend on memory", to: "Every open thread has an owner and a next action" },
  { title: "Data entered once", icon: "connect", from: "The same details retyped across four tools", to: "One capture, then every system is updated for you" },
  { title: "Reports that arrive", icon: "dashboard", from: "Manual spreadsheets rebuilt weekly", to: "KPIs assembled and delivered on schedule" },
  { title: "Staff on judgement", icon: "agent", from: "People doing clerical work all day", to: "People reviewing exceptions and talking to customers" },
];

export function OutcomesSection() {
  return (
    <section id="outcomes" className="rx-section relative bg-white scroll-mt-24">
      <div className="rx-shell">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Business outcomes"
              title="What Changes After the First System Ships."
              support="We measure success in returned hours and responded leads — not in how clever the automation looks."
            />

            <RevealGroup className="mt-10 divide-y divide-[#e9eef4] border-y border-[#e9eef4]">
              {chosen.map((c) => (
                <RevealItem key={c.title}>
                  <div className="group flex items-start gap-4 py-5 transition-colors duration-400 hover:bg-[#fafcfe]">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[#e4eaf1] bg-white text-[#0757a8] transition-all duration-400 group-hover:border-[#bcdcf7] group-hover:text-[#008cff]">
                      <Icon name={c.icon} className="h-4.5 w-4.5" accent={false} strokeWidth={1.7} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <h3 className="font-display text-[1.0625rem] font-bold tracking-[-0.015em] text-[#0a0f14]">{c.title}</h3>
                      <p className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[0.875rem]">
                        <span className="text-[#96a2ae] line-through decoration-[#d8e0e8]">{c.from}</span>
                        <Icon name="arrow" className="h-3.5 w-3.5 text-[#008cff]" accent={false} strokeWidth={2} />
                        <span className="font-medium text-[#0a0f14]">{c.to}</span>
                      </p>
                    </span>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>

            <Reveal delay={0.1}>
              <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
                <TextLink href="/solutions" event="nav_cta_click" eventProps={{ placement: "outcomes" }}>
                  Explore {solutions.length} outcome-focused solutions
                </TextLink>
                <p className="t-small flex items-center gap-2">
                  <Icon name="spark" className="h-3.5 w-3.5 text-[#0757a8]" accent={false} strokeWidth={1.7} />
                  No invented numbers here — figures come from your own baseline once a system runs.
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal y={22} delay={0.06}>
            <div className="lg:sticky lg:top-28">
              <DashboardPanel />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
