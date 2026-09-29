import Link from "next/link";

import {
  InstagramIcon,
  LinkedInIcon,
  XBlackIcon,
  XIcon,
} from "@/components/sites/brandmylaptop-com-284b5fbe/shared/icons";

import { listingAuthor } from "./data";

const SEEN_AT = [
  { label: "Build in public — posts and videos", href: "/laptops/creators-posting-in-public" },
  { label: "Coworking spaces and cafés", href: "/laptops/coworking-spaces-and-cafes" },
  { label: "Conferences and meetups", href: "/laptops/conferences-and-meetups" },
  { label: "Business travel", href: "/laptops/business-travel" },
  { label: "Client and investor meetings", href: "/laptops/client-and-investor-meetings" },
];

const SPOT_SIZES = [
  { spots: "4 spots", dims: "5.1 × 5.1 cm", price: "from 210\u00A0€" },
  { spots: "3 spots", dims: "10.8 × 4.6 cm", price: "from 336\u00A0€" },
  { spots: "3 spots", dims: "10.8 × 6.3 cm", price: "from 672\u00A0€" },
];

export function ListingDetails() {
  return (
    <section id="details" className="scroll-mt-20 py-16 md:py-20">
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="text-3xl font-semibold tracking-[-0.015em] md:text-4xl">The details.</h2>
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="min-w-0 rounded-2xl border border-hairline bg-white p-6">
            <h3 className="text-[15px] font-medium">Who you are buying from</h3>
            <div className="mt-4 flex items-start gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt=""
                className="h-12 w-12 shrink-0 rounded-full object-cover"
                src={listingAuthor.avatar}
              />
              <div className="min-w-0">
                <p className="truncate text-[15px] font-medium">{listingAuthor.name}</p>
                <p className="mt-0.5 truncate text-[13px] text-ink-2">
                  <a
                    href={listingAuthor.handleHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue hover:underline"
                  >
                    {listingAuthor.handle}
                  </a>{" "}
                  · <span className="tabular-nums">{listingAuthor.followers}</span> followers
                </p>
                <ul className="mt-2.5 flex flex-wrap items-center gap-1.5">
                  <li>
                    <a
                      href={listingAuthor.handleHref}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      title="Read from X"
                      className="inline-flex items-center gap-1.5 rounded-full border border-hairline py-1 pl-1.5 pr-2.5 text-[12px] transition-colors hover:border-ink/30"
                    >
                      <XBlackIcon aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                      <span className="tabular-nums">13k followers</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href={listingAuthor.socials[0].href}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      aria-label="LinkedIn"
                      title="LinkedIn"
                      className="inline-flex items-center gap-1.5 rounded-full border border-hairline py-1 pl-1.5 pr-2.5 text-[12px] transition-colors hover:border-ink/30"
                    >
                      <LinkedInIcon aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                      <span className="text-ink-2">LinkedIn</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href={listingAuthor.socials[1].href}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      aria-label="Instagram"
                      title="Instagram"
                      className="inline-flex items-center gap-1.5 rounded-full border border-hairline py-1 pl-1.5 pr-2.5 text-[12px] transition-colors hover:border-ink/30"
                    >
                      <InstagramIcon aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                      <span className="text-ink-2">Instagram</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <p className="mt-4 border-l-2 border-hairline pl-3 text-[14px] leading-relaxed">
              22K followers on LinkedIn and 20K on Instagram!
            </p>
            <ul className="mt-4 space-y-1.5">
              <li>
                <a
                  href="https://www.linkedin.com/in/giuliacamaargo/"
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="group flex items-center gap-2 text-[13px] text-blue"
                >
                  <LinkedInIcon aria-hidden="true" className="h-4 w-4 shrink-0" />
                  <span className="min-w-0 truncate font-medium group-hover:underline">
                    LinkedIn Content
                  </span>
                </a>
              </li>
            </ul>
            <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-surface px-2.5 py-1 text-[12px] font-medium">
              <XIcon aria-hidden="true" className="h-3 w-3 shrink-0" />
              Verified with X
            </p>
          </div>
          <div className="min-w-0 rounded-2xl border border-hairline bg-white p-6">
            <h3 className="text-[15px] font-medium">Where your brand gets seen</h3>
            <ul className="flex flex-wrap gap-1.5 mt-3">
              {SEEN_AT.map((item) => (
                <li key={item.href}>
                  <Link
                    className="block rounded-full bg-surface px-2.5 py-1 text-[12px] text-ink-2 transition-colors hover:bg-hairline/70 hover:text-ink"
                    href={item.href}
                    prefetch={false}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="min-w-0 rounded-2xl border border-hairline bg-white p-6">
            <h3 className="text-[15px] font-medium">What a spot gets you</h3>
            <dl className="mt-4 space-y-2.5 text-[14px]">
              {SPOT_SIZES.map((row) => (
                <div key={row.dims + row.price} className="flex justify-between gap-4">
                  <dt className="text-ink-2">{row.spots}</dt>
                  <dd className="text-right">
                    <span className="font-medium">{row.dims}</span>
                    <span className="ml-2 tabular-nums text-ink-2">{row.price}</span>
                  </dd>
                </div>
              ))}
              <div className="flex justify-between gap-4 border-t border-hairline pt-2.5">
                <dt className="text-ink-2">Stays on for</dt>
                <dd className="text-right font-medium">
                  24 months<span className="ml-1.5 font-normal text-ink-2">from purchase</span>
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-2">Listing closed</dt>
                <dd className="text-right font-medium">19 September 2026</dd>
              </div>
            </dl>
            <p className="mt-4 text-[12px] leading-relaxed text-ink-2">
              Printed as die-cut vinyl at the size shown, plus a listing on this page with a link to
              your site. The seller puts it on and photographs the lid once the machine has been
              bought and delivered.
            </p>
          </div>
          <div className="min-w-0 rounded-2xl border border-hairline bg-white p-6">
            <h3 className="text-[15px] font-medium">The machine</h3>
            <dl className="mt-4 space-y-2.5 text-[14px]">
              <div className="flex justify-between gap-4">
                <dt className="text-ink-2">Laptop</dt>
                <dd className="text-right font-medium">Mac · 16″ lid</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="shrink-0 text-ink-2">Model</dt>
                <dd className="text-right font-medium">MacBook 16&quot;, Silver</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-2">Owned by the seller</dt>
                <dd className="text-right font-medium">Being funded by these sales</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-2">What it costs</dt>
                <dd className="text-right font-medium tabular-nums">4&#8239;200&nbsp;€</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
