import Link from "next/link";
import { Icon, type IconName } from "@/components/ui/Icon";
import { services } from "@/lib/site";

const picks: { icon: IconName; slug: string; label: string }[] = [
  { icon: "pipeline", slug: "ai-workflow-automation", label: "Workflow Automation" },
  { icon: "agent", slug: "ai-agents", label: "AI Agents" },
  { icon: "chat", slug: "ai-chatbots", label: "Chatbots" },
  { icon: "voice", slug: "voice-ai", label: "Voice AI" },
  { icon: "whatsapp", slug: "whatsapp-automation", label: "WhatsApp" },
  { icon: "crm", slug: "crm-sales-automation", label: "CRM Automation" },
  { icon: "documents", slug: "document-ai", label: "Document AI" },
  { icon: "dashboard", slug: "ai-dashboards-reporting", label: "Reporting" },
  { icon: "integrations", slug: "custom-ai-integrations", label: "Integrations" },
];

/** Thin navigational band: the nine capabilities as a single editorial line. */
export function CapabilityBand() {
  return (
    <section aria-label="Capabilities" className="relative border-y border-[#e4eaf1] bg-white/70">
      <div className="rx-shell">
        <ul className="flex flex-wrap items-center justify-center gap-x-1.5 gap-y-0 py-4 lg:justify-between">
          {picks.map((p, i) => (
            <li key={p.slug} className="flex items-center">
              <Link
                href={`/services#${p.slug}`}
                className="group flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors duration-300 hover:bg-[#f2f7fd]"
              >
                <Icon name={p.icon} className="h-4 w-4 text-[#8b97a3] transition-colors duration-300 group-hover:text-[#008cff]" accent={false} strokeWidth={1.7} />
                <span className="font-display text-[0.8125rem] font-semibold tracking-[-0.01em] text-[#414c57] transition-colors duration-300 group-hover:text-[#0a0f14]">
                  {p.label}
                </span>
              </Link>
              {i < picks.length - 1 ? (
                <span aria-hidden="true" className="ml-1.5 hidden h-3 w-px bg-[#e4eaf1] lg:block" />
              ) : null}
            </li>
          ))}
        </ul>
      </div>
      <span className="sr-only">Rockxflow offers {services.length} core services, listed above.</span>
    </section>
  );
}
