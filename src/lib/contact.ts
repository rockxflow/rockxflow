import { services } from "@/lib/site";

/**
 * Copy for each enquiry kind. Kept outside the page component so the same map can
 * be used from the server (prerendered default) and from the client (when the page
 * is a static export and query params can only be read in the browser).
 */
export const kindCopy: Record<string, { title: string; bullets: string[] }> = {
  "strategy-call": {
    title: "Strategy call requested — 30 minutes, no slides, no obligation.",
    bullets: [
      "The process you want to fix, in your words",
      "The tools it currently touches (CRM, sheets, mailbox, WhatsApp…)",
      "Rough volume: how many times per day or week",
    ],
  },
  discovery: {
    title: "Scoping enquiry — we will tell you honestly if automation is the right answer.",
    bullets: ["Where the time goes today", "Who owns the process", "What a good outcome looks like in 60 days"],
  },
  support: {
    title: "Ongoing optimisation — for systems that are already live.",
    bullets: ["Which workflow, running since when", "What has changed in the business", "Where humans override most"],
  },
  service: {
    title: "Service-specific enquiry.",
    bullets: ["What you want the system to do", "Which tools it must connect to", "Any constraints we should know about"],
  },
};

export const generalCopy = {
  title: "General enquiry.",
  bullets: ["What you want to automate", "Which tools are involved", "How often it happens today"],
};

export type ContactContext = {
  kind: string;
  /** Pre-selected value for the "what do you want to automate" field. */
  topic: string;
  contextTitle: string;
  copy: { title: string; bullets: string[] };
  serviceSlug: string;
};

/** Pure so both the server render and the client param reader stay in sync. */
export function contactContext(params: { type?: string | null; service?: string | null }): ContactContext {
  const kind = params.type && kindCopy[params.type] ? params.type : "general";
  const service = services.find((s) => s.slug === params.service);
  const copy = kindCopy[kind] ?? generalCopy;
  return {
    kind,
    topic: service ? service.title : "",
    contextTitle: service ? `You are asking about ${service.title}. ${service.summary}` : copy.title,
    copy,
    serviceSlug: service?.slug ?? "",
  };
}
