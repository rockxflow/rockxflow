import { cn } from "@/lib/utils";

/**
 * Custom line-icon set (24×24, 1.5 stroke, rounded joins) drawn for Rockxflow.
 * The small accent dot is the brand's "active node" signature and is reused
 * across diagrams so icons and systems share one visual language.
 */
export type IconName =
  | "pipeline"
  | "agent"
  | "chat"
  | "voice"
  | "whatsapp"
  | "crm"
  | "documents"
  | "dashboard"
  | "integrations"
  | "automate"
  | "connect"
  | "accelerate"
  | "scale"
  | "arrow"
  | "arrowUpRight"
  | "check"
  | "menu"
  | "close"
  | "mail"
  | "phone"
  | "instagram"
  | "clock"
  | "shield"
  | "spark";

const paths: Record<IconName, React.ReactNode> = {
  pipeline: (
    <>
      <path d="M3.5 5.5h4M3.5 5.5v6.5a3 3 0 0 0 3 3h3" />
      <rect x="12.5" y="12.5" width="8" height="6" rx="2" />
      <circle cx="3.5" cy="5.5" r="1.4" />
      <path d="M16.5 15.5h2" />
    </>
  ),
  agent: (
    <>
      <rect x="5.5" y="7.5" width="13" height="9" rx="3" />
      <path d="M9 11.2v1.6M15 11.2v1.6M12 4.2v3.3" />
      <circle cx="12" cy="3.2" r="1.1" />
    </>
  ),
  chat: (
    <>
      <path d="M4 5.5h16v10H12l-4.5 3.5v-3.5H4z" />
      <path d="M8 9h8M8 12h5" />
    </>
  ),
  voice: (
    <>
      <path d="M3 12v-2M6.5 15V9M10 18V6M13.5 14.5v-5M17 16.5v-9M20.5 12.5v-1" />
    </>
  ),
  whatsapp: (
    <>
      <path d="M20 11.7A8 8 0 0 1 8.4 19L4 20.3l1.3-4.2A8 8 0 1 1 20 11.7Z" />
      <path d="M9.2 9.1c.4 2.4 2.3 4.3 4.7 4.7l.9-1.5 1.9.9" />
    </>
  ),
  crm: (
    <>
      <path d="M3.5 5.5h17M6 10.5h12M8.5 15.5h7M11 20.5h2" />
    </>
  ),
  documents: (
    <>
      <path d="M6 3.5h7l5 5v12H6z" />
      <path d="M13 3.5v5h5" />
      <path d="M9 12.5h6M9 15.5h4" />
    </>
  ),
  dashboard: (
    <>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" />
      <path d="M3.5 8.5h17M7 16v-3.5M11 16v-5.5M15 16v-2.5" />
    </>
  ),
  integrations: (
    <>
      <circle cx="6" cy="6.5" r="2.4" />
      <circle cx="18" cy="6.5" r="2.4" />
      <circle cx="12" cy="17.5" r="2.4" />
      <path d="M8.2 7.4 10.4 15.4M15.8 7.4 13.6 15.4M8.4 6.5h7.2" />
    </>
  ),
  automate: (
    <>
      <path d="M20 12a8 8 0 1 1-2.5-5.8" />
      <path d="M20.5 4v4.2h-4.2" />
      <path d="M12 8.8V12l2.4 1.6" />
    </>
  ),
  connect: (
    <>
      <path d="M10.2 13.8a3.6 3.6 0 0 0 5.1 0l2.6-2.6a3.6 3.6 0 0 0-5.1-5.1l-1 1" />
      <path d="M13.8 10.2a3.6 3.6 0 0 0-5.1 0L6.1 12.8a3.6 3.6 0 0 0 5.1 5.1l1-1" />
    </>
  ),
  accelerate: (
    <>
      <path d="M4.5 6v12M9 6v12M13.5 9v9M18 12v6" />
      <path d="M4 19h16" />
    </>
  ),
  scale: (
    <>
      <path d="M3.5 20.5h5v-4.5h5v-4.5h5V6.5" />
      <path d="M15 4.5h4.5V9" />
    </>
  ),
  arrow: <path d="M4 12h15m-5.5-5.5L19 12l-5.5 5.5" />,
  arrowUpRight: <path d="M7 17 17 7m-8.6 0H17v8.6" />,
  check: <path d="m5 12.5 4.5 4.5L19 7" />,
  menu: <path d="M3.5 7.5h17M3.5 12h17M3.5 16.5h11" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  mail: (
    <>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2.5" />
      <path d="m4.5 7.5 7.5 6 7.5-6" />
    </>
  ),
  phone: <path d="M6 3.5h3l1.5 4-2 1.5a11 11 0 0 0 6.5 6.5l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16.5 16.5 0 0 1 4 5.5a2 2 0 0 1 2-2Z" />,
  instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="4.1" />
      <circle cx="17.05" cy="6.95" r="1.15" fill="currentColor" stroke="none" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3.5 5 6v6c0 4 3 7 7 8.5 4-1.5 7-4.5 7-8.5V6z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  spark: <path d="M12 3.5 13.6 9 19 10.5 13.6 12 12 17.5 10.4 12 5 10.5 10.4 9z" />,
};

export function Icon({
  name,
  className,
  strokeWidth = 1.5,
  accent = true,
}: {
  name: IconName;
  className?: string;
  strokeWidth?: number;
  accent?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className={cn("h-6 w-6 shrink-0", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
      {accent ? <circle cx="19.4" cy="4.6" r="1.15" fill="currentColor" stroke="none" opacity="0.55" /> : null}
    </svg>
  );
}
