import Link from "next/link";

import { Money } from "@/components/sites/brandmylaptop-com-284b5fbe/shared/CurrencyProvider";

const BRANDS: {
  name: string;
  meta: string;
  amount: number | null;
  href: string;
  logo: string | null;
}[] = [
  { name: "Granola", meta: "1 spot", amount: 983, href: "/brand/granola.ai", logo: "/sites/brandmylaptop-com-284b5fbe/shared/logos/cf8fc1a6-acfa-4c3d-805d-06533140623c.png" },
  { name: "Gi Studio NYC", meta: "1 spot", amount: 872, href: "/brand/christiegi.com", logo: "/sites/brandmylaptop-com-284b5fbe/shared/logos/3f786696-2fd3-4181-98ed-5c6586022032.png" },
  { name: "FullEnrich", meta: "1 spot", amount: 786, href: "/brand/fullenrich.com", logo: "/sites/brandmylaptop-com-284b5fbe/shared/logos/8adae3f5-1420-4f0c-b12d-2234e4fce49b.png" },
  { name: "Palette", meta: "1 spot", amount: 786, href: "/brand/palette.team", logo: "/sites/brandmylaptop-com-284b5fbe/shared/logos/7f3df47c-221f-4b41-8f38-eba558b71dad.svg" },
  { name: "Modash", meta: "1 spot", amount: 696, href: "/brand/modash.io", logo: "/sites/brandmylaptop-com-284b5fbe/shared/logos/feb5e89e-8af4-4b03-b078-d9e8660a0159.png" },
  { name: "Creator Match", meta: "1 spot", amount: 696, href: "/brand/creatormatch.com", logo: "/sites/brandmylaptop-com-284b5fbe/shared/logos/d5f02bb0-fd6b-4776-b02f-467b277289be.png" },
  { name: "Wildcall", meta: "1 spot", amount: 592, href: "/brand/wildcall.gg", logo: "/sites/brandmylaptop-com-284b5fbe/shared/logos/42de2470-210b-43f4-9618-2576be96bffc.png" },
  { name: "Conveo", meta: "1 spot", amount: 491, href: "/brand/conveo.ai", logo: "/sites/brandmylaptop-com-284b5fbe/shared/logos/9b1a1df8-3a81-403c-81d7-a5bdfe32902a.png" },
  { name: "Slice", meta: "1 spot", amount: 439, href: "/brand/slice-social.com", logo: "/sites/brandmylaptop-com-284b5fbe/shared/logos/aa7232ad-8449-406a-80c2-1af094654d20.png" },
  { name: "Botpool", meta: "3 spots", amount: 427, href: "/brand/botpool.ai", logo: "/sites/brandmylaptop-com-284b5fbe/shared/logos/a12c9d59-9d2c-4609-b171-f36d8b54fc5d.png" },
  { name: "Surf Office", meta: "1 spot", amount: 393, href: "/brand/surfoffice.com", logo: "/sites/brandmylaptop-com-284b5fbe/shared/logos/126313b4-203b-4fb8-ab58-cfb7a847672b.png" },
  { name: "Lorikeet", meta: "1 spot", amount: 393, href: "/brand/lorikeetcx.ai", logo: "/sites/brandmylaptop-com-284b5fbe/shared/logos/9e79522c-71d1-462c-9bea-43b05c7cea0b.png" },
  { name: "orientino", meta: "1 spot", amount: 363, href: "/brand/orientino.ch", logo: "/sites/brandmylaptop-com-284b5fbe/shared/logos/97623714-0ff7-4d3a-9cea-6e4717acd03c.png" },
  { name: "Love, your business Mom", meta: "1 spot", amount: 345, href: "/brand/yourbusiness.mom", logo: "/sites/brandmylaptop-com-284b5fbe/shared/logos/8fbe7e42-5fc6-4e1c-8107-c23d7050a857.png" },
  { name: "Social Listening Lounge", meta: "1 spot", amount: 345, href: "/brand/thedatazone.ai", logo: "/sites/brandmylaptop-com-284b5fbe/shared/logos/077b5164-d846-44d4-81f0-68779e317868.png" },
  { name: "Creatorbuzz", meta: "1 spot", amount: 295, href: "/brand/creatorbuzz.com", logo: "/sites/brandmylaptop-com-284b5fbe/shared/logos/eb39d9eb-cfcf-475f-aad6-2c7c4f2abe50.png" },
  { name: "Go Nimbly", meta: "1 spot", amount: 295, href: "/brand/gonimbly.com", logo: "/sites/brandmylaptop-com-284b5fbe/shared/logos/ef8224ec-6cc5-4ae8-bd18-f0155ff53d68.png" },
  { name: "Sixtyfive Group", meta: "1 spot", amount: 263, href: "/brand/sixtyfive.group", logo: "/sites/brandmylaptop-com-284b5fbe/shared/logos/22cb75ea-d31d-4128-af8b-5e2f856d21f7.jpg" },
  { name: "Well Seasoned", meta: "1 spot", amount: 263, href: "/brand/wellseasoned.work", logo: "/sites/brandmylaptop-com-284b5fbe/shared/logos/86f916d3-062b-4e5b-991d-093878d810f8.png" },
  { name: "Pushup RPG", meta: "2 spots", amount: 257, href: "/brand/pushup.quest", logo: "/sites/brandmylaptop-com-284b5fbe/shared/logos/391d41f1-7a71-4d18-ab1b-ebf8f87698be.png" },
  { name: "Sales Creator Collective", meta: "1 spot", amount: 246, href: "/brand/salescreatorcollective.com", logo: "/sites/brandmylaptop-com-284b5fbe/shared/logos/9f2df6de-5fd8-4549-8f15-37e0a7aa2137.png" },
  { name: "Afes", meta: "1 spot", amount: 246, href: "/brand/afesdigital.com", logo: "/sites/brandmylaptop-com-284b5fbe/shared/logos/5e09b6c6-6ebb-4dc4-8fb2-0767fc1fabf3.png" },
  { name: "Chapter", meta: "1 spot", amount: 240, href: "/brand/thisischapter.co.uk", logo: "/sites/brandmylaptop-com-284b5fbe/shared/logos/3f6e1eaa-52ef-4f0c-9d58-268d127227ab.png" },
  { name: "SocialDay", meta: "1 spot", amount: 240, href: "/brand/socialday.live", logo: "/sites/brandmylaptop-com-284b5fbe/shared/logos/e97da65d-931a-49e8-9af9-6e56d2515042.png" },
  { name: "Dial A Geek", meta: "2 spots", amount: 234, href: "/brand/dialageek.co.uk", logo: "/sites/brandmylaptop-com-284b5fbe/shared/logos/d225692b-1f40-4d75-b020-ab571681ced0.png" },
  { name: "Your Social Media Sherpa", meta: "1 spot", amount: 205, href: "/brand/yoursocialmediasherpa.com", logo: "/sites/brandmylaptop-com-284b5fbe/shared/logos/5d69104f-fc8f-4aed-b640-2c17290ed15b.png" },
  { name: "Great Outdoors Foundatio", meta: "1 spot", amount: 205, href: "/brand/greatoutdoorsfoundation.org", logo: "/sites/brandmylaptop-com-284b5fbe/shared/logos/1d313335-0d8a-4448-badd-b051d1628045.png" },
  { name: "Emme", meta: "1 spot", amount: 170, href: "/brand/emme.com", logo: "/sites/brandmylaptop-com-284b5fbe/shared/logos/c2743c16-e062-401b-a5ba-455a91730cf8.png" },
  { name: "Conscious Marketing Movement", meta: "1 spot", amount: 158, href: "/brand/conscious-marketing-movement.com", logo: "/sites/brandmylaptop-com-284b5fbe/shared/logos/0ef4f13c-abce-4c73-be83-e8a8bf10ae64.png" },
  { name: "myMind", meta: "1 spot", amount: 146, href: "/brand/mymind.com", logo: "/sites/brandmylaptop-com-284b5fbe/shared/logos/cdf4519e-732b-4715-8bff-b1ae401efd75.png" },
];

export function BrandsBought() {
  return (
    <section className="mt-6 rounded-3xl bg-surface p-6 sm:p-10">
      <h2 className="text-[clamp(1.4rem,3vw,2rem)] font-medium tracking-[-0.025em]">
        The 40 brands that have bought
      </h2>
      <p className="mt-3 text-[15px] text-ink-2">What each has spent to be on somebody’s laptop.</p>
      <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {BRANDS.map((row) => (
          <li key={row.name}>
            <Link
              className="flex items-center gap-3 rounded-2xl border border-hairline bg-white p-4 transition-shadow hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]"
              href={row.href}
            >
              {row.logo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={row.logo} alt="" loading="lazy" className="h-8 w-8 shrink-0 object-contain" />
              )}
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[14px] font-medium">{row.name}</span>
                <span className="block text-[12px] text-ink-2">{row.meta}</span>
              </span>
              {row.amount !== null && (
                <span className="shrink-0 text-[14px] font-semibold tabular-nums text-green">
                  <Money usd={row.amount} className="tabular-nums" />
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-[13px] text-ink-2">
        <Link className="text-blue hover:underline" href="/brands">
          Every brand, filterable by date and spend →
        </Link>
      </p>
    </section>
  );
}
