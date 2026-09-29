import type { Metadata } from "next";

import { BrandsBought } from "@/components/sites/brandmylaptop-com-284b5fbe/stats-d8625d36/BrandsBought";
import { BrowseBy } from "@/components/sites/brandmylaptop-com-284b5fbe/stats-d8625d36/BrowseBy";
import { FollowingChart } from "@/components/sites/brandmylaptop-com-284b5fbe/stats-d8625d36/FollowingChart";
import { PaidChart } from "@/components/sites/brandmylaptop-com-284b5fbe/stats-d8625d36/PaidChart";
import { PriceBreakdown } from "@/components/sites/brandmylaptop-com-284b5fbe/stats-d8625d36/PriceBreakdown";
import { StatCards } from "@/components/sites/brandmylaptop-com-284b5fbe/stats-d8625d36/StatCards";
import { StatsConclusion } from "@/components/sites/brandmylaptop-com-284b5fbe/stats-d8625d36/StatsConclusion";
import { StatsGridSlice } from "@/components/sites/brandmylaptop-com-284b5fbe/stats-d8625d36/StatsGridSlice";
import { StatsHero } from "@/components/sites/brandmylaptop-com-284b5fbe/stats-d8625d36/StatsHero";
import { TheBoard } from "@/components/sites/brandmylaptop-com-284b5fbe/stats-d8625d36/TheBoard";
import { CurrencyProvider } from "@/components/sites/brandmylaptop-com-284b5fbe/shared/CurrencyProvider";
import { Footer } from "@/components/sites/brandmylaptop-com-284b5fbe/shared/Footer";
import { Nav } from "@/components/sites/brandmylaptop-com-284b5fbe/shared/Nav";
import { SponsorRail } from "@/components/sites/brandmylaptop-com-284b5fbe/shared/SponsorRail";
import { MobileAdBar } from "@/components/sites/brandmylaptop-com-284b5fbe/shared/MobileAdBar";

export const metadata: Metadata = {
  title: "Stats: what brands pay for laptop ad space — BrandMyLaptop",
  description:
    "11\u202f790\u00a0€ paid to creators across 44 sticker spots, 40 brands buying, 166 laptops taking brands today, 11.9M combined following.",
};

export default function StatsPage() {
  return (
    <CurrencyProvider>
      <Nav />
      <SponsorRail side="left" />
      <SponsorRail side="right" />
      <MobileAdBar />
      <main className="mx-auto max-w-5xl px-6 pb-24 pt-14">
        <StatsHero />
        <StatCards />
        <PaidChart />
        <TheBoard />
        <FollowingChart />
        <BrandsBought />
        <PriceBreakdown />
        <StatsConclusion />
        <BrowseBy />
        <StatsGridSlice />
      </main>
      <Footer />
    </CurrencyProvider>
  );
}
