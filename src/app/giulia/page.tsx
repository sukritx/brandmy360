import type { Metadata } from "next";

import { Footer } from "@/components/sites/brandmylaptop-com-284b5fbe/shared/Footer";
import { MobileAdBar } from "@/components/sites/brandmylaptop-com-284b5fbe/shared/MobileAdBar";
import { Nav } from "@/components/sites/brandmylaptop-com-284b5fbe/shared/Nav";
import { SponsorRail } from "@/components/sites/brandmylaptop-com-284b5fbe/shared/SponsorRail";
import { ListingHero } from "@/components/sites/brandmylaptop-com-284b5fbe/giulia-96b78fb0/ListingHero";
import { ListingDetails } from "@/components/sites/brandmylaptop-com-284b5fbe/giulia-96b78fb0/ListingDetails";
import { ListingSpots } from "@/components/sites/brandmylaptop-com-284b5fbe/giulia-96b78fb0/ListingSpots";
import { OtherLaptops } from "@/components/sites/brandmylaptop-com-284b5fbe/giulia-96b78fb0/OtherLaptops";

export const metadata: Metadata = {
  title: "Ad space on Giulia's 16″ MacBook — listing closed",
  description:
    "4,817 views on this lid. Fourteen brands have taken spots on Giulia's 16″ MacBook — the listing has closed.",
};

export default function GiuliaListingPage() {
  return (
    <>
      <Nav />
      <SponsorRail side="left" />
      <SponsorRail side="right" />
      <MobileAdBar />
      <main>
        <ListingHero />
        <ListingDetails />
        <ListingSpots />
        <OtherLaptops />
      </main>
      <Footer />
    </>
  );
}
