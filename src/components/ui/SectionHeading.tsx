import { cn } from "@/lib/utils";
import { Reveal, SplitWords } from "./Reveal";

/**
 * Visual hierarchy contract for every section: eyebrow → headline → support.
 * `tone="dark"` is used inside cinematic sections where the palette inverts.
 */
export function SectionHeading({
  eyebrow,
  title,
  support,
  tone = "light",
  align = "left",
  accentWords,
  className,
  size = "h2",
  id,
  as = "h2",
}: {
  eyebrow?: string;
  title: string;
  support?: React.ReactNode;
  tone?: "light" | "dark";
  align?: "left" | "center";
  accentWords?: string[];
  className?: string;
  size?: "h1" | "h2";
  id?: string;
  as?: "h1" | "h2";
}) {
  const Heading = as;
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow ? (
        <Reveal>
          <p className={cn("t-eyebrow flex items-center gap-2.5", align === "center" && "justify-center")}>
            <span
              aria-hidden="true"
              className={cn(
                "inline-block h-px w-6",
                tone === "dark"
                  ? "bg-gradient-to-r from-transparent to-[#3aa6ff]"
                  : "bg-gradient-to-r from-transparent to-[#9dc6ec]"
              )}
            />
            {eyebrow}
          </p>
        </Reveal>
      ) : null}
      <Reveal y={18}>
        <Heading
          id={id}
          className={cn(size === "h1" ? "t-h1 mt-4" : "t-h2 mt-4", tone === "dark" && "text-[color:var(--color-on-dark)]")}
        >
          <SplitWords text={title} accentWords={accentWords} />
        </Heading>
      </Reveal>
      {support ? (
        <Reveal y={14} delay={0.08}>
          <div className={cn("t-lede mt-5", tone === "dark" ? "text-[#b3c2d1]" : "")}>{support}</div>
        </Reveal>
      ) : null}
    </div>
  );
}
