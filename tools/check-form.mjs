#!/usr/bin/env node
/**
 * Contact-form delivery self-test.
 *
 *   node tools/check-form.mjs                     assertions against a running deployment
 *   node tools/check-form.mjs --live              + one real submission (needs a channel configured)
 *   node tools/check-form.mjs --sink [8788]       run a local JSON sink that prints enquiries
 *
 * Why a sink: it lets you prove the whole chain — form → POST /api/contact → your backend —
 * with no provider account. Start it, restart the server with
 * `CONTACT_WEBHOOK_URL=http://127.0.0.1:8787/`, then run `--live`.
 *
 * Exit code is non-zero if any assertion fails.
 */
import { createServer } from "node:http";

const args = process.argv.slice(2);
const URL_BASE = (process.env.CHECK_FORM_URL ?? "http://127.0.0.1:3000").replace(/\/$/, "");
const ENDPOINT = `${URL_BASE}/api/contact`;
const live = args.includes("--live");
const sinkMode = args.includes("--sink");

const ENQUIRY = {
  name: "Aditi Sharma",
  business: "Northline Logistics",
  email: "aditi@northline.example",
  phone: "+91 98765 43210",
  topic: "WhatsApp Automation",
  message: "Our dispatch team re-types the same status updates into WhatsApp three times a day and it takes an hour.",
  kind: "general",
  _company: "",
  _mountedAt: Date.now() - 60_000,
  _path: "/contact",
};

function log(ok, label, detail = "") {
  console.log(`${ok ? "\x1b[32m✓\x1b[0m" : "\x1b[31m✗\x1b[0m"} ${label}${detail ? ` — ${detail}` : ""}`);
  if (!ok) process.exitCode = 1;
}

async function post(body, waitMs = 0) {
  if (waitMs) await new Promise((r) => setTimeout(r, waitMs));
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => null);
  return { status: res.status, data };
}

if (sinkMode) {
  const port = Number(args[args.indexOf("--sink") + 1] || 8787);
  let n = 0;
  createServer((req, res) => {
    if (req.method !== "POST") {
      res.writeHead(405, { "content-type": "application/json" });
      return res.end(JSON.stringify({ ok: false }));
    }
    let raw = "";
    req.on("data", (c) => (raw += c));
    req.on("end", () => {
      n += 1;
      let parsed = raw;
      try {
        parsed = JSON.parse(raw);
      } catch {
        /* keep raw */
      }
      console.log(`\n\x1b[36m enquiry #${n} received\x1b[0m`);
      console.log(JSON.stringify(parsed, null, 2));
      res.writeHead(200, { "content-type": "application/json" });
      // answer the way each consumer expects: the inbox relay gets FormSubmit's shape
      const relayShaped = typeof parsed === "object" && parsed && "_subject" in parsed;
      res.end(JSON.stringify(relayShaped ? { success: "true", message: "Message sent successfully" } : { ok: true }));
    });
  })
    .once("error", (e) => {
      console.error("sink could not bind:", e.message);
      process.exit(1);
    })
    .listen(port, "0.0.0.0", () => {
      console.log(`Webhook sink listening on http://127.0.0.1:${port}/`);
      console.log(`Now restart the site server with:  CONTACT_WEBHOOK_URL=http://127.0.0.1:${port}/ npm run start`);
      console.log("…then run:  node tools/check-form.mjs --live");
      console.log("Ctrl-C to stop.");
    });
  process.on("SIGTERM", () => process.exit(0));
} else {
  console.log(`\x1b[1mContact form self-test\x1b[0m → ${ENDPOINT}\n`);

  let health;
  try {
    health = await fetch(ENDPOINT).then((r) => r.json());
  } catch (e) {
    console.error(`\n  Cannot reach ${ENDPOINT} (${e.message}).\n  Start the site first:  npm run build && npm run start   (or: npm run dev)\n`);
    process.exit(1);
  }
  log(Boolean(health?.endpoint === "contact"), "endpoint responds", `webhook=${health.channels?.webhook} email=${health.channels?.email}`);
  const relay = Boolean(health.channels?.relay);
  if (!health.channels?.webhook && !health.channels?.email && !relay) {
    console.log(`\n  \x1b[33mNo delivery channel configured on this deployment.\x1b[0m Missing: ${(health.missing ?? []).join(", ") || "—"}`);
    console.log("  Set one of them (see .env.example) — the site deliberately refuses to fake a send until then.\n");
  }
  if (relay && !health.channels?.webhook && !health.channels?.email) {
    console.log(`  \x1b[36mDelivering through the key-free relay\x1b[0m → ${health.relayTo}. First send needs the owner to tap FormSubmit's "Activate Form" email;\n  until then the endpoint answers below with success:false and the form shows that honestly.\n`);
  }

  const bad = await post({ ...ENQUIRY, email: "not-an-email", message: "too short", name: "A" });
  log(bad.status === 422 && bad.data?.code === "invalid", "invalid input rejected with 422", `fields: ${Object.keys(bad.data?.errors ?? {}).join(", ")}`);
  log(
    Boolean(bad.data?.errors?.name && bad.data?.errors?.email && bad.data?.errors?.message),
    "every failing field is reported"
  );
  log(!("budget" in (bad.data?.errors ?? {})) && !("budget" in ENQUIRY), "budget field is gone from the payload and the schema");

  const trap = await post({ ...ENQUIRY, _company: "SEO bots Ltd" }, 3200);
  log(trap.status === 200 && trap.data?.dropped === true, "honeypot submission dropped silently", JSON.stringify(trap.data));

  const fast = await post({ ...ENQUIRY, _mountedAt: Date.now() }, 0);
  log(fast.status === 429 && fast.data?.code === "too_fast", "sub-3-second submission blocked", JSON.stringify(fast.data));

  const good = await post({ ...ENQUIRY }, 3200);
  if (live) {
    log(good.status === 200 && good.data?.ok === true, "real submission delivered", `mode=${good.data?.mode ?? "—"}`);
  } else if (health.channels?.webhook || health.channels?.email) {
    log(good.status === 200 && good.data?.ok === true, "valid submission accepted", `mode=${good.data?.mode ?? "—"}`);
  } else if (relay) {
    const delivered = good.status === 200 && good.data?.ok === true;
    const honest = good.status === 503 && ["needs_activation", "upstream_failed"].includes(good.data?.code) && Boolean(good.data?.fallback?.email);
    log(delivered || honest, "relay path reports either delivery or the exact blocker", delivered ? "delivered" : `code=${good.data?.code}: ${(good.data?.message ?? "").slice(0, 78)}`);
  } else {
    log(
      good.status === 503 && good.data?.code === "not_configured" && Boolean(good.data?.fallback?.email),
      "unconfigured deployment answers honestly (503 + fallback, never a fake success)",
      `code=${good.data?.code}`
    );
    log(Array.isArray(good.data?.setup?.missing) && good.data.setup.missing.length > 0, "response names the missing variables", (good.data?.setup?.missing ?? []).join(", "));
  }

  const spam = await post({ ...ENQUIRY }, 3100);
  const limited = [good, spam].some((r) => r.status === 429 && r.data?.code === "rate_limited");
  if (limited) log(true, "rate limiter engaged during the run");
  else console.log("· rate limiter not triggered yet (6 per IP per 10 min) — normal on a fresh server");

  console.log(
    process.exitCode
      ? "\n\x1b[31mFAIL\x1b[0m — see the ✗ lines above.\n"
      : live
        ? "\n\x1b[32mPASS\x1b[0m — validation, guards and delivery all behave.\n"
        : "\n\x1b[32mPASS\x1b[0m — form logic behaves. Run with --live once a channel is set.\n"
  );
}
