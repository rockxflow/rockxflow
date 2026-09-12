/**
 * Analytics integration point.
 *
 * No tracking IDs are invented. Events are dispatched to:
 *   1. `window.dataLayer` (Google Tag Manager) when present
 *   2. a custom `rockxflow:event` DOM event (Plausible / Vercel / custom listener)
 *   3. `NEXT_PUBLIC_ANALYTICS_ENDPOINT` (sendBeacon) when configured
 *
 * Set `NEXT_PUBLIC_ANALYTICS_ENDPOINT` / add your GTM snippet in
 * src/app/layout.tsx <head> to go live — no component changes required.
 * Safe to import from server components: every call is guarded by a window check.
 */
export const EVENTS = {
  strategyCall: "cta_strategy_call",
  whatsapp: "cta_whatsapp",
  emailClick: "cta_email",
  serviceOpen: "service_open",
  navCta: "nav_cta_click",
  automationCategory: "automation_category_view",
  formStart: "contact_form_start",
  formSubmit: "contact_form_submit",
  formError: "contact_form_error",
  footerCta: "footer_cta",
  scrollDepth: "scroll_depth",
} as const;

export type EventName = (typeof EVENTS)[keyof typeof EVENTS];

const endpoint = process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT as string | undefined;

export function track(name: EventName, props: Record<string, string | number | boolean | undefined> = {}) {
  if (typeof window === "undefined") return;
  try {
    const payload = { event: name, ...props, ts: Date.now() };
    const w = window as unknown as { dataLayer?: unknown[] };
    if (Array.isArray(w.dataLayer)) w.dataLayer.push(payload);
    window.dispatchEvent(new CustomEvent("rockxflow:event", { detail: payload }));
    if (endpoint) {
      const body = JSON.stringify(payload);
      if ("sendBeacon" in navigator) navigator.sendBeacon(endpoint, body);
      else void fetch(endpoint, { body, method: "POST", keepalive: true });
    }
  } catch {
    /* analytics must never break the interface */
  }
}
