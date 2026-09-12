"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Cta } from "@/components/ui/Cta";
import { Reveal } from "@/components/ui/Reveal";
import { contactContext } from "@/lib/contact";
import { services } from "@/lib/site";

/**
 * The two sidebar cards that depend on ?type= and ?service=. They are read in the
 * browser so /contact stays a plain static page (required for a static export), and
 * the general-enquiry copy is what prerenders — so crawlers and the no-JS view get
 * real content, never a skeleton.
 */
export function ParamNotes() {
  const [query, setQuery] = useState<{ type?: string | null; service?: string | null } | null>(null);
  const ctx = useMemo(() => contactContext(query ?? {}), [query]);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const type = q.get("type");
    const service = q.get("service");
    if (type || service) setQuery({ type, service });
  }, []);
  const service = services.find((s) => s.slug === ctx.serviceSlug);

  return (
    <>
      <Reveal delay={0.12}>
        <div className="rounded-2xl border border-[#cfe3f7] bg-[#f4f9ff] p-5">
          <p className="t-eyebrow">{service ? `Before you send` : "On this call, bring"}</p>
          <ul className="mt-3.5 space-y-2">
            {ctx.copy.bullets.map((b) => (
              <li key={b} className="flex items-start gap-2.5 text-[0.875rem] leading-snug text-[#2b3541]">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#008cff]" aria-hidden="true" />
                {b}
              </li>
            ))}
          </ul>
          <p className="t-small mt-4 border-t border-[#d6e8f9] pt-3">
            No shared calendar link: we schedule calls personally, so the first conversation is informed rather than
            generic.
          </p>
        </div>
      </Reveal>

      {service ? (
        <Reveal delay={0.18}>
          <div className="rounded-2xl border border-[#e4eaf1] bg-white p-5">
            <p className="t-eyebrow">About {service.title}</p>
            <p className="t-body mt-2.5 text-[0.9375rem]">{service.summary}</p>
            <Link href={`/services#${service.slug}`} className="rx-link mt-3">
              Full service breakdown
              <Icon name="arrowUpRight" className="h-3.5 w-3.5" accent={false} strokeWidth={2} />
            </Link>
          </div>
        </Reveal>
      ) : (
        <Reveal delay={0.18}>
          <div className="rounded-2xl border border-[#e4eaf1] bg-white p-5">
            <p className="t-eyebrow">Not sure what to ask?</p>
            <p className="t-body mt-2.5 text-[0.9375rem]">
              Describe the task you repeat most. That is usually where the first system belongs.
            </p>
            <Cta href="/services" variant="ghost" size="sm" className="mt-4">
              Browse the nine services
            </Cta>
          </div>
        </Reveal>
      )}
    </>
  );
}
