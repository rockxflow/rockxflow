import type { Metadata } from "next";
import { LegalPage } from "@/components/ui/LegalPage";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Privacy Policy",
    description:
      "How Rockxflow collects, uses and protects the information you send through this website — explained plainly, with no unnecessary data collection.",
    path: "/privacy-policy",
  }),
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      intro="This page explains what information this website collects, why it is collected, and what you can ask us to do with it. It is written to be read, not skimmed past."
      updated="10 September 2026"
      trail={[
        { name: "Home", path: "/" },
        { name: "Privacy Policy", path: "/privacy-policy" },
      ]}
      sections={[
        {
          id: "summary",
          h: "The short version",
          p: [
            "When you contact us we receive exactly what you chose to type into the enquiry form: your name, business name, email, phone, the automation you are interested in, an optional budget band and your message.",
            <>
              We use it for one purpose — to reply to you and, if we proceed, to scope and deliver the work. We do not sell it, we do not add you to marketing lists, and we do not send newsletters you did not request.
            </>,
          ],
          list: [
            `Enquiries: ${site.email} · WhatsApp ${site.phoneDisplay}`,
            "This website does not set advertising or cross-site tracking cookies.",
            "No payment card data is ever collected on this site.",
          ],
        },
        {
          id: "collected",
          h: "Information we collect",
          p: ["There are three categories, and nothing beyond them is intentional."],
          list: [
            "You send us: enquiry form fields, email content, WhatsApp messages and call notes.",
            "Generated automatically: basic server logs (request metadata such as timestamp and requested path) used to keep the site and its form endpoint working and safe.",
            "In your browser: a single session flag so the opening animation does not repeat while you browse. Clearing site data removes it.",
          ],
        },
        {
          id: "why",
          h: "Why we process it",
          p: [
            "To answer your enquiry, prepare for a call, produce a proposal or scope document, deliver an agreed engagement, meet legal and accounting obligations, and protect the website from abuse (for example rate limits and a hidden honeypot field on the form).",
          ],
        },
        {
          id: "form",
          h: "How the contact form works",
          p: [
            "The form posts to our own endpoint on this domain, which validates the content and forwards it to the mailbox or workflow system we operate for enquiries. Nothing is written to a database by the website itself.",
            "If delivery cannot be completed, the site tells you honestly and shows the direct channels instead of pretending the message was received.",
          ],
        },
        {
          id: "ai",
          h: "AI tools and your information",
          p: [
            "Where an engagement involves third-party AI services, we use the accounts and regions agreed with you, share only the minimum data a step requires, and follow the retention settings configured for that service. We do not use client data to train public models.",
            "During a build, sample data is used wherever a real record is not needed. If real records are necessary, they stay inside the systems you own.",
          ],
        },
        {
          id: "sharing",
          h: "Who else may see it",
          p: ["Only the limited parties needed to operate, and never for their own marketing:"],
          list: [
            "Our hosting and email providers, to serve this website and deliver enquiries.",
            "Automation or CRM platforms you already use, when you ask us to build inside them.",
            "Professional advisers (accountants, legal counsel) where legally required.",
          ],
        },
        {
          id: "analytics",
          h: "Measurement",
          p: [
            "This site is built so that a privacy-respecting analytics tool can be enabled without changing any page, and no analytics identifier is configured by default. If measurement is switched on later, it will be recorded on this page, and it will not include cross-site advertising trackers unless you explicitly approve that in writing.",
          ],
        },
        {
          id: "retention",
          h: "How long we keep it",
          p: [
            "Enquiries that do not become engagements: we keep the thread only as long as needed to reply and follow up, then delete on request. Engagements: correspondence and technical documentation are kept for the term of the agreement and for the period required for accounting and legal purposes.",
          ],
        },
        {
          id: "security",
          h: "How we protect it",
          p: [
            "The site is served over HTTPS, form submissions are validated and rate-limited, secrets live only on the server and never in browser code, and access to enquiry inboxes is restricted to the people who need it.",
            "No method of transmission is 100% secure. Where a breach of personal data is likely to affect you materially, we will notify you and follow the reporting duties that apply.",
          ],
        },
        {
          id: "rights",
          h: "Your choices",
          p: ["Write to us from the address you used (or another verifiable route) and we will:"],
          list: [
            "confirm what we hold about you;",
            "correct anything inaccurate;",
            "delete it, subject to records we must lawfully retain;",
            "stop contacting you, permanently, on request.",
          ],
        },
        {
          id: "children",
          h: "Children",
          p: ["This website is a business service and is not directed at children. We do not knowingly collect information from anyone under 18; if you believe we have, tell us and we will remove it."],
        },
        {
          id: "transfer",
          h: "Locations",
          p: [
            `Rockxflow is based in ${site.location}, India. Enquiry data may be processed by providers whose servers sit outside India, which is why we limit what we collect and rely on their standard contractual and security terms.`,
          ],
        },
        {
          id: "changes",
          h: "Changes to this policy",
          p: [
            "If this policy changes materially, the “last updated” date at the top changes with it. Continuing to use the site after an update means the revised policy applies to new enquiries.",
          ],
        },
      ]}
    />
  );
}
