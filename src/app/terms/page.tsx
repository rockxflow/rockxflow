import type { Metadata } from "next";
import { LegalPage } from "@/components/ui/LegalPage";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Terms of Service",
    description:
      "The terms that apply to enquiries, scoping and AI automation engagements with Rockxflow — scope, access, ownership, limitations and how disputes are handled.",
    path: "/terms",
  }),
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms of Service"
      intro="These terms cover enquiries made through this website and engagements agreed with Rockxflow. They are written to be understandable; where a proposal and these terms differ, the signed proposal wins."
      updated="10 September 2026"
      trail={[
        { name: "Home", path: "/" },
        { name: "Terms", path: "/terms" },
      ]}
      sections={[
        {
          id: "agreement",
          h: "Agreement",
          p: [
            "By using this website or engaging our services you accept these terms. If you are accepting on behalf of a company, you confirm you may bind that company.",
          ],
        },
        {
          id: "enquiries",
          h: "Enquiries and no obligation",
          p: [
            "Sending an enquiry creates no commitment for either side. A strategy call is a conversation, not a purchase. Work begins only when a written proposal or statement of work is accepted.",
            "Please send accurate information and only material you have the right to share.",
          ],
        },
        {
          id: "scope",
          h: "Services and scope",
          p: [
            "We design, build, integrate, test, launch and maintain AI automation systems: workflows, agents, assistants, messaging and document automation, dashboards and integrations.",
            "Every engagement is defined by a written scope listing the processes to automate, the systems to connect, the deliverables, the timeline and the fees. Anything outside it is a change request, quoted separately.",
          ],
          list: [
            "We are not a reseller of the platforms we connect to and receive no commission for recommending a specific tool unless disclosed in writing.",
            "Where we advise that a process should not be automated, that advice is part of the service.",
          ],
        },
        {
          id: "responsibilities",
          h: "What we each need to provide",
          p: ["Delivery depends on both sides holding up their half:"],
          list: [
            "You: timely access to the systems in scope, a named decision-maker, approval of workflow rules, and lawful rights to the data and content you supply.",
            "You: confirmation that automations touching customers comply with the rules of the channels used (for example messaging-platform policies) and applicable law.",
            "Us: the agreed build, documented architecture and naming, testing against real cases, a walkthrough for your team, and reasonable responsiveness during the engagement.",
          ],
        },
        {
          id: "ai",
          h: "How AI behaves — and what we do not promise",
          p: [
            "Generative systems are probabilistic. Even with careful instruction design, validation and human gates, an occasional output may be wrong, incomplete or phrased oddly.",
            "We therefore do not guarantee that an AI output will always be correct. What we commit to is engineering around that fact: guardrails, validation, exception queues, logs, alerts, and approval steps wherever judgement, money or commitments are involved.",
            "You remain responsible for final review of anything sent to customers, filed publicly or used for regulated decisions.",
          ],
        },
        {
          id: "fees",
          h: "Fees, taxes and timing",
          p: [
            "Fees, milestones and payment terms are set in the proposal. Unless stated otherwise, invoices are payable within 14 days of issue, and work may pause if an approved milestone becomes overdue.",
            "Fees exclude government taxes, which are charged where applicable. Third-party subscription, usage or licence costs (models, messaging providers, hosting, automation platforms) are billed to or paid directly by you, and are quoted separately because they depend on your volumes.",
          ],
        },
        {
          id: "ip",
          h: "Ownership",
          p: [
            "On payment for the relevant milestone, you own the deliverables created for you: workflows, prompts and instruction sets, integration code, dashboards and documentation. Your data, content and trademarks stay yours throughout.",
            "We may reuse generic, non-confidential techniques, patterns and tooling developed along the way — the same way any engineering practice reuses knowledge. Nothing unique to your business is republished or resold.",
            "Third-party components remain governed by their own licences.",
          ],
        },
        {
          id: "confidentiality",
          h: "Confidentiality",
          p: [
            "Each side keeps the other's confidential information private, uses it only for the engagement, and limits access to the people who need it. This obligation continues for two years after the engagement, and indefinitely for personal data and trade secrets.",
            "We do not publish your name, logo, metrics or screenshots as portfolio material without written permission.",
          ],
        },
        {
          id: "support",
          h: "Warranty, support and maintenance",
          p: [
            "Delivered work conforms to the agreed scope for 30 days after handover; during that window we fix defects at no charge. This covers behaviour of our build, not outages of third-party platforms, API changes on someone else's side, or edits made by your team.",
            "Monitoring, optimisation and new workflows after that period fall under a support agreement or a fresh scope.",
          ],
        },
        {
          id: "termination",
          h: "Ending an engagement",
          p: [
            "Either side may end an engagement with 14 days' written notice. We invoice for work completed up to that date, hand over what is finished in a usable state, and assist with a reasonable transition of accounts and documentation.",
          ],
        },
        {
          id: "liability",
          h: "Liability",
          p: [
            "To the maximum extent permitted by law, our aggregate liability for an engagement is limited to the fees you paid for the part of the work that caused the loss, and we are not liable for lost profits, lost revenue, lost data held on platforms we do not control, or indirect and consequential losses.",
            "Nothing here limits liability that cannot lawfully be limited, including for fraud or wilful misconduct.",
          ],
        },
        {
          id: "acceptable",
          h: "Acceptable use",
          p: ["You agree not to use anything we build to:"],
          list: [
            "break any law, platform rule or contractual obligation;",
            "send unsolicited bulk messaging, or evade opt-outs and consent requirements;",
            "deceive people into believing they are talking to a human where a platform or law requires disclosure;",
            "make decisions about individuals that are unlawful, discriminatory or prohibited by your sector's rules.",
          ],
        },
        {
          id: "thissite",
          h: "This website",
          p: [
            "We keep the site available as reasonably practicable, without a formal uptime commitment. Content is provided for general information: service descriptions explain our capabilities and are not contractual promises about a specific outcome, timeline or saving.",
            "Third-party links are for convenience; we do not control them and are not responsible for their content.",
          ],
        },
        {
          id: "law",
          h: "Governing law and disputes",
          p: [
            `These terms are governed by the laws of India. The parties will first try to resolve a dispute in good faith through discussion between their nominated representatives; unresolved disputes are subject to the exclusive jurisdiction of the competent courts of ${site.location}.`,
          ],
        },
        {
          id: "contact-legal",
          h: "Contact",
          p: [
            `Questions about these terms, or a request under the privacy policy, can be sent to ${site.email}. Written notices for an engagement go to the address named in the agreement.`,
          ],
        },
      ]}
    />
  );
}
