import Link from "next/link";
import { LogoLockup } from "@/components/ui/Logo";
import { Icon } from "@/components/ui/Icon";
import { Cta } from "@/components/ui/Cta";
import { nav, services, site, strategyCallHref } from "@/lib/site";
import { year } from "@/lib/utils";

const workflow = "M 2 26 L 16 12 L 30 22 L 44 8 L 58 20 L 72 10 L 86 22 L 100 14";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-[#12283c] bg-[#030509] text-[color:var(--color-on-dark)]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(70% 60% at 88% 0%, rgba(0,140,255,0.12), transparent 62%)" }} />
        <svg viewBox="0 0 100 34" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-32 w-full opacity-[0.35]">
          <path d={workflow} fill="none" stroke="url(#rx-foot)" strokeWidth="0.3" vectorEffect="non-scaling-stroke" className="rx-anim-flow" style={{ strokeDasharray: "3 6" }} />
          <defs>
            <linearGradient id="rx-foot" x1="0" x2="1">
              <stop offset="0" stopColor="#008cff" stopOpacity="0" />
              <stop offset="0.5" stopColor="#00d9ff" stopOpacity="0.8" />
              <stop offset="1" stopColor="#0757a8" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="rx-shell relative py-16 md:py-20">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.25fr)_repeat(3,minmax(0,0.8fr))] lg:gap-12">
          <div className="max-w-sm">
            <Link href="/" aria-label={`${site.name} — home`} className="inline-flex rounded-lg">
              <LogoLockup className="w-60" />
            </Link>
            <p className="mt-5 text-[0.9375rem] leading-relaxed text-[#9db4c8]">
              AI-powered automation systems for modern businesses. We turn repetitive manual processes into intelligent
              workflows your team can rely on.
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              <Cta href={strategyCallHref} size="sm" icon="arrow">
                Start Automating
              </Cta>
              <Cta href={site.whatsapp} size="sm" variant="onDark" icon="whatsapp" event="cta_whatsapp" eventProps={{ placement: "footer" }}>
                WhatsApp
              </Cta>
            </div>
          </div>

          <nav aria-label="Footer navigation">
            <p className="t-mono uppercase tracking-[0.16em] text-[#5f89a8]">Navigate</p>
            <ul className="mt-4 space-y-2.5">
              {nav.map((n) => (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    className="group inline-flex items-center gap-2 text-[0.9375rem] text-[#c3d5e4] transition-colors hover:text-white"
                  >
                    <span className="h-px w-0 bg-[#00d9ff] transition-all duration-400 group-hover:w-3" aria-hidden="true" />
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Services">
            <p className="t-mono uppercase tracking-[0.16em] text-[#5f89a8]">Services</p>
            <ul className="mt-4 space-y-2.5">
              {services.map((svc) => (
                <li key={svc.slug}>
                  <Link
                    href={`/services#${svc.slug}`}
                    className="group inline-flex items-baseline gap-2 text-[0.9375rem] text-[#a8c0d4] transition-colors hover:text-white"
                  >
                    <span className="t-mono text-[#3d5e78] transition-colors group-hover:text-[#00d9ff]">{svc.index}</span>
                    {svc.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="t-mono uppercase tracking-[0.16em] text-[#5f89a8]">Contact</p>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href={`mailto:${site.email}`}
                  data-track="cta_email"
                  data-placement="footer"
                  className="group flex items-start gap-2.5 text-[0.9375rem] text-[#c3d5e4] transition-colors hover:text-white"
                >
                  <Icon name="mail" className="mt-0.5 h-4 w-4 shrink-0 text-[#66bfff]" accent={false} strokeWidth={1.7} />
                  <span className="break-all">{site.email}</span>
                </a>
              </li>
              <li>
                <a href={`tel:${site.phoneRaw}`} data-track="cta_call" data-placement="footer" className="flex items-center gap-2.5 text-[0.9375rem] text-[#c3d5e4] transition-colors hover:text-white">
                  <Icon name="phone" className="h-4 w-4 shrink-0 text-[#66bfff]" accent={false} strokeWidth={1.7} />
                  {site.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" data-track="cta_whatsapp" data-placement="footer" className="flex items-center gap-2.5 text-[0.9375rem] text-[#c3d5e4] transition-colors hover:text-white">
                  <Icon name="whatsapp" className="h-4 w-4 shrink-0 text-[#66bfff]" accent={false} strokeWidth={1.7} />
                  WhatsApp chat
                </a>
              </li>
              <li>
                <a href={site.instagram} target="_blank" rel="noopener noreferrer" aria-label="Rockxflow on Instagram (opens in a new tab)" title="Instagram" data-track="cta_instagram" data-placement="footer" className="flex items-center gap-2.5 text-[0.9375rem] text-[#c3d5e4] transition-colors hover:text-white">
                  <Icon name="instagram" className="h-4 w-4 shrink-0 text-[#66bfff]" accent={false} strokeWidth={1.7} />
                  Instagram
                </a>
              </li>
            </ul>
            <p className="mt-5 flex items-center gap-2 text-[0.8125rem] text-[#7e97ad]">
              <Icon name="shield" className="h-3.5 w-3.5 text-[#5f89a8]" accent={false} strokeWidth={1.7} />
              Every enquiry is read by whoever would build the system.
            </p>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-[#12283c] pt-6 md:flex-row md:items-center md:justify-between">
          <p className="text-[0.8125rem] text-[#6f8ca5]">
            © {year()} {site.legalName}. All rights reserved. · <span className="font-mono uppercase tracking-[0.14em] text-[#4d7699]">{site.tagline}</span>
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link href="/privacy-policy" className="text-[0.8125rem] text-[#a8c0d4] transition-colors hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-[0.8125rem] text-[#a8c0d4] transition-colors hover:text-white">
              Terms
            </Link>
            <a href="#main" className="group inline-flex items-center gap-1.5 text-[0.8125rem] text-[#a8c0d4] transition-colors hover:text-white">
              Back to top
              <span className="grid h-6 w-6 place-items-center rounded-md border border-[#1d3a52] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-[#00d9ff]">
                <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="M12 19V5m0 0-6 6m6-6 6 6" />
                </svg>
              </span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
