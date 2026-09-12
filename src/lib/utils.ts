export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export const isExternal = (href: string) => /^(https?:|mailto:|tel:)/.test(href);

export function year() {
  return new Date().getFullYear();
}
