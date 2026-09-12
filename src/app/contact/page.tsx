import type { Metadata } from "next";
import { PageHeader, SectionRule } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";
import { Cta } from "@/components/ui/Cta";
import { ContactForm } from "@/components/forms/ContactForm";
import { ParamNotes } from "@/components/forms/ParamNotes";
import { FaqBlock } from "@/components/sections/FaqBlock";
import { buildMetadata, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";
import { faqs, site } from "@/lib/site";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Contact | Book an AI Automation Strategy Call",
    description:
      "Tell Rockxflow what is slowing your business down. Email, WhatsApp or send the enquiry form and we will identify where AI and automation can create the biggest impact.",
    path: "/contact",
    keywords: ["contact AI automation agency", "book AI automation strategy call", "AI automation consultation"],
  }),
  alternates: { canonical: "/contact" },
};

const trail = [{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }];

export default function ContactPage() {

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Let’s Build Your Automation."
        support="Tell us what is slowing your business down. We’ll help identify where AI and automation can create the biggest impact — and where they would add nothing."
        trail={trail}
        accentWords={["automation."]}
        meta={[
          { label: "Reply", value: "By email or WhatsApp" },
          { label: "Fastest", value: "WhatsApp" },
          { label: "First call", value: "30 minutes, no obligation" },
        ]}
      />

      <section className="rx-section bg-[color:var(--color-canvas)]">
        <div className="rx-shell">
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)] lg:gap-8">
            <Reveal y={20}>
              <ContactForm />
            </Reveal>

            <div className="space-y-4">
              <Reveal delay={0.06}>
                <div className="rounded-2xl border border-[#e4eaf1] bg-white p-5">
                  <p className="t-eyebrow">Direct channels</p>
                  <ul className="mt-4 space-y-2.5">
                    {[
                      {
                        href: site.whatsapp,
                        icon: "whatsapp" as const,
                        t: `WhatsApp ${site.phoneDisplay}`,
                        d: "Open a chat with your enquiry pre-written",
                        track: "cta_whatsapp",
                        ext: true,
                      },
                      {
                        href: `mailto:${site.email}?subject=${encodeURIComponent("Website enquiry — AI automation")}`,
                        icon: "mail" as const,
                        t: site.email,
                        d: "For longer briefs, documents or procurement",
                        track: "cta_email",
                        ext: false,
                      },
                      {
                        href: `tel:${site.phoneRaw}`,
                        icon: "phone" as const,
                        t: "Call the studio line",
                        d: "Direct line to the studio",
                        track: "cta_call",
                        ext: false,
                      },
                      {
                        href: site.instagram,
                        icon: "instagram" as const,
                        t: "Instagram",
                        d: "Builds, before/after clips and short explainers.",
                        track: "cta_instagram",
                        ext: true,
                      },
                    ].map((c) => (
                      <li key={c.t}>
                        <a
                          href={c.href}
                          data-track={c.track}
                          data-placement="contact_sidebar"
                          {...(c.ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                          className="group flex items-start gap-3 rounded-xl border border-[#e4eaf1] p-3 transition-all duration-300 hover:border-[#8fd7ff] hover:bg-[#f4f9ff]"
                        >
                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-[#e4eaf1] bg-white text-[#0757a8] transition-transform duration-300 group-hover:-translate-y-0.5">
                            <Icon name={c.icon} className="h-4 w-4" accent={false} strokeWidth={1.7} />
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate font-display text-[0.9375rem] font-bold text-[#0a0f14]">{c.t}</span>
                            <span className="t-small block">{c.d}</span>
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                  <p className="t-small mt-4 flex items-center gap-2 border-t border-[#eef2f6] pt-3.5">
                    <Icon name="shield" className="h-3.5 w-3.5 text-[#0757a8]" accent={false} strokeWidth={1.8} />
                    Email, WhatsApp or the form — a person reads all three.
                  </p>
                </div>
              </Reveal>

              <ParamNotes />
            </div>
          </div>
        </div>
      </section>

      <section className="rx-section bg-white">
        <div className="rx-shell">
          <SectionRule label="Before you write" />
          <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:gap-14">
            <div>
              <h2 className="t-h2">How we handle what you send</h2>
              <p className="t-body mt-4">
                Enquiries are read by a person, not a queue. We use the details you provide only to answer you, and we
                do not add you to a list you never asked for.
              </p>
              <div className="mt-6 flex flex-wrap gap-2.5">
                <Cta href="/contact?type=strategy-call" variant="ghost" size="sm">
                  Flag it as a strategy call
                </Cta>
                <Cta href="/privacy-policy" variant="ghost" size="sm" icon={null}>
                  Read the privacy policy
                </Cta>
              </div>
            </div>
            <FaqBlock items={faqs.slice(2, 6)} idBase="contact-faq" showAside={false} />
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbJsonLd(trail), faqJsonLd(faqs.slice(2, 6))]) }}
      />
    </>
  );
}
