import type { Metadata } from "next";
import Link from "next/link";

import { BrandsCtas } from "@/components/sites/brandmylaptop-com-284b5fbe/brands-b0addea9/BrandsCtas";
import { BrandsHero } from "@/components/sites/brandmylaptop-com-284b5fbe/brands-b0addea9/BrandsHero";
import { BrandsList } from "@/components/sites/brandmylaptop-com-284b5fbe/brands-b0addea9/BrandsList";
import { BrandsNewsletter } from "@/components/sites/brandmylaptop-com-284b5fbe/brands-b0addea9/BrandsNewsletter";
import { BrandsStats } from "@/components/sites/brandmylaptop-com-284b5fbe/brands-b0addea9/BrandsStats";
import { HowItCompares } from "@/components/sites/brandmylaptop-com-284b5fbe/brands-b0addea9/HowItCompares";
import { LogoWall } from "@/components/sites/brandmylaptop-com-284b5fbe/brands-b0addea9/LogoWall";
import { WhatASpot } from "@/components/sites/brandmylaptop-com-284b5fbe/brands-b0addea9/WhatASpot";
import { CurrencyProvider } from "@/components/sites/brandmylaptop-com-284b5fbe/shared/CurrencyProvider";
import { Footer } from "@/components/sites/brandmylaptop-com-284b5fbe/shared/Footer";
import { Nav } from "@/components/sites/brandmylaptop-com-284b5fbe/shared/Nav";
import { SponsorRail } from "@/components/sites/brandmylaptop-com-284b5fbe/shared/SponsorRail";
import { MobileAdBar } from "@/components/sites/brandmylaptop-com-284b5fbe/shared/MobileAdBar";

export const metadata: Metadata = {
  title: "Advertise on creators' laptops — BrandMyLaptop",
  description:
    "Get your logo on creators' laptops: buy a sticker spot and go everywhere they go. See the companies already doing it, and what they paid.",
};

const BROWSE_BY = [
  { href: "/laptops/developers", label: "Developers" },
  { href: "/laptops/indie-hackers-and-founders", label: "Indie hackers and founders" },
  { href: "/laptops/designers", label: "Designers" },
  { href: "/laptops/content-creators", label: "Content creators" },
  { href: "/laptops/marketers", label: "Marketers" },
  { href: "/laptops/freelancers", label: "Freelancers" },
  { href: "/laptops/students", label: "Students" },
  { href: "/laptops/teachers-and-researchers", label: "Teachers and researchers" },
  { href: "/laptops/finance-people", label: "Finance people" },
  { href: "/laptops/gamers", label: "Gamers" },
  { href: "/laptops/all-sorts-of-people", label: "All sorts of people" },
];

export default function BrandsPage() {
  return (
    <CurrencyProvider>
      <Nav />
      <SponsorRail side="left" />
      <SponsorRail side="right" />
      <MobileAdBar />
      <main className="mx-auto max-w-5xl px-6 pb-24 pt-14">
        <BrandsHero />
        <BrandsCtas />
        <BrandsStats />
        <p className="mt-4 text-[14px] text-ink-2">
          Those are asking prices.{" "}
          <Link className="text-blue hover:underline" href="/stats">
            See what spots have actually sold for →
          </Link>
        </p>
        <LogoWall />
        <HowItCompares />
        <section className="mt-12">
          <h2 className="text-[15px] font-medium">Browse by who carries it</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {BROWSE_BY.map((chip) => (
              <li key={chip.href}>
                <Link
                  className="block rounded-full border border-hairline bg-white px-4 py-2 text-[14px] transition-colors hover:border-ink/30"
                  href={chip.href}
                >
                  {chip.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <WhatASpot />
        <BrandsNewsletter />
        <BrandsList />
      </main>
      <Footer />
    </CurrencyProvider>
  );
}
