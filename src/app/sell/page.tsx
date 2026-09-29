import type { Metadata } from "next";
import Link from "next/link";

import { SellWizard } from "@/components/sites/brandmylaptop-com-284b5fbe/sell-826541f7/SellWizard";
import { CurrencyProvider } from "@/components/sites/brandmylaptop-com-284b5fbe/shared/CurrencyProvider";
import { Footer } from "@/components/sites/brandmylaptop-com-284b5fbe/shared/Footer";

export const metadata: Metadata = {
  title: "Sell the spots on your laptop lid — BrandMyLaptop",
  description:
    "Set the machine, the layout and the prices, and brands buy sticker spots on your lid. Buyers pay you directly; the platform runs the listing and takes 10%.",
};

const LAPTOP_LOGO = "/sites/brandmylaptop-com-284b5fbe/shared/media/logo-small.1zmf4nfgeac61.png";

export default function SellPage() {
  return (
    <CurrencyProvider>
      <header className="border-b border-hairline/40">
        <div className="mx-auto flex max-w-5xl items-center justify-center px-6 py-4">
          <Link className="flex items-center gap-2.5 text-[15px] font-semibold tracking-[-0.01em]" href="/">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LAPTOP_LOGO} alt="" width={256} height={171} className="h-7 w-auto" />
            BrandMyLaptop
          </Link>
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-6 md:py-16">
        <SellWizard />
      </div>
      <Footer />
    </CurrencyProvider>
  );
}
