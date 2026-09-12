import { NextResponse } from "next/server";
import { validateContact } from "@/lib/validation";
import { site } from "@/lib/site";

/**
 * Contact endpoint — backend-ready, honest by construction.
 *
 * Delivery is attempted in this order, using server-only environment
 * variables (never exposed to the browser):
 *   1. CONTACT_WEBHOOK_URL      → n8n / Make / Zapier / internal API (JSON POST)
 *   2. RESEND_API_KEY +         → transactional email via the Resend HTTP API
 *      CONTACT_TO_EMAIL            (swap for any provider; key stays server-side)
 *
 * If neither is configured the request is NOT reported as successful. The
 * client receives `not_configured` and shows the direct-contact fallback, so a
 * visitor is never told “we got it” when nothing was delivered. Enquiries are
 * never persisted in this app — there is no database and no PII at rest.
 */

export const runtime = "nodejs";

type Bucket = { count: number; resetAt: number };
const rate = new Map<string, Bucket>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 6;

function tooFast(raw: unknown) {
  // A real human needs a moment to type. Sub-3-second submissions are bots.
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

  const payload = {
    ...result.value,
    submittedAt: new Date().toISOString(),
    page: typeof body._path === "string" ? body._path.slice(0, 200) : "/contact",
    source: "rockxflow-website",
  };

  const webhook = process.env.CONTACT_WEBHOOK_URL;
  if (webhook) {
    try {
      const res = await withTimeout(
        fetch(webhook, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(payload),
        }),
        9000
      );
      if (!res.ok) throw new Error(`upstream ${res.status}`);
      return NextResponse.json({ ok: true, mode: "webhook" });
    } catch (err) {
      console.error("[contact] webhook delivery failed:", (err as Error).message);
      return NextResponse.json(
        { ok: false, code: "upstream_failed", message: "Our intake service did not accept the message. Please try WhatsApp or email below." },
        { status: 502 }
      );
    }
  }

  const resendKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (resendKey && to && from) {
    try {
      const res = await withTimeout(
        fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { authorization: `Bearer ${resendKey}`, "content-type": "application/json" },
          body: JSON.stringify({
            from,
            to: [to],
            reply_to: payload.email,
            subject: `Website enquiry · ${payload.topic || "New"} · ${payload.name}`,
            text: [
              `Name: ${payload.name}`,
              `Business: ${payload.business || "—"}`,
              `Email: ${payload.email}`,
              `Phone: ${payload.phone || "—"}`,
              `Wants to automate: ${payload.topic}`,
              `Budget band: ${payload.budget || "—"}`,
              `Enquiry type: ${payload.kind}`,
              "",
              "Message:",
              payload.message,
              "",
              `Received: ${payload.submittedAt}`,
            ].join("\n"),
          }),
        }),
        9000
      );
      if (!res.ok) throw new Error(`resend ${res.status}`);
      return NextResponse.json({ ok: true, mode: "email" });
    } catch (err) {
      console.error("[contact] email delivery failed:", (err as Error).message);
      return NextResponse.json(
        { ok: false, code: "upstream_failed", message: "Our mail service could not accept the message. Please use WhatsApp or email below." },
        { status: 502 }
      );
    }
  }

  // No delivery channel configured — say so, and hand over the working ones.
  return NextResponse.json({
    ok: false,
    code: "not_configured",
    message: `The form’s delivery channel is not configured on this deployment yet. Your enquiry is ready to send directly to ${site.email} or on WhatsApp.`,
    fallback: { email: site.email, whatsapp: site.whatsapp, subject: `Website enquiry · ${payload.topic || "New"}` },
  });
}

export function GET() {
  // Health/introspection for the integrator. Never exposes secrets.
  return NextResponse.json({
    endpoint: "contact",
    methods: ["POST"],
    channels: {
      webhook: Boolean(process.env.CONTACT_WEBHOOK_URL),
      email: Boolean(process.env.RESEND_API_KEY && process.env.CONTACT_TO_EMAIL && process.env.CONTACT_FROM_EMAIL),
    },
    limits: { perIpPer10Minutes: MAX_PER_WINDOW, messageChars: 2000 },
  });
}
