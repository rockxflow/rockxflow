import { Accordion } from "@/components/ui/Accordion";
import { Cta } from "@/components/ui/Cta";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

export function FaqBlock({
  items,
  tone = "light",
  idBase = "faq",
  showAside = true,
}: {
  items: readonly { q: string; a: string }[];
  tone?: "light" | "dark";
  idBase?: string;
  showAside?: boolean;
}) {
  const dark = tone === "dark";
  return (
    <div className={showAside ? "grid gap-8 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:gap-12" : undefined}>
      {showAside ? (
        <div>
          <p className={cn("t-eyebrow", dark && "!text-[#66bfff]")}>Straight answers</p>
          <h2 className={cn("t-h2 mt-4", dark ? "text-[color:var(--color-on-dark)]" : "text-[#0a0f14]")}>
            Questions We Get Before Every Build
          </h2>
          <p className={cn("mt-4 text-[0.9375rem] leading-relaxed", dark ? "text-[#9db4c8]" : "text-[#414c57]")}>
            If something here is still unclear, ask us directly — we would rather scope honestly than oversell.
          </p>
          <Cta
            href={site.whatsapp}
            variant={dark ? "onDark" : "ghost"}
            size="sm"
            icon="whatsapp"
            className="mt-5"
            event="cta_whatsapp"
            eventProps={{ placement: "faq" }}
          >
            Ask on WhatsApp
          </Cta>
        </div>
      ) : null}
      <Accordion items={items} tone={tone} idBase={idBase} />
    </div>
  );
}
