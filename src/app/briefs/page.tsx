import type { Metadata } from "next";
import Link from "next/link";

import { BriefForm } from "@/components/sites/brandmylaptop-com-284b5fbe/briefs-dc03d02e/BriefForm";
import {
  CurrencyProvider,
  Money,
} from "@/components/sites/brandmylaptop-com-284b5fbe/shared/CurrencyProvider";
import { Footer } from "@/components/sites/brandmylaptop-com-284b5fbe/shared/Footer";
import { Nav } from "@/components/sites/brandmylaptop-com-284b5fbe/shared/Nav";
import { SponsorRail } from "@/components/sites/brandmylaptop-com-284b5fbe/shared/SponsorRail";
import { MobileAdBar } from "@/components/sites/brandmylaptop-com-284b5fbe/shared/MobileAdBar";

export const metadata: Metadata = {
  title: "Briefs — brands looking for laptops · BrandMyLaptop",
  description:
    "Say who should carry your logo and what you pay per spot. Creators apply with their laptop; you pay each one directly, only if you say yes.",
};

export default function BriefsPage() {
  return (
    <CurrencyProvider>
      <Nav />
      <SponsorRail side="left" />
      <SponsorRail side="right" />
      <MobileAdBar />
      <main className="mx-auto max-w-3xl px-6 pb-24 pt-14">
        <p className="text-[13px] text-ink-2">
          <Link className="hover:text-ink" href="/">
            BrandMyLaptop
          </Link>{" "}
          / Briefs
        </p>
        <h1 className="mt-4 text-[clamp(1.8rem,4.5vw,3rem)] font-medium leading-[1.05] tracking-[-0.035em]">
          Let creators advertise for you.
        </h1>
        <p className="mt-4 max-w-[62ch] text-[16px] leading-relaxed text-ink-2">
          Name the audience you’re looking for and your budget. Creators who fit can apply directly
          — you review them. Free, no account.
        </p>
        <p className="mt-2 max-w-[62ch] text-[14px] leading-relaxed text-ink-2">
          Rather not post it publicly, or want us to assemble it for you?{" "}
          <Link className="font-medium text-blue hover:underline" href="/campaign" prefetch={false}>
            Send it privately
          </Link>{" "}
          and the shortlist comes back by mail.
        </p>
        <h2 className="mt-12 text-[22px] font-semibold tracking-[-0.02em]">1 open brief</h2>
        <ul className="mt-4 space-y-3">
          <li className="rounded-2xl border border-hairline bg-white px-5 py-4">
            <div className="flex items-start gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt=""
                className="h-9 w-9 shrink-0 object-contain"
                loading="lazy"
                src="https://rihdbhaulfvzfhbafmax.supabase.co/storage/v1/object/public/logos/f8ac6257-3406-4009-8a67-effb110b0fe0/391d41f1-7a71-4d18-ab1b-ebf8f87698be.png"
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <p className="text-[15px] font-medium">
                    <Link className="hover:underline" href="/brand/pushup.quest" prefetch={false}>
                      Pushup RPG
                    </Link>
                  </p>
                  <p className="text-[13px] text-ink-2">
                    up to{" "}
                    <strong className="font-medium text-ink">
                      <Money className="tabular-nums" usd={29} />
                    </strong>{" "}
                    a spot · 6 applied
                  </p>
                </div>
                <p className="mt-1 text-[13px] text-ink-2">Gamer</p>
              </div>
            </div>
          </li>
        </ul>
        <h2 className="mt-14 text-[22px] font-semibold tracking-[-0.02em]">Post your own</h2>
        <BriefForm />
      </main>
      <Footer />
    </CurrencyProvider>
  );
}
