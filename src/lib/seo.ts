import type { Metadata } from "next";
import { services, site } from "./site";

/**
 * Canonical origin. Set NEXT_PUBLIC_SITE_URL at deploy time to the real
 * production domain — nothing on the site presents a placeholder as live.
 */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://rockxflow.com").replace(/\/$/, "");

export const socialImagePath = "/media/og.webp";

type PageMeta = {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
};

export function buildMetadata({ title, description, path = "", keywords }: PageMeta): Metadata {
  const url = `${siteUrl}${path || "/"}`;
  const full = title.startsWith(site.name) ? title : `${title} | ${site.name}`;
  return {
    title,
    description,
    keywords,
    alternates: { canonical: path || "/" },
    openGraph: {
      type: path ? "article" : "website",
      url,
      siteName: site.name,
      title: full,
      description,
      images: [
        {
          url: `${siteUrl}${socialImagePath}`,
          width: 1200,
          height: 630,
          alt: `${site.name} — ${site.claim}`,
        },
      ],
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title: full,
      description,
      images: [`${siteUrl}${socialImagePath}`],
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${siteUrl}/#organization`,
    name: site.name,
    description: `${site.name} is an ${site.category.toLowerCase()} that turns repetitive business processes into intelligent AI-powered systems.`,
    url: siteUrl,
    logo: `${siteUrl}/icons/logo-mark.svg`,
    email: site.email,
    telephone: site.phoneRaw,
    slogan: site.tagline,
    areaServed: "Worldwide",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Faridabad",
      addressRegion: "Haryana",
      addressCountry: "IN",
    },
    knowsAbout: [
      "AI Workflow Automation",
      "AI Agents",
      "AI Chatbots",
      "AI Voice Agents",
      "WhatsApp Automation",
      "CRM Automation",
      "Document AI",
      "Business Process Automation",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      email: site.email,
      telephone: site.phoneRaw,
      availableLanguage: ["en", "hi"],
    },
    sameAs: [site.facebook],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: site.name,
    description: site.claim,
    publisher: { "@id": `${siteUrl}/#organization` },
    inLanguage: "en",
  };
}

export function servicesJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    numberOfItems: services.length,
    itemListElement: services.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Service",
        name: s.title,
        description: s.summary,
        serviceType: s.title,
        url: `${siteUrl}/services#${s.slug}`,
        provider: { "@id": `${siteUrl}/#organization` },
        areaServed: "Worldwide",
      },
    })),
  };
}

export function breadcrumbJsonLd(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: `${siteUrl}${t.path}`,
    })),
  };
}

export function faqJsonLd(items: readonly { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
