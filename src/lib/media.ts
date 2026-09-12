/**
 * Typed access to the pre-optimised image derivatives produced by
 * tools/build-images.mjs. Rendering a <picture> ourselves keeps the
 * critical imagery free of any runtime image service dependency.
 */
import avifA from "./media/hero_a.json";
import avifB from "./media/hero_b.json";
import avifC from "./media/hero_c.json";
import flowDark from "./media/flow_dark.json";
import systemCore from "./media/system_core.json";
import operationsLight from "./media/operations_light.json";

export type MediaEntry = { w: number; file: string; kb: number };
export type MediaManifest = {
  name: string;
  width: number;
  height: number;
  aspect: number;
  srcset: Partial<Record<"webp" | "avif" | "jpg", MediaEntry[]>>;
  placeholder: string;
  placeholderKb?: number;
};

export const media = {
  heroA: avifA as MediaManifest,
  heroB: avifB as MediaManifest,
  heroC: avifC as MediaManifest,
  flowDark: flowDark as MediaManifest,
  systemCore: systemCore as MediaManifest,
  operationsLight: operationsLight as MediaManifest,
} as const;

export type MediaKey = keyof typeof media;

export function srcsetFor(m: MediaManifest, fmt: "webp" | "avif" | "jpg"): string {
  return (m.srcset[fmt] ?? []).map((e) => `${e.file} ${e.w}w`).join(", ");
}

/** Largest available JPEG acts as the universal <img> fallback. */
export function fallbackSrc(m: MediaManifest): string {
  const jpg = m.srcset.jpg ?? [];
  if (jpg.length) return jpg[jpg.length - 1].file;
  const webp = m.srcset.webp ?? [];
  return webp[webp.length - 1]?.file ?? "";
}

export function totalWeight(m: MediaManifest): number {
  const all = [...(m.srcset.webp ?? []), ...(m.srcset.avif ?? []), ...(m.srcset.jpg ?? [])];
  return Math.round(all.reduce((a, b) => a + b.kb, 0));
}
