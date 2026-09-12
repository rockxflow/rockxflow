"use client";

import Link from "next/link";
import { Icon, type IconName } from "./Icon";
import { cn, isExternal } from "@/lib/utils";
import { track } from "@/lib/analytics";

type Variant = "primary" | "onDark" | "ghost" | "quiet";
type Size = "sm" | "md";

const variantClass: Record<Variant, string> = {
  primary: "rx-btn-primary",
  onDark: "rx-btn-on-dark",
  ghost: "rx-btn-ghost",
  quiet: "rx-btn-ghost border-transparent bg-transparent",
};

export function Cta({
  href,
  children,
  variant = "primary",
  size = "md",
  icon = "arrow",
  onClick,
  event,
  eventProps,
  className,
  ariaLabel,
}: {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  icon?: IconName | null;
  onClick?: () => void;
  event?: string;
  eventProps?: Record<string, string | number | boolean>;
  className?: string;
  ariaLabel?: string;
}) {
  const external = isExternal(href);
  const cls = cn("rx-btn", variantClass[variant], size === "sm" && "rx-btn-sm", className);
  const handle = () => {
    if (event) track(event as never, eventProps);
    onClick?.();
  };
  const content = (
    <>
      <span>{children}</span>
      {icon ? <Icon name={icon} className="h-[1.05em] w-[1.05em]" accent={false} strokeWidth={1.8} /> : null}
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        className={cls}
        onClick={handle}
        aria-label={ariaLabel}
        {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} onClick={handle} aria-label={ariaLabel}>
      {content}
    </Link>
  );
}

export function TextLink({
  href,
  children,
  icon = "arrowUpRight",
  className,
  event,
  eventProps,
}: {
  href: string;
  children: React.ReactNode;
  icon?: IconName | null;
  className?: string;
  event?: string;
  eventProps?: Record<string, string | number>;
}) {
  const cls = cn("rx-link", className);
  const content = (
    <>
      <span>{children}</span>
      {icon ? <Icon name={icon} className="h-[1.05em] w-[1.05em]" accent={false} strokeWidth={1.9} /> : null}
    </>
  );
  return isExternal(href) ? (
    <a
      href={href}
      className={cls}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      onClick={() => event && track(event as never, eventProps)}
    >
      {content}
    </a>
  ) : (
    <Link href={href} className={cls} onClick={() => event && track(event as never, eventProps)}>
      {content}
    </Link>
  );
}
