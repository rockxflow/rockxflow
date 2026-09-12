import type { Metadata } from "next";
import { HeroSection } from "@/components/sections/HeroSection";
import { CapabilityBand } from "@/components/sections/CapabilityBand";
import { ProblemSection } from "@/components/sections/ProblemSection";
import { SystemSection } from "@/components/sections/SystemSection";
import { PillarsSection } from "@/components/sections/PillarsSection";
import { ServicesPreviewSection } from "@/components/sections/ServicesPreviewSection";
import { SignatureWorkflow } from "@/components/sections/SignatureWorkflow";
import { AutomationSelector } from "@/components/sections/AutomationSelector";
import { OutcomesSection } from "@/components/sections/OutcomesSection";
import { IndustriesSection } from "@/components/sections/IndustriesSection";
import { ProcessPreview } from "@/components/sections/ProcessSection";
import { TrustSection } from "@/components/sections/TrustSection";
import { FinalCta } from "@/components/sections/FinalCta";
import { buildMetadata, siteUrl } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  ...buildMetadata({
    title: `${site.name} — AI Automation Agency | ${site.claim}`,
    description:
      "Rockxflow is an AI automation agency building AI workflow automation, AI agents, chatbots, voice AI, WhatsApp and CRM automation for businesses. Turn repetitive work into intelligent systems.",
    path: "",
  }),
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <link rel="preload" as="image" href="/media/rockxflow-hero-poster.webp" fetchPriority="high" />
      <HeroSection />
      <CapabilityBand />
      <ProblemSection />
      <SystemSection />
      <PillarsSection />
      <ServicesPreviewSection />
      <SignatureWorkflow />
      <AutomationSelector />
      <OutcomesSection />
      <IndustriesSection />
      <ProcessPreview />
      <TrustSection />
      <FinalCta />
    </>
  );
}
