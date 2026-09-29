import type { Metadata } from "next";
import { Footer } from "@/components/sites/brandmylaptop-com-284b5fbe/shared/Footer";
import { Nav } from "@/components/sites/brandmylaptop-com-284b5fbe/shared/Nav";
import { SponsorRail } from "@/components/sites/brandmylaptop-com-284b5fbe/shared/SponsorRail";
import { MobileAdBar } from "@/components/sites/brandmylaptop-com-284b5fbe/shared/MobileAdBar";
import { CurrencyProvider } from "@/components/sites/brandmylaptop-com-284b5fbe/shared/CurrencyProvider";
import { HeroSection } from "@/components/sites/brandmylaptop-com-284b5fbe/root-7280be29/HeroSection";
import { FeaturedCarousel } from "@/components/sites/brandmylaptop-com-284b5fbe/root-7280be29/FeaturedCarousel";
import { LaptopsGrid } from "@/components/sites/brandmylaptop-com-284b5fbe/root-7280be29/LaptopsGrid";
import { JustSold } from "@/components/sites/brandmylaptop-com-284b5fbe/root-7280be29/JustSold";
import { NewsletterCard } from "@/components/sites/brandmylaptop-com-284b5fbe/root-7280be29/NewsletterCard";
import { DarkCta } from "@/components/sites/brandmylaptop-com-284b5fbe/root-7280be29/DarkCta";
import { BrandedShowcase } from "@/components/sites/brandmylaptop-com-284b5fbe/root-7280be29/BrandedShowcase";
import { HowItWorks } from "@/components/sites/brandmylaptop-com-284b5fbe/root-7280be29/HowItWorks";
import { Faq } from "@/components/sites/brandmylaptop-com-284b5fbe/root-7280be29/Faq";

export const metadata: Metadata = {
  title: "BrandMyLaptop — the marketplace for ads on laptops",
  description:
    "Creators sell the sticker spots on their laptop lid. Brands buy them. $13,794 of ad space sold across 166 laptops.",
};

export default function HomePage() {
  return (
    <CurrencyProvider>
      <Nav />
      <SponsorRail side="left" />
      <SponsorRail side="right" />
      <MobileAdBar />
      <div className="min-h-screen">
        <main>
          <HeroSection />
          <FeaturedCarousel />
          <LaptopsGrid />
          <JustSold />
          <NewsletterCard />
          <DarkCta />
          <BrandedShowcase />
          <HowItWorks />
          <Faq />
        </main>
        <Footer />
      </div>
    </CurrencyProvider>
  );
}
