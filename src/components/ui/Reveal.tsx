"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { cn } from "@/lib/utils";

export const RX_EASE = [0.22, 0.61, 0.24, 1] as const;

/**
 * One motion language site-wide: content rises 16–18px into place on a 0.7s
 * ease-out curve, once, with light optical staggering for grouped copy.
 * With prefers-reduced-motion every branch renders static, fully-visible markup.
 */
const TAGS = {
  div: motion.div,
  span: motion.span,
  li: motion.li,
  p: motion.p,
  section: motion.section,
  ul: motion.ul,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
} as const;

type Tag = keyof typeof TAGS;

export function Reveal({
  children,
  className,
  delay = 0,
  y = 16,
  as = "div",
  amount = 0.22,
  duration = 0.7,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: Tag;
  amount?: number;
  duration?: number;
}) {
  if (useReducedMotion()) return <>{children}</>;
  const Cmp = TAGS[as];
  return (
    <Cmp
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration, ease: RX_EASE, delay }}
    >
      {children}
    </Cmp>
  );
}

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.66, ease: RX_EASE } },
};

/** Parent that staggers its <RevealItem> children. */
export function RevealGroup({
  children,
  className,
  stagger = 0.075,
  amount = 0.15,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  amount?: number;
}) {
  const reduce = useReducedMotion();
  const variants: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : stagger, delayChildren: 0.04 } },
  };
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div className={className} initial="hidden" whileInView="show" viewport={{ once: true, amount }} variants={variants}>
      {children}
    </motion.div>
  );
}

export function RevealItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  );
}

/**
 * Editorial headline reveal — words masked from below, one after another.
 * Rendered as real text inside the heading element so crawlers and screen
 * readers still read one continuous string.
 */
export function SplitWords({
  text,
  className,
  accentWords = [],
  delay = 0,
  wordClassName,
}: {
  text: string;
  className?: string;
  accentWords?: string[];
  delay?: number;
  wordClassName?: string;
}) {
  const reduce = useReducedMotion();
  const words = text.split(" ");

  return (
    <span className={cn("[word-break:normal-break-all]", className)}>
      {words.map((word, i) => {
        const clean = word.toLowerCase().replace(/[.,—–:;!?]/g, "");
        const accent = accentWords.includes(clean);
        const inner = (
          <span
            className={cn("inline-block", accent && "text-[color:var(--color-electric)]", wordClassName)}
            {...(reduce
              ? {}
              : {
                  variants: {
                    hidden: { y: "112%", opacity: 0 },
                    show: { y: 0, opacity: 1, transition: { duration: 0.78, ease: RX_EASE } },
                  },
                })}
          >
            {word}
          </span>
        );
        return (
          <span key={`${word}-${i}`} className="relative inline-block overflow-hidden align-bottom pb-[0.12em]">
            {inner}
            {i < words.length - 1 ? <span className="inline-block w-[0.25em]" aria-hidden="true" /> : null}
          </span>
        );
      })}
    </span>
  );
}

/** Simple opacity-only reveal for imagery and large blocks. */
export function Fade({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  if (useReducedMotion()) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.9, ease: RX_EASE, delay }}
    >
      {children}
    </motion.div>
  );
}
