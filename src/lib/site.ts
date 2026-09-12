/**
 * Single source of truth for every content string on the site.
 * Written to be honest: no invented clients, metrics, awards or partnerships.
 */

export const site = {
  name: "Rockxflow",
  legalName: "Rockxflow",
  category: "AI Automation Agency",
  tagline: "Automate • Innovate • Elevate",
  claim: "Turn Repetitive Work Into Intelligent Systems.",
  intro:
    "Rockxflow helps businesses automate workflows, sales, customer support, and operations with AI agents and intelligent integrations.",
  supporting: "Automate smarter. Respond faster. Scale with systems.",
  email: "official.rockxflow@gmail.com",
  phoneDisplay: "+91 92116 68580",
  phoneRaw: "+919211668580",
  whatsapp:
    "https://wa.me/919211668580?text=Hi%20Rockxflow%2C%20I'd%20like%20to%20discuss%20AI%20automation%20for%20my%20business.",
  facebook: "https://www.facebook.com/people/Rockxflow/61593965152034/",
  location: "Faridabad, Haryana, India",
  hoursNote: "Mon–Sat, 10:00–19:00 IST",
} as const;

export const strategyCallHref = "/contact?type=strategy-call";

export const nav = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Solutions", href: "/solutions" },
  { label: "Process", href: "/process" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export type Service = {
  slug: string;
  index: string;
  title: string;
  kicker: string;
  summary: string;
  problem: string;
  exampleTitle: string;
  steps: string[];
  benefit: string;
  deliverables: string[];
  visual: "pipeline" | "agent" | "chat" | "voice" | "whatsapp" | "crm" | "documents" | "dashboard" | "integrations";
};

export const services: Service[] = [
  {
    slug: "ai-workflow-automation",
    index: "01",
    title: "AI Workflow Automation",
    kicker: "Core discipline",
    summary:
      "End-to-end business workflows where AI reads, decides and acts — so work moves without being pushed.",
    problem:
      "Submissions arrive by email, get copied into a sheet, then re-entered into a CRM. Every hand-off is where lead speed dies.",
    exampleTitle: "Inbound lead workflow",
    steps: [
      "Website form submission",
      "AI reads the enquiry",
      "Intent and fit analysis",
      "Qualification decision",
      "CRM record created",
      "Sales team notified",
      "WhatsApp / email follow-up",
      "Meeting booked & reporting updated",
    ],
    benefit: "Less manual handling, faster first response, consistent follow-up and organised lead management.",
    deliverables: [
      "Documented workflow map",
      "Automation build with error handling",
      "AI classification & extraction prompts",
      "Handover notes + monitoring",
    ],
    visual: "pipeline",
  },
  {
    slug: "ai-agents",
    index: "02",
    title: "AI Agents",
    kicker: "Assistants with instructions",
    summary:
      "Purpose-built agents that follow your written rules, use your tools and hand back to a human when judgement is needed.",
    problem:
      "Your team spends the morning reading, sorting and copying — the actual decisions take minutes, the admin takes hours.",
    exampleTitle: "Operations triage agent",
    steps: [
      "Inbox / queue receives item",
      "Agent classifies and extracts fields",
      "Rules checked against policy",
      "Standard case executed automatically",
      "Complex case drafted for review",
      "Human approves or edits",
      "Outcome logged",
    ],
    benefit: "Repetitive decisions get made consistently, at 2am, without inventing policy on their own.",
    deliverables: [
      "Instruction & policy document",
      "Tool access definitions",
      "Guardrails with human-approval gates",
      "Activity log and audit trail",
    ],
    visual: "agent",
  },
  {
    slug: "ai-chatbots",
    index: "03",
    title: "AI Chatbots",
    kicker: "Front door, always open",
    summary:
      "Website and messaging assistants that answer real questions, capture lead details and route conversations to your team.",
    problem:
      "Visitors ask the same five questions, and the ones who don't get an answer usually leave rather than wait.",
    exampleTitle: "Qualification conversation",
    steps: [
      "Visitor asks about a service",
      "AI answers from your approved content",
      "Asks qualifying questions",
      "Captures contact details",
      "Offers a booking slot",
      "Escalates to a human when needed",
    ],
    benefit: "Fewer unanswered questions, better-qualified conversations, and a clean handover with context attached.",
    deliverables: [
      "Approved knowledge set",
      "Conversation design & tone",
      "Lead capture + booking flow",
      "Human handover rules",
    ],
    visual: "chat",
  },
  {
    slug: "voice-ai",
    index: "04",
    title: "Voice AI",
    kicker: "Calls that get handled",
    summary:
      "Inbound voice agents that answer, understand intent, take action, and pass a written summary to your team.",
    problem:
      "Missed calls are missed revenue — and returning voicemails is the part of the day everyone postpones.",
    exampleTitle: "Inbound call handling",
    steps: [
      "Call arrives",
      "AI answers and understands the request",
      "Qualifies or books directly",
      "Checks availability in your calendar",
      "Sends SMS / WhatsApp confirmation",
      "Writes summary + transcript to CRM",
      "Escalates to a human when required",
    ],
    benefit: "Every call gets a response, a record and a next step — including the ones that used to hit voicemail.",
    deliverables: [
      "Call flow & script design",
      "Number routing + failover",
      "Calendar / CRM integration",
      "Transcripts and summaries",
    ],
    visual: "voice",
  },
  {
    slug: "whatsapp-automation",
    index: "05",
    title: "WhatsApp Automation",
    kicker: "Where customers already are",
    summary:
      "WhatsApp conversations that respond instantly, collect details, send reminders and hand over to your team cleanly.",
    problem:
      "Most enquiries start on WhatsApp, sit unread for hours, then get replied to from a phone with nothing recorded.",
    exampleTitle: "Enquiry to follow-up",
    steps: [
      "Customer messages on WhatsApp",
      "AI understands the message",
      "Instant acknowledgement / answer",
      "Lead details captured",
      "CRM updated",
      "Automated follow-up scheduled",
      "Human handover when needed",
    ],
    benefit: "First reply in seconds, every conversation stored against a record, follow-ups that actually happen.",
    deliverables: [
      "Message templates & flows",
      "Inbox routing + assignment",
      "CRM sync",
      "Broadcast and reminder automation",
    ],
    visual: "whatsapp",
  },
  {
    slug: "crm-sales-automation",
    index: "06",
    title: "CRM & Sales Automation",
    kicker: "Pipeline hygiene, by default",
    summary:
      "Leads routed, scored, followed up and updated automatically, so your pipeline reflects reality without admin time.",
    problem:
      "Deals go quiet because nobody remembered the follow-up, and reporting is wrong because the CRM is only updated on Fridays.",
    exampleTitle: "Lead lifecycle",
    steps: [
      "Lead created from any source",
      "Owner assigned by rules",
      "Enrichment + qualification notes",
      "Sequence started",
      "Tasks created for the team",
      "Stage updated on reply / booking",
      "Stale deals escalated",
    ],
    benefit: "Nothing is unassigned, nothing goes stale, and forecasting stops being guesswork.",
    deliverables: [
      "Pipeline and stage definitions",
      "Routing + assignment rules",
      "Follow-up sequences",
      "Slack / email notifications",
    ],
    visual: "crm",
  },
  {
    slug: "document-ai",
    index: "07",
    title: "Document AI",
    kicker: "Paperwork, parsed",
    summary:
      "Extract, classify and structure information from PDFs, forms, invoices and reports — with verification built in.",
    problem:
      "The same fields get read from attachments all day and retyped into systems that were built for structured data.",
    exampleTitle: "Document intake",
    steps: [
      "File arrives by email or upload",
      "Document type detected",
      "Fields extracted",
      "Checks run against rules",
      "Exception flagged for review",
      "Structured record stored",
      "Sheet / CRM / ERP updated",
    ],
    benefit: "Faster intake, fewer transcription errors, and a searchable record of everything you received.",
    deliverables: [
      "Field + schema definition",
      "Extraction and validation logic",
      "Classification with confidence flags",
      "Organised storage + audit trail",
    ],
    visual: "documents",
  },
  {
    slug: "custom-ai-integrations",
    index: "08",
    title: "Custom AI Integrations",
    kicker: "The connective tissue",
    summary:
      "We wire the tools you already pay for into one system: APIs, webhooks, messaging, calendars, storage and dashboards.",
    problem:
      "Every platform holds part of the truth, so staff keep acting as the human middleware between them.",
    exampleTitle: "Integration map",
    steps: [
      "Source event (form, email, message, call)",
      "Normalised payload",
      "AI step: understand, classify, draft",
      "Written to system of record",
      "Notification to the right person",
      "Metrics pushed to reporting",
    ],
    benefit: "Systems that talk to each other, one place to trust, and no more copy-paste bridges.",
    deliverables: [
      "Integration architecture diagram",
      "Authenticated connectors",
      "Retry, dedupe and error alerts",
      "Documentation for your team",
    ],
    visual: "integrations",
  },
  {
    slug: "ai-dashboards-reporting",
    index: "09",
    title: "AI Dashboards & Reporting",
    kicker: "See the whole operation",
    summary:
      "Automated reporting that pulls scattered business data into one live view, with plain-language summaries.",
    problem:
      "Answering “how did last week go?” means exporting three tools and rebuilding a spreadsheet from scratch.",
    exampleTitle: "Reporting cycle",
    steps: [
      "Data collected from all connected tools",
      "Cleaned and reconciled",
      "KPIs calculated on a schedule",
      "Dashboard refreshed",
      "AI writes the weekly summary",
      "Report delivered to stakeholders",
    ],
    benefit: "One version of the numbers, delivered before the meeting instead of after it.",
    deliverables: [
      "KPI definitions with your team",
      "Automated data pipeline",
      "Dashboard build",
      "Scheduled email / Slack reports",
    ],
    visual: "dashboard",
  },
];

export const serviceShortlist = [
  "AI Workflow Automation",
  "AI Agents",
  "AI Chatbots",
  "Voice AI",
  "WhatsApp Automation",
  "CRM & Sales Automation",
  "Document AI",
  "AI Dashboards & Reporting",
  "Custom AI Integrations",
];

export const pillars = [
  {
    key: "automate",
    title: "Automate",
    line: "Remove repetitive work.",
    body:
      "The steps that repeat the same way every time are the ones that should never need a human: intake, sorting, copying, chasing, logging.",
  },
  {
    key: "connect",
    title: "Connect",
    line: "Bring business tools together.",
    body:
      "Forms, mailboxes, CRMs, sheets, chat and calendars stop being islands. One event moves through the whole chain.",
  },
  {
    key: "accelerate",
    title: "Accelerate",
    line: "Respond and act faster.",
    body:
      "Speed is a sales feature. Replies, routing and follow-ups happen in seconds, at any hour, on every enquiry.",
  },
  {
    key: "scale",
    title: "Scale",
    line: "Build systems that grow with you.",
    body:
      "Volume should not require headcount. Documented, monitored workflows absorb more work with the same team.",
  },
] as const;

export const systemSources = [
  { label: "Website", note: "enquiry / click" },
  { label: "Forms", note: "lead capture" },
  { label: "Email", note: "inbox triage" },
  { label: "WhatsApp", note: "chat message" },
  { label: "CRM", note: "pipeline event" },
  { label: "Google Sheets", note: "data rows" },
  { label: "Slack", note: "team alerts" },
  { label: "Notion", note: "documents" },
];

export const systemOutputs = [
  "Structured records",
  "Ownership assigned",
  "Follow-ups scheduled",
  "Reporting updated",
];

export type Solution = {
  slug: string;
  title: string;
  blurb: string;
  problem: string;
  automation: string;
  result: string;
  services: string[];
};

export const solutions: Solution[] = [
  {
    slug: "get-more-leads",
    title: "Get More Leads",
    blurb: "Automate lead capture and qualification.",
    problem: "Enquiries arrive in five places, none of them triaged, and replies take hours.",
    automation:
      "Every source feeds one intake flow. AI reads each enquiry, scores fit, and creates a clean CRM record with next steps attached.",
    result: "More of your real demand is captured, answered and remembered.",
    services: ["AI Workflow Automation", "CRM & Sales Automation", "AI Chatbots"],
  },
  {
    slug: "follow-up-automatically",
    title: "Follow Up Automatically",
    blurb: "Reduce missed opportunities.",
    problem: "Follow-ups depend on someone remembering, and busy weeks are where deals quietly die.",
    automation:
      "Sequenced reminders start the moment a lead is created, pause on reply, escalate when stale, and stop on close.",
    result: "Consistent contact without a spreadsheet of names to chase.",
    services: ["CRM & Sales Automation", "WhatsApp Automation", "Custom AI Integrations"],
  },
  {
    slug: "respond-faster",
    title: "Respond Faster",
    blurb: "Automate repetitive customer interactions.",
    problem: "Most questions are the same ten questions, and answering them consumes the front office.",
    automation:
      "An assistant answers from your approved content, resolves the routine ones, and hands the rest over with context.",
    result: "Nearly instant first replies and a team focused on exceptions.",
    services: ["AI Chatbots", "Voice AI", "WhatsApp Automation"],
  },
  {
    slug: "reduce-admin-work",
    title: "Reduce Admin Work",
    blurb: "Remove repetitive operational tasks.",
    problem: "Copying from PDFs to sheets to systems is billable hours spent as human middleware.",
    automation:
      "Documents are read, fields extracted, checks applied and records written — with exceptions flagged for review.",
    result: "Days of retyping returned to real work, with fewer errors.",
    services: ["Document AI", "AI Agents", "AI Workflow Automation"],
  },
  {
    slug: "connect-your-tools",
    title: "Connect Your Tools",
    blurb: "Make the systems you own communicate.",
    problem: "Each platform holds part of the truth, so nobody trusts any single one of them.",
    automation:
      "Event-driven connectors keep records in sync, with retries, dedupe and alerts when something breaks.",
    result: "One flow of data your team can rely on, without replacing your stack.",
    services: ["Custom AI Integrations", "AI Workflow Automation"],
  },
  {
    slug: "automate-reporting",
    title: "Automate Reporting",
    blurb: "Turn scattered information into usable reporting.",
    problem: "Reporting is rebuilt by hand each week from exports that are already out of date.",
    automation:
      "KPIs are computed on a schedule from live systems, then published to a dashboard and delivered with a written summary.",
    result: "Decisions made on current numbers instead of last Friday's spreadsheet.",
    services: ["AI Dashboards & Reporting", "Custom AI Integrations"],
  },
  {
    slug: "streamline-operations",
    title: "Streamline Operations",
    blurb: "Create repeatable workflows.",
    problem: "Process lives in people's heads, so quality depends on who is working that week.",
    automation:
      "Each process is mapped, then built as a documented workflow with owners, checkpoints and handover points.",
    result: "Work that is consistent, trainable and measurable from day one.",
    services: ["AI Workflow Automation", "AI Agents"],
  },
  {
    slug: "improve-customer-experience",
    title: "Improve Customer Experience",
    blurb: "Combine AI with human support.",
    problem: "Customers wait for answers that a machine already knows, and wait for people for the ones it does not.",
    automation:
      "Instant AI responses for routine needs, warm handover with full context for everything else, follow-ups guaranteed.",
    result: "Shorter waits, fewer dropped threads, and people used where they matter.",
    services: ["AI Chatbots", "WhatsApp Automation", "Voice AI", "CRM & Sales Automation"],
  },
];

export const industries = [
  {
    name: "Real Estate",
    note: "Example automation opportunities",
    items: ["Site-visit enquiries routed to the right agent", "Brochure + eligibility capture on WhatsApp", "Follow-up sequences for cold listings"],
  },
  {
    name: "E-commerce",
    note: "Example automation opportunities",
    items: ["Order and returns status answers", "Review and support message triage", "Inventory alerts to the team channel"],
  },
  {
    name: "Agencies & Studios",
    note: "Example automation opportunities",
    items: ["Brief intake to project board", "Proposal and status updates", "Monthly reporting assembled automatically"],
  },
  {
    name: "Education",
    note: "Example automation opportunities",
    items: ["Admissions enquiry qualification", "Document verification queues", "Fee and attendance reminders"],
  },
  {
    name: "Professional Services",
    note: "Example automation opportunities",
    items: ["Lead qualification before the first call", "Client onboarding checklists", "Engagement letter and data intake"],
  },
  {
    name: "Local Businesses",
    note: "Example automation opportunities",
    items: ["Missed calls answered and booked", "Booking confirmations by WhatsApp", "Recurring service reminders"],
  },
  {
    name: "Healthcare Administration",
    note: "Where these systems can be applied",
    items: ["Appointment requests and reminders", "Form and record digitisation", "Front-desk question handling"],
  },
] as const;

export const processSteps = [
  {
    n: "01",
    title: "Discover",
    subtitle: "Understand the business",
    body:
      "We start with your operations, not with technology. Who does what, how often, what triggers it, and what breaks when someone is on leave.",
    outputs: ["Stakeholder conversations", "Volume and time observations", "Constraint list"],
    duration: "Week 1",
  },
  {
    n: "02",
    title: "Map",
    subtitle: "Identify repetitive processes",
    body:
      "Every candidate process is drawn as it is actually performed today, then scored on frequency, duration, error cost and how rule-based it is.",
    outputs: ["As-is process maps", "Automation opportunity ranking", "Data and access inventory"],
    duration: "Week 1–2",
  },
  {
    n: "03",
    title: "Design",
    subtitle: "Create the automation architecture",
    body:
      "We decide what the system does, what it must never do, where a human reviews, and how each tool is connected. The plan is agreed before we build.",
    outputs: ["To-be workflow diagrams", "Integration architecture", "Edge-case and failure plan"],
    duration: "Week 2",
  },
  {
    n: "04",
    title: "Build",
    subtitle: "Develop workflows and AI systems",
    body:
      "Prompts, agents, automations, integrations and dashboards are built in a staging environment against your real data shapes — not a demo account.",
    outputs: ["Working automation build", "AI instruction sets", "Logging and error handling"],
    duration: "Week 3–5",
  },
  {
    n: "05",
    title: "Integrate",
    subtitle: "Connect business tools",
    body:
      "CRM, inboxes, WhatsApp, sheets, calendars and storage are connected with authenticated, retry-safe connectors and clear data ownership.",
    outputs: ["Live connectors", "Field mapping", "Access controls"],
    duration: "Week 4–6",
  },
  {
    n: "06",
    title: "Test",
    subtitle: "Check reliability and edge cases",
    body:
      "We run real historical cases through the system: missing fields, odd formats, duplicates, angry replies, offline tools. Anything unclear becomes a rule.",
    outputs: ["Test matrix and results", "Exception handling verified", "Rollback plan"],
    duration: "Week 6",
  },
  {
    n: "07",
    title: "Launch",
    subtitle: "Deploy the system",
    body:
      "Go-live is phased: highest-volume workflow first, team trained, monitoring on. We stay close for the first full cycle of real work.",
    outputs: ["Phased rollout", "Team walkthrough + notes", "Alerting and dashboards live"],
    duration: "Week 7",
  },
  {
    n: "08",
    title: "Optimize",
    subtitle: "Improve based on real usage",
    body:
      "After usage data exists, we review failure logs, override rates and handover patterns, then tighten the system quarter by quarter.",
    outputs: ["Monthly performance review", "Prompt and rule refinements", "Next workflow in the queue"],
    duration: "Ongoing",
  },
] as const;

export const principles = [
  {
    title: "Business-first automation",
    body: "We build because a specific process is costing time or money. If a workflow does not justify automation, we say so.",
  },
  {
    title: "Practical AI",
    body: "Useful systems, not AI for hype. Language models do the understanding; deterministic rules do the things that must not drift.",
  },
  {
    title: "Connected systems",
    body: "Automation is only as good as its integrations. We work inside the tools you already run rather than selling you a new one.",
  },
  {
    title: "Human oversight",
    body: "Where judgement, money or trust is involved, a person stays in the loop. The system prepares work; it does not secretly approve it.",
  },
  {
    title: "Scalable architecture",
    body: "Designed so ten times the volume means more throughput, not more breakage, and so the next workflow is easier than the first.",
  },
  {
    title: "Continuous improvement",
    body: "Systems drift as businesses change. We review logs and override patterns, then tighten the design over time.",
  },
] as const;

export const automationCategories = [
  {
    key: "sales",
    label: "Sales",
    headline: "Nothing waits for a human to notice.",
    intro: "Capture every enquiry, judge it, assign it and follow up — before your competitor replies.",
    workflows: [
      {
        name: "Inbound lead qualification",
        steps: ["Lead capture", "AI qualification", "CRM record", "Follow-up sequence", "Sales notification"],
        detail:
          "Website forms, WhatsApp messages and emails land in one queue. Each enquiry is read, scored against your criteria, and pushed to the right owner with a summary.",
      },
      {
        name: "Proposal to close",
        steps: ["Brief received", "Draft proposal assembled", "Sent for approval", "Reminder if unanswered", "Stage updated"],
        detail:
          "Recurring documents are built from your templates, routed for sign-off, and chased automatically when they go quiet.",
      },
    ],
  },
  {
    key: "support",
    label: "Customer Support",
    headline: "First answer in seconds, always with a way to a human.",
    intro: "Routine questions resolved instantly; everything else escalated with context instead of a transcript restart.",
    workflows: [
      {
        name: "Message triage and answer",
        steps: ["Customer message", "AI understanding", "Answer drafted", "Escalation if unsure", "Human handover"],
        detail:
          "The assistant answers only from approved content and hands over the moment confidence drops — with the customer's history attached.",
      },
      {
        name: "Ticket lifecycle",
        steps: ["Ticket created", "Category + priority set", "Owner assigned", "Status updates customer", "Resolution logged"],
        detail:
          "Categories, owners and customer updates stay in sync without someone copying between systems.",
      },
    ],
  },
  {
    key: "operations",
    label: "Operations",
    headline: "Processes that run the same way every time.",
    intro: "The repetitive middle of your business becomes a documented, monitored workflow.",
    workflows: [
      {
        name: "Order or job fulfilment",
        steps: ["Trigger", "Data processing", "Task automation", "Team notification", "Reporting updated"],
        detail:
          "Each new job creates its checklist, assigns owners, and posts progress where the team already works.",
      },
      {
        name: "Document intake",
        steps: ["File received", "Type detected", "Fields extracted", "Rules checked", "Exception flagged", "System updated"],
        detail:
          "Attachments stop being retyped. Clean structured records go to the system of origin, exceptions go to a person.",
      },
    ],
  },
  {
    key: "marketing",
    label: "Marketing",
    headline: "Content and campaign work with less manual overhead.",
    intro: "Recurring production steps automated, so the team spends time on judgement, not assembly.",
    workflows: [
      {
        name: "Campaign publishing",
        steps: ["Brief", "Draft generated", "Brand check by human", "Scheduled", "Performance logged"],
        detail:
          "Drafts are prepared from your assets, approved by a person, then published and measured without manual bookkeeping.",
      },
      {
        name: "Lead nurture",
        steps: ["Segment updated", "Message selected", "Sent on channel", "Reply routed to sales", "Outcome recorded"],
        detail:
          "Nurture stays consistent across channels and hands warm replies to sales immediately.",
      },
    ],
  },
  {
    key: "administration",
    label: "Administration",
    headline: "The paperwork behind the paperwork, handled.",
    intro: "Reports, records and reminders generated on schedule instead of by memory.",
    workflows: [
      {
        name: "Weekly reporting pack",
        steps: ["Sources synced", "KPIs calculated", "Summary written", "Pack assembled", "Delivered on schedule"],
        detail:
          "Numbers collected from every connected tool, reconciled, summarised in plain language and sent before standup.",
      },
      {
        name: "Requests and approvals",
        steps: ["Request submitted", "Validation checks", "Approver notified", "Decision recorded", "Requester updated"],
        detail:
          "Internal requests stop living in inboxes, with an auditable record at every step.",
      },
    ],
  },
] as const;

export const integrationTools = [
  { group: "Website & capture", items: ["Website forms", "Landing pages", "Live chat", "Booking calendar"] },
  { group: "Communication", items: ["Gmail / Outlook", "WhatsApp", "Slack", "SMS"] },
  { group: "Sales & records", items: ["HubSpot", "Zoho", "Salesforce", "Pipedrive", "Google Sheets"] },
  { group: "Knowledge & files", items: ["Notion", "Google Drive", "Airtable", "SharePoint"] },
  { group: "Automation layer", items: ["n8n", "Make", "Zapier", "Custom APIs"] },
];

export const signatureWorkflow = [
  { label: "Website Form", kind: "input", detail: "Name, company, requirement — captured once, never retyped." },
  { label: "AI Lead Analysis", kind: "ai", detail: "Intent, urgency and fit read from the actual message text." },
  { label: "Qualification", kind: "decision", detail: "Rules applied: budget signal, region, service match." },
  { label: "CRM", kind: "system", detail: "Record created with source, notes and owner assigned by rules." },
  { label: "Sales Notification", kind: "people", detail: "Slack / email ping with a two-line summary and a link." },
  { label: "WhatsApp Follow-up", kind: "channel", detail: "Personal, on-time acknowledgement with next steps." },
  { label: "Meeting", kind: "outcome", detail: "Calendar hold placed, agenda drafted, reminder scheduled." },
  { label: "Reporting", kind: "insight", detail: "Response time, source performance and stage flow updated." },
] as const;

export const heroFlow = [
  { label: "Lead", sub: "inbound signal" },
  { label: "AI Understanding", sub: "reads the message" },
  { label: "Decision", sub: "rules + judgement" },
  { label: "CRM", sub: "record + owner" },
  { label: "WhatsApp / Email", sub: "instant reply" },
  { label: "Team", sub: "only what matters" },
  { label: "Result", sub: "booked, tracked" },
];

export const faqs = [
  {
    q: "Do we have to replace the tools we already use?",
    a: "No. We build around the stack you already run — forms, mailbox, CRM, sheets, WhatsApp — and add the automation layer between them. Replacing systems is a separate conversation and rarely the first thing worth doing.",
  },
  {
    q: "What does an engagement actually look like?",
    a: "It starts with a strategy call and a short mapping phase, then a scoped build of one to three workflows. You receive the documented architecture, the working automation, and a walkthrough with your team before go-live.",
  },
  {
    q: "Who owns the systems you build?",
    a: "You do. Workflows, accounts and data stay in your environment wherever the platform allows it, and handover documentation is part of every build, not an upsell.",
  },
  {
    q: "Will AI be making decisions without us?",
    a: "Only where you explicitly allow it. Anything touching money, commitments or customer outcomes gets a human approval gate, and every automated action is logged so you can see what happened and why.",
  },
  {
    q: "What if something breaks after launch?",
    a: "Automations are built with retries, validation and alerting, so failures arrive in a queue instead of silently losing work. Post-launch support and optimisation windows are offered as part of an ongoing engagement.",
  },
  {
    q: "How do we start?",
    a: "Book a strategy call and describe the process that annoys you most. We tell you honestly whether it is a good automation candidate, and what a first build would involve.",
  },
] as const;

export const budgetBands = [
  "Under ₹1,00,000",
  "₹1,00,000 – ₹3,00,000",
  "₹3,00,000 – ₹6,00,000",
  "₹6,00,000+",
  "Not sure yet",
] as const;

export const projectTypes = [
  "AI Workflow Automation",
  "AI Agents",
  "AI Chatbot",
  "Voice AI",
  "WhatsApp Automation",
  "CRM & Sales Automation",
  "Document AI",
  "AI Dashboards & Reporting",
  "Custom AI Integrations",
  "Not sure — help me scope it",
] as const;
