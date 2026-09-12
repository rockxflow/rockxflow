"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { contactContext } from "@/lib/contact";
import { projectTypes, site } from "@/lib/site";
import { validateContact, type ContactField } from "@/lib/validation";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

type Values = {
  name: string;
  business: string;
  email: string;
  phone: string;
  topic: string;
  message: string;
};

const EMPTY: Values = { name: "", business: "", email: "", phone: "", topic: "", message: "" };

type Status = "idle" | "submitting" | "success" | "error" | "composed";

/**
 * Where a submission goes. Three deployments, one component:
 *   • Next.js server   → POST /api/contact (validated, rate-limited, webhook → Resend → relay)
 *   • static export    → the key-free relay below, which forwards to the site's own inbox
 *   • NEXT_PUBLIC_FORM_ENDPOINT → POST there instead (Formspree, Getform, an n8n webhook…)
 * The relay is FormSubmit's public AJAX endpoint for `site.email`: no account, no API key and
 * nothing secret in the bundle — just the address that is already printed on the site. The
 * inbox owner taps “Activate Form” once (FormSubmit's anti-spam confirmation) and enquiries
 * start arriving; until then it answers success:false and the form reports that honestly.
 * Set NEXT_PUBLIC_FORM_ENDPOINT to "" to go back to compose-an-email-only behaviour.
 */
const EXTERNAL_ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT as string | undefined;
const STATIC_BUILD = process.env.NEXT_PUBLIC_STATIC_EXPORT === "1";
const RELAY_ENDPOINT = `https://formsubmit.co/ajax/${site.email}`;
const DELIVERY_ENDPOINT = EXTERNAL_ENDPOINT ?? (STATIC_BUILD ? RELAY_ENDPOINT : "/api/contact");
/** The relay speaks its own small contract (`{success:"true"}`), the API route speaks `{ok:true}`. */
const USES_RELAY = /formsubmit\.co/.test(DELIVERY_ENDPOINT);

/**
 * Accessible, progressive form. Submits to /api/contact; on any failure the
 * visitor keeps their text and is handed a working direct channel (never a
 * fake confirmation).
 */
export function ContactForm({ initialTopic = "", kind = "general", contextTitle }: { initialTopic?: string; kind?: string; contextTitle?: string } = {}) {
  // ?type= and ?service= are read in an effect, not with useSearchParams: that keeps
  // /contact prerenderable as a static page (a static export cannot read query params
  // on the server), while the server-rendered props stay the default for no-JS visits.
  const [query, setQuery] = useState<{ type?: string | null; service?: string | null } | null>(null);
  const ctx = useMemo(() => contactContext(query ?? {}), [query]);
  const kindKey = query?.type ? ctx.kind : kind;
  const banner = query?.type || query?.service ? ctx.contextTitle : contextTitle ?? ctx.contextTitle;
  const preselect = query?.service ? ctx.topic : initialTopic;
  const [v, setV] = useState<Values>({ ...EMPTY, topic: preselect });
  const [errors, setErrors] = useState<Partial<Record<ContactField, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<ContactField, boolean>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverNote, setServerNote] = useState<{ message: string; fallback?: { email: string; whatsapp: string } } | null>(null);
  const [copied, setCopied] = useState(false);
  const mountedAt = useRef(Date.now());
  const started = useRef(false);
  /** Guards every exit path of onSubmit so one click = one request. */
  const inFlight = useRef(false);
  const firstField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (preselect) setV((s) => (s.topic ? s : { ...s, topic: preselect }));
  }, [preselect]);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const type = q.get("type");
    const service = q.get("service");
    if (!type && !service) return;
    setQuery({ type, service });
    // …and land with the first field ready to type in.
    const t = window.setTimeout(() => firstField.current?.focus(), 60);
    return () => window.clearTimeout(t);
  }, []);

  const set = (k: keyof Values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!started.current) {
      started.current = true;
      track("contact_form_start" as never, { kind: kindKey });
    }
    setV((s) => ({ ...s, [k]: e.target.value }));
    if (touched[k as ContactField]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[k as ContactField];
        return next;
      });
    }
  };

  const blur = (k: ContactField) => () => {
    setTouched((t) => ({ ...t, [k]: true }));
    const res = validateContact({ ...v, [k]: v[k] });
    if (!res.ok) setErrors((e) => ({ ...e, [k]: res.errors[k] }));
    else
      setErrors((e) => {
        const next = { ...e };
        delete next[k];
        return next;
      });
  };

  const composeMailBody = useMemo(
    () =>
      [
        `Name: ${v.name}`,
        `Business: ${v.business || "—"}`,
        `Email: ${v.email}`,
        `Phone: ${v.phone || "—"}`,
        `Wants to automate: ${v.topic || "—"}`,
        "",
        v.message,
      ].join("\n"),
    [v]
  );

  const mailtoHref = `mailto:${site.email}?subject=${encodeURIComponent(`Website enquiry · ${v.topic || "Automation"}`)}&body=${encodeURIComponent(composeMailBody)}`;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    // One request per visitor, whatever the keyboard does: Enter, double click or a
    // retry after a failure all land behind this guard.
    if (inFlight.current) return;
    inFlight.current = true;
    const res = validateContact({ ...v, kind: kindKey, _path: window.location.pathname });
    if (!res.ok) {
      setErrors(res.errors);
      setTouched({ name: true, email: true, phone: true, topic: true, message: true });
      const firstKey = Object.keys(res.errors)[0];
      document.getElementById(`f-${firstKey}`)?.focus();
      track("contact_form_error" as never, { reason: "validation", kind: kindKey });
      inFlight.current = false;
      return;
    }

    if (!DELIVERY_ENDPOINT) {
      // No server in this deployment: hand the visitor a pre-filled email instead of
      // pretending the message reached us. The text stays in the form until their own
      // mail client takes it, so nothing is silently dropped.
      window.location.href = mailtoHref;
      setStatus("composed");
      track("contact_form_compose" as never, { kind: kindKey, topic: v.topic });
      inFlight.current = false;
      return;
    }

    // A filled honeypot means a bot, not a person: same silent drop the API route does.
    const honey = (document.getElementById("f-company") as HTMLInputElement | null)?.value ?? "";
    if (honey.trim()) {
      setStatus("success");
      inFlight.current = false;
      return;
    }

    setStatus("submitting");
    setServerNote(null);
    try {
      const body = USES_RELAY
        ? {
            name: v.name,
            Business: v.business || "—",
            Email: v.email,
            Phone: v.phone || "—",
            "Wants to automate": v.topic,
            "Enquiry type": kindKey,
            Message: v.message,
            Page: window.location.pathname,
            _subject: `Website enquiry · ${v.topic || "New"} · ${v.name}`,
            _template: "table",
            _captcha: "false",
            _honey: "",
          }
        : { ...v, kind: kindKey, _company: "", _mountedAt: mountedAt.current, _path: window.location.pathname };

      const r = await fetch(DELIVERY_ENDPOINT, {
        method: "POST",
        headers: { "content-type": "application/json", accept: "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await r.json().catch(() => ({}))) as {
        ok?: boolean;
        success?: boolean | string;
        message?: string;
        code?: string;
        errors?: Partial<Record<ContactField, string>>;
        fallback?: { email: string; whatsapp: string };
      };

      // Delivered only when the backend says so: `{ok:true}` from our route,
      // `{success:"true"}` from the relay. Anything else — 200 included — is an error.
      if (r.ok && (data.ok === true || data.success === true || data.success === "true")) {
        setStatus("success");
        track("contact_form_submit" as never, { kind: kindKey, topic: v.topic });
        return;
      }
      // Anything else — including a backend that answered but did not deliver — is an
      // error state. The form keeps its contents and never claims success.
      if (data.errors) setErrors(data.errors);
      setStatus("error");
      setServerNote({ message: data.message ?? "We could not deliver that message. Please use WhatsApp or email below — your text is still here.", fallback: data.fallback });
      track("contact_form_error" as never, { reason: data.code ?? "unknown", kind: kindKey });
    } catch {
      setStatus("error");
      setServerNote({ message: "Network problem — nothing was sent. Your text is still here; WhatsApp or email will reach us instantly." });
      track("contact_form_error" as never, { reason: "network", kind: kindKey });
    } finally {
      inFlight.current = false;
    }
  }

  if (status === "composed") {
    return (
      <div className="rounded-2xl border border-[#cfe3f7] bg-[#f4f9ff] p-6 sm:p-8" role="status" aria-live="polite">
        <span className="grid h-11 w-11 place-items-center rounded-xl border border-[#a9cdf5] bg-white text-[#0757a8]">
          <Icon name="mail" className="h-5 w-5" accent={false} strokeWidth={1.8} />
        </span>
        <h2 className="t-h3 mt-4 text-[#0a0f14]">Draft opened in your email app</h2>
        <p className="t-body mt-2 max-w-lg">
          This copy of the site is static, so nothing was sent from the browser — your enquiry is
          pre-filled in a new message to <span className="font-medium text-[#0a0f14]">{site.email}</span>. Press
          send there, or use WhatsApp instead. Your text is still in the form if you go back.
        </p>
        <div className="mt-6 flex flex-wrap gap-2.5">
          <a href={mailtoHref} className="rx-btn rx-btn-primary rx-btn-sm">
            <Icon name="mail" className="h-4 w-4" accent={false} strokeWidth={1.8} />
            Open the draft again
          </a>
          <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="rx-btn rx-btn-ghost rx-btn-sm">
            <Icon name="whatsapp" className="h-4 w-4" accent={false} strokeWidth={1.7} />
            Send on WhatsApp
          </a>
          <button
            type="button"
            className="rx-btn rx-btn-ghost rx-btn-sm"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(composeMailBody);
                setCopied(true);
                window.setTimeout(() => setCopied(false), 2400);
              } catch {
                setCopied(false);
              }
            }}
          >
            {copied ? "Copied ✓" : "Copy the message"}
          </button>
          <button type="button" className="rx-btn rx-btn-ghost rx-btn-sm" onClick={() => setStatus("idle")}>
            Back to the form
          </button>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-[#c7e6d4] bg-[#f2fbf6] p-6 sm:p-8" role="status" aria-live="polite">
        <span className="grid h-11 w-11 place-items-center rounded-xl border border-[#a9dcbd] bg-white text-[#22c55e]">
          <Icon name="check" className="h-5 w-5" accent={false} strokeWidth={2.4} />
        </span>
        <h2 className="t-h3 mt-4 text-[#0a0f14]">Message sent — what happens next</h2>
        <p className="t-body mt-2 max-w-lg">
          Thanks {v.name.split(" ")[0] || ""}. We read every enquiry ourselves. The reply goes to{" "}
          <span className="font-medium text-[#0a0f14]">{v.email}</span> — the same address you used on the form. If it is
          urgent, WhatsApp is the fastest route to a human.
        </p>
        <ul className="mt-5 space-y-2">
          {[
            "We review the process you described and check it is a genuine automation candidate.",
            "You get a short written view: what could be automated, and what should not be.",
            "If it makes sense, we book a scoping session and agree one first build.",
          ].map((s, i) => (
            <li key={s} className="flex gap-3 text-[0.9375rem] leading-relaxed text-[#2b3541]">
              <span className="t-mono mt-0.5 shrink-0 text-[#22c55e]">{i + 1}</span>
              {s}
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap gap-2.5">
          <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="rx-btn rx-btn-ghost rx-btn-sm">
            <Icon name="whatsapp" className="h-4 w-4" accent={false} strokeWidth={1.7} />
            Message on WhatsApp
          </a>
          <button
            type="button"
            className="rx-btn rx-btn-ghost rx-btn-sm"
            onClick={() => {
              setStatus("idle");
              setV({ ...EMPTY });
              setErrors({});
              setTouched({});
              window.setTimeout(() => firstField.current?.focus(), 40);
            }}
          >
            Send another enquiry
          </button>
        </div>
      </div>
    );
  }

  const field = (k: keyof Values, label: string, opts: { type?: string; required?: boolean; hint?: string; placeholder?: string; as?: "input" | "textarea" | "select"; options?: readonly string[] } = {}) => {
    const err = errors[k as ContactField];
    const id = `f-${k}`;
    const descId = `${id}-desc`;
    const invalid = Boolean(err);
    const common = {
      id,
      name: k,
      "aria-invalid": invalid || undefined,
      "aria-describedby": err || opts.hint ? descId : undefined,
      required: opts.required,
      placeholder: opts.placeholder,
      onChange: set(k),
      onBlur: blur(k as ContactField),
      value: (v[k] ?? "").toString(),
      className: cn(
        "w-full rounded-xl border bg-white px-3.5 py-3 font-sans text-[0.9375rem] text-[#0a0f14] outline-none transition-all duration-300 placeholder:text-[#a8b2bd]",
        invalid
          ? "border-[#f04438] shadow-[0_0_0_3px_rgba(240,68,56,0.10)]"
          : "border-[#dde5ed] focus:border-[#008cff] focus:shadow-[0_0_0_3px_rgba(0,140,255,0.12)]"
      ),
    };

    return (
      <div>
        <label htmlFor={id} className="mb-1.5 flex items-baseline justify-between gap-3">
          <span className="font-display text-[0.8125rem] font-bold uppercase tracking-[0.06em] text-[#0a0f14]">
            {label}
            {opts.required ? <span className="ml-1 text-[#f04438]" aria-hidden="true">*</span> : null}
          </span>
          {!opts.required ? <span className="font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-[#a8b2bd]">optional</span> : null}
        </label>
        {opts.as === "textarea" ? (
          <textarea {...common} rows={6} maxLength={2000} className={cn(common.className, "resize-y leading-relaxed")} />
        ) : opts.as === "select" ? (
          <div className="relative">
            <select {...common} className={cn(common.className, "appearance-none pr-10")}>
              <option value="">Select…</option>
              {opts.options?.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
            <span aria-hidden="true" className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8b97a3]">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </span>
          </div>
        ) : (
          <input {...common} type={opts.type ?? "text"} inputMode={k === "phone" ? "tel" : k === "email" ? "email" : undefined} autoComplete={k === "email" ? "email" : k === "name" ? "name" : "off"} ref={k === "name" ? firstField : undefined} />
        )}
        <p id={descId} className="mt-1.5 min-h-[1.05rem] text-[0.78125rem] leading-snug">
          {err ? (
            <span className="flex items-center gap-1.5 font-medium text-[#c02c22]">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7.5v5m0 3h.01" strokeLinecap="round" />
              </svg>
              {err}
            </span>
          ) : opts.hint ? (
            <span className="text-[#66717d]">{opts.hint}</span>
          ) : null}
        </p>
      </div>
    );
  };

  return (
    <form onSubmit={onSubmit} noValidate className="relative rounded-2xl border border-[#e4eaf1] bg-white p-5 shadow-[var(--shadow-soft)] sm:p-7">
      {banner ? (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-[#cfe3f7] bg-[#f4f9ff] p-3.5">
          <Icon name="clock" className="mt-0.5 h-4 w-4 shrink-0 text-[#0757a8]" accent={false} strokeWidth={1.8} />
          <p className="text-[0.875rem] leading-relaxed text-[#2b3541]">{banner}</p>
        </div>
      ) : null}

      <p className="t-eyebrow">Enquiry form</p>
      <h2 className="t-h3 mt-2">Tell us what is slowing you down</h2>
      <p className="t-small mt-1.5">Fields marked * are required. Everything else helps us answer more usefully on the first reply.</p>

      <div className="mt-6 grid gap-x-4 gap-y-1 sm:grid-cols-2">
        {field("name", "Your name", { required: true, placeholder: "e.g. Aditi Sharma" })}
        {field("business", "Business name", { placeholder: "Company or team" })}
        {field("email", "Email", { type: "email", required: true, placeholder: "you@company.com" })}
        {field("phone", "Phone / WhatsApp", { type: "tel", placeholder: "+91 …", hint: "Best number to reach you on." })}
        <div className="sm:col-span-2">
          {field("topic", "What do you want to automate?", {
            required: true,
            as: "select",
            options: projectTypes,
            hint: "Pick the closest — we will refine it together.",
          })}
        </div>
      </div>

      <div className="mt-1">
        {field("message", "Message", {
          required: true,
          as: "textarea",
          placeholder:
            "Which process repeats? How often does it happen? Which tools are involved (CRM, mailbox, sheets, WhatsApp)? What does a good outcome look like in 60 days?",
          hint: `${v.message.length}/2000 characters — specifics help us judge feasibility fast.`,
        })}
      </div>

      {/* Honeypot — hidden from people, irresistible to bots. */}
      <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden opacity-0">
        <label htmlFor="f-company">Company</label>
        <input id="f-company" name="_company" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-4 border-t border-[#eef2f6] pt-5">
        <p className="t-small flex max-w-sm items-start gap-2">
          <Icon name="shield" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#0757a8]" accent={false} strokeWidth={1.8} />
          Used only to reply to this enquiry. No lists, no resale, no storage beyond our mail system.
        </p>
        <button type="submit" className="rx-btn rx-btn-primary" disabled={status === "submitting"} aria-busy={status === "submitting"}>
          {status === "submitting" ? (
            <>
              <svg viewBox="0 0 24 24" className="h-4 w-4 animate-spin" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path d="M12 3a9 9 0 1 0 9 9" strokeLinecap="round" />
              </svg>
              Sending…
            </>
          ) : (
            <>
              Start the Conversation
              <Icon name="arrow" className="h-4 w-4" accent={false} strokeWidth={2} />
            </>
          )}
        </button>
      </div>

      {status === "error" && serverNote ? (
        <div role="alert" className="mt-4 rounded-xl border border-[#f5c6c1] bg-[#fff5f4] p-4">
          <p className="flex items-start gap-2.5 text-[0.875rem] font-medium leading-relaxed text-[#8a2318]">
            <Icon name="shield" className="mt-0.5 h-4 w-4 shrink-0 text-[#f04438]" accent={false} strokeWidth={1.9} />
            {serverNote.message}
          </p>
          <div className="mt-3.5 flex flex-wrap gap-2">
            <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="rx-btn rx-btn-primary rx-btn-sm">
              <Icon name="whatsapp" className="h-4 w-4" accent={false} strokeWidth={1.7} />
              Send via WhatsApp
            </a>
            <a href={mailtoHref} className="rx-btn rx-btn-ghost rx-btn-sm">
              <Icon name="mail" className="h-4 w-4" accent={false} strokeWidth={1.7} />
              Send via email
            </a>
            <button
              type="button"
              className="rx-btn rx-btn-ghost rx-btn-sm"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(composeMailBody);
                  setCopied(true);
                  window.setTimeout(() => setCopied(false), 2400);
                } catch {
                  setCopied(false);
                }
              }}
            >
              {copied ? "Copied ✓" : "Copy message"}
            </button>
          </div>
          <p className="t-small mt-3">
            Nothing was lost — your text stays in the form, and “Send via email” opens your mail app with it pre-filled.
          </p>
        </div>
      ) : null}
    </form>
  );
}
