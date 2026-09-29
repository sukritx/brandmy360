import { Money } from "../shared/CurrencyProvider";
import { LidPreview } from "../shared/LidPreview";
import type { Lid } from "../shared/data";

const OG_BASE = "/sites/brandmylaptop-com-284b5fbe/shared/og/";
const LOGO_BASE = "/sites/brandmylaptop-com-284b5fbe/shared/logos/";
const AVATAR_BASE = "/sites/brandmylaptop-com-284b5fbe/shared/avatars/";

const LID_BG =
  "aspect-ratio: 1.44 / 1; background: linear-gradient(172deg, rgb(236, 236, 237) 0%, rgb(220, 220, 223) 45%, rgb(200, 200, 205) 100%); box-shadow: rgba(255, 255, 255, 0.9) 0px 1px 0px inset, rgba(0, 0, 0, 0.18) 0px -1px 0px inset, rgba(0, 0, 0, 0.28) 0px 30px 60px -18px, rgba(0, 0, 0, 0.18) 0px 12px 24px -12px;";

const WIDE = "max-height: 56%; max-width: 88%;";
const NARROW = "max-height: 34%; max-width: 52%;";

type ShowcaseItem = {
  href: string;
  external: boolean;
  handle: string;
  avatar: string;
  usd: number;
  lid: Lid;
};

const SHOWCASE: ShowcaseItem[] = [
  {
    href: "https://brandmymac.com",
    external: true,
    handle: "@vynsedev",
    avatar: "/sites/brandmylaptop-com-284b5fbe/shared/media/vincent.webp",
    usd: 9690,
    lid: {
      lidStyle: null,
      lidBg: LID_BG,
      slots: [
        { area: "1 / 1 / auto / span 2", img: `${OG_BASE}macpaw.png`, imgStyle: WIDE, label: null },
        { area: "1 / 3 / auto / span 2", img: `${OG_BASE}see-io.png`, imgStyle: WIDE, label: null },
        { area: "1 / 5 / auto / span 2", img: `${OG_BASE}privatealps.png`, imgStyle: NARROW, label: "PrivateAlps" },
        { area: "2 / 1 / auto / span 1", img: `${OG_BASE}draftline-fantasy.png`, imgStyle: NARROW, label: "Draftline Fantasy" },
        { area: "2 / 2 / auto / span 1", img: `${OG_BASE}surf-office.png`, imgStyle: WIDE, label: null },
        { area: "2 / 5 / auto / span 1", img: `${OG_BASE}servicepro.svg`, imgStyle: NARROW, label: "ServicePro.co" },
        { area: "2 / 6 / auto / span 1", img: `${OG_BASE}moyai.png`, imgStyle: NARROW, label: "Moyai" },
        { area: "3 / 1 / auto / span 2", img: "/sites/brandmylaptop-com-284b5fbe/shared/og/emma-pet.png", imgStyle: WIDE, label: null },
        { area: "3 / 3 / auto / span 2", img: `${OG_BASE}felyn-go.png`, imgStyle: WIDE, label: null },
        { area: "3 / 5 / auto / span 2", img: `${OG_BASE}nero.svg`, imgStyle: WIDE, label: null },
      ],
    },
  },
  {
    href: "/giulia",
    external: false,
    handle: "@giutheginger",
    avatar: `${AVATAR_BASE}9d4978f7-2dd4-482b-ab44-40888685c319.jpg`,
    usd: 4914,
    lid: {
      lidStyle: null,
      lidBg: LID_BG,
      slots: [
        { area: "1 / 1 / auto / span 2", img: `${LOGO_BASE}8adae3f5-1420-4f0c-b12d-2234e4fce49b.png`, imgStyle: WIDE, label: null },
        { area: "1 / 3 / auto / span 2", img: `${LOGO_BASE}cf8fc1a6-acfa-4c3d-805d-06533140623c.png`, imgStyle: WIDE, label: null },
        { area: "1 / 5 / auto / span 2", img: `${LOGO_BASE}7f3df47c-221f-4b41-8f38-eba558b71dad.svg`, imgStyle: WIDE, label: null },
        { area: "2 / 1 / auto / span 1", img: `${LOGO_BASE}5e09b6c6-6ebb-4dc4-8fb2-0767fc1fabf3.png`, imgStyle: WIDE, label: null },
        { area: "2 / 2 / auto / span 1", img: `${LOGO_BASE}eb39d9eb-cfcf-475f-aad6-2c7c4f2abe50.png`, imgStyle: NARROW, label: "Creatorbuzz" },
        { area: "2 / 5 / auto / span 1", img: `${LOGO_BASE}ef8224ec-6cc5-4ae8-bd18-f0155ff53d68.png`, imgStyle: WIDE, label: null },
        { area: "2 / 6 / auto / span 1", img: `${LOGO_BASE}9f2df6de-5fd8-4549-8f15-37e0a7aa2137.png`, imgStyle: WIDE, label: null },
        { area: "3 / 1 / auto / span 2", img: `${LOGO_BASE}9e79522c-71d1-462c-9bea-43b05c7cea0b.png`, imgStyle: WIDE, label: null },
        { area: "3 / 3 / auto / span 2", img: `${LOGO_BASE}9b1a1df8-3a81-403c-81d7-a5bdfe32902a.png`, imgStyle: WIDE, label: null },
        { area: "3 / 5 / auto / span 2", img: `${LOGO_BASE}126313b4-203b-4fb8-ab58-cfb7a847672b.png`, imgStyle: WIDE, label: null },
      ],
    },
  },
  {
    href: "/anniemaihodge",
    external: false,
    handle: "@anniemaisocial",
    avatar: `${AVATAR_BASE}ca932926-d4c0-45ba-a854-b9bed9e775e9.jpg`,
    usd: 4282,
    lid: {
      lidStyle: null,
      lidBg: LID_BG,
      slots: [
        { area: "1 / 1 / auto / span 2", img: `${LOGO_BASE}d5f02bb0-fd6b-4776-b02f-467b277289be.png`, imgStyle: WIDE, label: null },
        { area: "1 / 3 / auto / span 2", img: `${LOGO_BASE}3f786696-2fd3-4181-98ed-5c6586022032.png`, imgStyle: WIDE, label: null },
        { area: "1 / 5 / auto / span 2", img: `${LOGO_BASE}feb5e89e-8af4-4b03-b078-d9e8660a0159.png`, imgStyle: WIDE, label: null },
        { area: "2 / 1 / auto / span 1", img: `${LOGO_BASE}1d313335-0d8a-4448-badd-b051d1628045.png`, imgStyle: WIDE, label: null },
        { area: "2 / 2 / auto / span 1", img: `${LOGO_BASE}e97da65d-931a-49e8-9af9-6e56d2515042.png`, imgStyle: WIDE, label: null },
        { area: "2 / 5 / auto / span 1", img: `${LOGO_BASE}3f6e1eaa-52ef-4f0c-9d58-268d127227ab.png`, imgStyle: WIDE, label: null },
        { area: "2 / 6 / auto / span 1", img: `${LOGO_BASE}5d69104f-fc8f-4aed-b640-2c17290ed15b.png`, imgStyle: WIDE, label: null },
        { area: "3 / 1 / auto / span 2", img: `${LOGO_BASE}8fbe7e42-5fc6-4e1c-8107-c23d7050a857.png`, imgStyle: WIDE, label: null },
        { area: "3 / 3 / auto / span 2", img: `${LOGO_BASE}aa7232ad-8449-406a-80c2-1af094654d20.png`, imgStyle: WIDE, label: null },
        { area: "3 / 5 / auto / span 2", img: `${LOGO_BASE}077b5164-d846-44d4-81f0-68779e317868.png`, imgStyle: WIDE, label: null },
      ],
    },
  },
];

export function BrandedShowcase() {
  return (
    <section
      className="mx-auto max-w-5xl scroll-mt-20 px-6 py-16 md:py-20"
      aria-labelledby="fully-branded"
    >
      <h2
        id="fully-branded"
        className="text-center text-3xl font-semibold tracking-[-0.015em] md:text-4xl"
      >
        Laptops fully branded.
      </h2>
      <p className="mx-auto mt-3 max-w-[52ch] text-center text-ink-2">
        <strong className="font-medium text-ink">
          <Money usd={18886} />
        </strong>{" "}
        of ad space bought by brands, across 3 laptops.
      </p>
      <ul className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2">
        {SHOWCASE.map((item) => (
          <li key={item.href} className="min-w-0">
            <a
              {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="group relative block"
              href={item.href}
            >
              <span className="relative block aspect-[1.44] w-full">
                <LidPreview lid={item.lid} variant="light" />
              </span>
              <span className="absolute left-1/2 top-0 z-10 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full border border-hairline bg-white py-1.5 pl-1.5 pr-1 shadow-[0_2px_10px_rgba(0,0,0,0.10)] transition-shadow group-hover:shadow-[0_4px_16px_rgba(0,0,0,0.16)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt=""
                  loading="lazy"
                  className="h-6 w-6 shrink-0 rounded-full object-cover"
                  src={item.avatar}
                />
                <span className="max-w-[9rem] truncate text-[13px] font-medium group-hover:underline">
                  {item.handle}
                </span>
                <Money
                  usd={item.usd}
                  className="rounded-full bg-green/10 px-2.5 py-1 text-[13px] font-semibold tabular-nums text-green"
                />
              </span>
            </a>
          </li>
        ))}
      </ul>
      <div className="mt-12 text-center">
        <a
          className="inline-block rounded-full bg-blue px-6 py-3 text-[15px] font-medium text-white transition-colors hover:bg-blue-hover"
          href="/sell"
        >
          Put your laptop up
        </a>
      </div>
    </section>
  );
}
