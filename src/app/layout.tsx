import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { IntroLoader } from "@/components/layout/IntroLoader";
import { Cursor } from "@/components/layout/Cursor";
import { AnalyticsBridge } from "@/components/layout/AnalyticsBridge";
import { ExternalLinkBridge } from "@/components/layout/ExternalLinkBridge";
import { PageTransition } from "@/components/layout/PageTransition";
import { BrandDefs } from "@/components/ui/Logo";
import { buildMetadata, organizationJsonLd, siteUrl, websiteJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  ...buildMetadata({
    title: `${site.name} — ${site.category}`,
    description: `${site.claim} ${site.intro}`,
    keywords: [
      "AI Automation Agency",
      "AI Workflow Automation",
      "AI Agents",
      "AI Chatbots",
      "AI Voice Agents",
      "WhatsApp Automation",
      "CRM Automation",
      "Business Automation",
      "AI Integrations",
      "AI Business Solutions",
    ],
  }),
  applicationName: site.name,
  authors: [{ name: site.name }],
  creator: site.name,
  publisher: site.name,
  formatDetection: { telephone: false, email: false, address: false },
  category: "technology",
  icons: {
    icon: [
      { url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/favicon-180.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/icons/favicon-32.png",
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F7F9FC" },
    { media: "(prefers-color-scheme: dark)", color: "#030509" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <link rel="preload" href="/fonts/plus-jakarta-sans-latin-var.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/inter-latin-var.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body className="min-h-dvh antialiased">
        {/* Shared SVG gradients for the logo mark — defined once, referenced by every instance. */}
        <BrandDefs />
        <IntroLoader />
        <Cursor />
        <Navbar />
        <main id="main" tabIndex={-1} className="relative">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
        <AnalyticsBridge />
        {/* external links must open on a plain click even inside a popup-blocking embed */}
        <ExternalLinkBridge />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([organizationJsonLd(), websiteJsonLd()]) }}
        />
      </body>
    </html>
  );
}
