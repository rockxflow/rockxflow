/** Shared, dependency-free validation used by both the client form and the API route. */

export type ContactField =
  | "name"
  | "business"
  | "email"
  | "phone"
  | "topic"
  | "message";

export type ContactPayload = {
  name: string;
  business: string;
  email: string;
  phone: string;
  topic: string;
  message: string;
  kind: string;
};

export type ValidationResult = { ok: true; value: ContactPayload } | { ok: false; errors: Partial<Record<ContactField, string>> };

const LIMITS: Record<ContactField, number> = {
  name: 120,
  business: 160,
  email: 160,
  phone: 40,
  topic: 120,
  message: 2000,
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
const PHONE_RE = /^[+]?[\d][\d\s-]{6,19}$/;

/** Trim, drop control characters, collapse whitespace, clamp length. */
export function sanitize(input: unknown, max: number): string {
  const s = typeof input === "string" ? input : "";
  return s
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

export function validateContact(raw: Record<string, unknown>): ValidationResult {
  const errors: Partial<Record<ContactField, string>> = {};

  const value: ContactPayload = {
    name: sanitize(raw.name, LIMITS.name),
    business: sanitize(raw.business, LIMITS.business),
    email: sanitize(raw.email, LIMITS.email),
    phone: sanitize(raw.phone, LIMITS.phone),
    topic: sanitize(raw.topic, LIMITS.topic),
    message: sanitize(raw.message, LIMITS.message),
    kind: sanitize(raw.kind, 40) || "general",
  };

  if (value.name.length < 2) errors.name = "Please tell us your name.";
  if (!value.email) errors.email = "An email address is required so we can reply.";
  else if (!EMAIL_RE.test(value.email)) errors.email = "That email address does not look valid.";
  if (value.phone && !PHONE_RE.test(value.phone)) errors.phone = "Use digits, spaces or a leading +.";
  if (!value.topic) errors.topic = "Choose what you would like to automate.";
  if (value.message.length < 20) errors.message = "A little more detail helps us answer usefully (20+ characters).";

  // Fields that must not be long enough to smuggle anything else
  (Object.keys(LIMITS) as ContactField[]).forEach((k) => {
    const given = typeof raw[k] === "string" ? (raw[k] as string).length : 0;
    if (given > LIMITS[k] * 3) errors[k] = "That response is too long to send here.";
  });

  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, value };
}

export const REQUIRED_HINT = "Required";
