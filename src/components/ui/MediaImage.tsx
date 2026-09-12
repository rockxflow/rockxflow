import { fallbackSrc, srcsetFor, type MediaManifest } from "@/lib/media";
import { cn } from "@/lib/utils";

/**
 * Format- and size-aware <picture> built from the derivatives in
 * public/media (AVIF → WebP → JPEG, 640–1376px). A baked-in 24px blur
 * placeholder plus a reserved aspect ratio means zero layout shift and no
 * blank flash before the real bytes arrive.
 */
export function MediaImage({
  manifest,
  alt,
  sizes = "(min-width: 1280px) 1100px, (min-width: 768px) 88vw, 100vw",
  className,
  imgClassName,
  priority = false,
  mask = false,
}: {
  manifest: MediaManifest;
  alt: string;
  sizes?: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  /** subtle cinematic vignette + inner hairline, used on dark panels */
  mask?: boolean;
}) {
  const avif = srcsetFor(manifest, "avif");
  const webp = srcsetFor(manifest, "webp");
  const jpg = fallbackSrc(manifest);

  return (
    <figure className={cn("relative overflow-hidden bg-[#07111C]", className)} style={{ aspectRatio: `${manifest.width} / ${manifest.height}` }}>
      <picture>
        {avif ? (
          <source type="image/avif" srcSet={avif} sizes={sizes} />
        ) : null}
        {webp ? <source type="image/webp" srcSet={webp} sizes={sizes} /> : null}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={jpg}
          alt={alt}
          width={manifest.width}
          height={manifest.height}
          sizes={sizes}
          loading={priority ? "eager" : "lazy"}
          decoding={priority ? "sync" : "async"}
          fetchPriority={priority ? "high" : "auto"}
          // 24px WebP placeholder (≈0.6 KB) — crossfades out underneath the real image
          style={{
            backgroundColor: "#07111C",
            backgroundImage: manifest.placeholder ? `url("${manifest.placeholder}")` : undefined,
            backgroundSize: "100% 100%",
          }}
          className={cn("h-full w-full object-cover", imgClassName)}
        />
      </picture>
      {mask ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 100% at 78% 8%, rgba(0,140,255,0.10), transparent 60%), linear-gradient(to top, rgba(3,5,9,0.55), transparent 55%)",
            boxShadow: "inset 0 0 0 1px rgba(26,42,58,0.9)",
          }}
        />
      ) : null}
    </figure>
  );
}
