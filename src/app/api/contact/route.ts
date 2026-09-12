import { NextResponse } from "next/server";
import { validateContact } from "@/lib/validation";
import { site } from "@/lib/site";

/**
 * Contact endpoint — backend-ready, honest by construction.
 *
 * Delivery is attempted in this order, using server-only environment variables
 * (never exposed to the browser, never bundled into the client):
 *
 *   1. CONTACT_WEBHOOK_URL                  → n8n / Make / Zapier / your own API (JSON POST)
 *      CONTACT_WEBHOOK_TOKEN                 → optional `authorization: Bearer …` header
 *   2. RESEND_API_KEY + CONTACT_TO_EMAIL    → transactional email via the Resend HTTP API
 *      + CONTACT_FROM_EMAIL                    (swap for any provider; keys stay server-side)
 *
 * If neither channel is complete the request is NOT reported as successful: the client
 * receives `not_configured` plus the exact variable names that are missing, and shows the
 * direct-contact fallback instead. A visitor is never told "we got it" when nothing was
 * delivered. Enquiries are never persisted here — no database, no PII at rest.
 *
 * Everything the handler logs is redacted to a reason string, so an API key can never leak
 * into a response body.
 */

export const runtime = "nodejs";

type Bucket = { count: number; resetAt: number };
const rate = new Map<string, Bucket>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 6;

/** Which delivery channels are usable right now, and what is missing from each. */
function channels() {
  const webhookOk = Boolean(process.env.CONTACT_WEBHOOK_URL);
  const emailVars = {
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    CONTACT_TO_EMAIL: process.env.CONTACT_TO_EMAIL,
    CONTACT_FROM_EMAIL: process.env.CONTACT_FROM_EMAIL,
  };
  const emailMissing = Object.entries(emailVars)
    .filter(([, v]) => !v || !v.trim())
    .map(([k]) => k);
  return {
    webhook: webhookOk,
    email: emailMissing.length === 0,
    emailMissing,
    webhookToken: Boolean(process.env.CONTACT_WEBHOOK_TOKEN),
  };
}

/** A real human needs a moment to type. Sub-3-second submissions are bots. */
function tooFast(raw: unknown) {
  const t = Number(raw);
  return Number.isFinite(t) && t > 0 && Date.now() - t < 3000;
}

function throttled(key: string) {
  const now = Date.now();
  const b = rate.get(key);
  if (!b || b.resetAt < now) {
    rate.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  b.count += 1;
  return b.count > MAX_PER_WINDOW;
}

async function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout>;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error("upstream timeout")), ms);
  });
  try {
    return await Promise.race([p, timeout]);
  } finally {
    clearTimeout(timer!);
  }
}

/** "Reason" strings only — never the upstream body, which can echo a token back. */
function reason(err: unknown): string {
  if (err instanceof Error) return err.message.slice(0, 200);
  return String(err).slice(0, 200);
}

function enquiryText(p: Record<string, string>) {
  return [
    `Name: ${p.name}`,
    `Business: ${p.business || "—"}`,
    `Email: ${p.email}`,
    `Phone: ${p.phone || "—"}`,
    `Wants to automate: ${p.topic}`,
    `Enquiry type: ${p.kind}`,
    "",
    "Message:",
    p.message,
    "",
    `Received: ${p.submittedAt} · page: ${p.page}`,
  ].join("\n");
}

async function sendToWebhook(payload: Record<string, string>) {
  const webhook = process.env.CONTACT_WEBHOOK_URL!;
  const headers: Record<string, string> = { "content-type": "application/json" };
  if (process.env.CONTACT_WEBHOOK_TOKEN) headers.authorization = `Bearer ${process.env.CONTACT_WEBHOOK_TOKEN}`;
  const res = await withTimeout(fetch(webhook, { method: "POST", headers, body: JSON.stringify(payload) }), 9000);
  if (!res.ok) throw new Error(`upstream ${res.status}`);
  // Many workflow tools answer 200 with {"ok":false} when a node downstream failed.
  const ct = res.headers.get("content-type") ?? "";
  if (ct.includes("json")) {
    const data = (await res.json().catch(() => null)) as { ok?: boolean } | null;
    if (data && data.ok === false) throw new Error("upstream rejected the enquiry");
  }
  return res.status;
}

async function sendByEmail(payload: Record<string, string>) {
  const key = process.env.RESEND_API_KEY!;
  const to = process.env.CONTACT_TO_EMAIL!;
  const from = process.env.CONTACT_FROM_EMAIL!;
  const res = await withTimeout(
    fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
      body: JSON.stringify({
        from,
        to: to
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        reply_to: payload.email,
        subject: `Website enquiry · ${payload.topic || "New"} · ${payload.name}`,
        text: enquiryText(payload),
      }),
    }),
    9000
  );
  if (!res.ok) {
    const data = (await res.json().catch(() => null)) as { message?: string; name?: string } | null;
    throw new Error(`resend ${res.status}${data?.message ? `: ${data.message}` : ""}`);
  }
  return res.status;
}

export async function POST(req: Request) {
  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, code: "bad_request" }, { status: 400 });
  }

  // Honeypot: silently accept and drop anything a bot filled in.
  if (typeof body._company === "string" && body._company.trim().length > 0) {
    return NextResponse.json({ ok: true, dropped: true });
  }
  if (tooFast(body._mountedAt)) {
    return NextResponse.json({ ok: false, code: "too_fast" }, { status: 429 });
  }

  const ip = (req.headers.get("x-forwarded-for") ?? "local").split(",")[0]!.trim();
  if (throttled(ip || "unknown")) {
    return NextResponse.json(
      { ok: false, code: "rate_limited", message: "Too many attempts from this device. Please use WhatsApp or email." },
      { status: 429 }
    );
  }

  const result = validateContact(body);
  if (!result.ok) {
    return NextResponse.json({ ok: false, code: "invalid", errors: result.errors }, { status: 422 });
  }

  const payload: Record<string, string> = {
    ...result.value,
    submittedAt: new Date().toISOString(),
    page: typeof body._path === "string" ? body._path.slice(0, 200) : "/contact",
    source: "rockxflow-website",
  };

  const ch = channels();

  if (ch.webhook) {
    try {
      await sendToWebhook(payload);
      return NextResponse.json({ ok: true, mode: "webhook" });
    } catch (err) {
      console.error("[contact] webhook delivery failed:", reason(err));
      // An email channel can still rescue this enquiry — try it before failing.
      if (!ch.email) {
        return NextResponse.json(
          {
            ok: false,
            code: "upstream_failed",
            message: "Our intake service did not accept the message. Please try WhatsApp or email below — your text is still here.",
            fallback: { email: site.email, whatsapp: site.whatsapp, subject: `Website enquiry · ${payload.topic || "New"}` },
          },
          { status: 502 }
        );
      }
    }
  }

  if (ch.email) {
    try {
      await sendByEmail(payload);
      return NextResponse.json({ ok: true, mode: "email" });
    } catch (err) {
      console.error("[contact] email delivery failed:", reason(err));
      return NextResponse.json(
        {
          ok: false,
          code: "upstream_failed",
          message: "Our mail service could not accept the message. Please use WhatsApp or email below — your text is still here.",
          fallback: { email: site.email, whatsapp: site.whatsapp, subject: `Website enquiry · ${payload.topic || "New"}` },
        },
        { status: 502 }
      );
    }
  }

  // No delivery channel configured — say exactly what is missing. Never a fake success.
  const needs = [
    "CONTACT_WEBHOOK_URL",
    ...ch.emailMissing.map((k) => k),
  ];
  return NextResponse.json(
    {
      ok: false,
      code: "not_configured",
      message: `This deployment has no delivery channel yet, so nothing was sent. Set ${needs.join(" or ")} in the server environment (see .env.example), or reply directly to ${site.email}.`,
      setup: {
        channels: { webhook: ch.webhook, email: ch.email },
        missing: needs,
        docs: "README.md → “Making the form deliver”",
      },
      fallback: { email: site.email, whatsapp: site.whatsapp, subject: `Website enquiry · ${payload.topic || "New"}` },
    },
    { status: 503 }
  );
}

export function GET() {
  // Health/introspection for the integrator. Reports presence of variables only — never values.
  const ch = channels();
  return NextResponse.json({
    endpoint: "contact",
    methods: ["POST"],
    channels: { webhook: ch.webhook, email: ch.email },
    missing: ch.webhook ? [] : ["CONTACT_WEBHOOK_URL", ...ch.emailMissing],
    limits: { perIpPer10Minutes: MAX_PER_WINDOW, messageChars: 2000 },
  });
}
