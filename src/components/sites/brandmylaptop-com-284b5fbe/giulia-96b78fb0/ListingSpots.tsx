import type { ListingSpot } from "./data";
import { listingSpots } from "./data";

const ICON_ONLY_LOGOS = new Set(["Creatorbuzz"]);

function SpotLogoLink({ spot }: { spot: ListingSpot }) {
  const showBrandText = !spot.logo || ICON_ONLY_LOGOS.has(spot.brand);

  return (
    <span className="inline-flex min-w-0 items-center gap-2">
      <a
        href={spot.brandHref}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="group/link inline-flex min-w-0 items-center gap-2.5 hover:text-blue [&_span]:hover:underline"
      >
        <span className="flex h-6 shrink-0 items-center overflow-visible">
          {spot.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt={spot.brand}
              className="max-h-9 w-auto max-w-24 object-contain"
              src={spot.logo}
            />
          ) : null}
        </span>
        {showBrandText && <span className="truncate font-medium">{spot.brand}</span>}
      </a>
    </span>
  );
}

export function ListingSpots() {
  return (
    <section
      id="spots"
      className="mx-4 mt-4 scroll-mt-20 rounded-3xl bg-surface py-16 sm:mx-6 sm:mt-6 md:py-24 lg:mx-8"
    >
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="text-3xl font-semibold tracking-[-0.015em] md:text-4xl">The spots.</h2>
        <p className="mt-3 max-w-[60ch] text-ink-2">
          This listing has closed. What sold stays on the lid for 24 months.
        </p>
        <ul className="mt-8 space-y-3 sm:hidden">
          {listingSpots.map((spot) => (
            <li
              key={spot.n}
              className="rounded-2xl bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="flex items-center gap-2 text-[13px] text-ink-2">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-hairline/80 text-[11px] font-semibold tabular-nums">
                      {spot.n}
                    </span>
                    {spot.dims}
                  </p>
                  <p className="mt-1 truncate font-medium">{spot.name}</p>
                </div>
                <span className="shrink-0 text-right">
                  <span className="block font-semibold tabular-nums">{spot.price}&nbsp;€</span>
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between gap-3 border-t border-hairline/60 pt-3">
                <SpotLogoLink spot={spot} />
                <span className="shrink-0 rounded-full px-4 py-1.5 text-[13px] font-medium bg-hairline/60 text-ink-2">
                  Sold
                </span>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-8 hidden overflow-hidden rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)] sm:block">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[440px] text-left text-[14px] sm:min-w-[560px]">
              <thead>
                <tr className="border-b border-hairline text-[12px] text-ink-2">
                  <th scope="col" className="px-3 py-3.5 font-medium sm:px-5">
                    Spot
                  </th>
                  <th scope="col" className="hidden px-5 py-3.5 font-medium sm:table-cell">
                    Size
                  </th>
                  <th scope="col" className="px-3 py-3.5 font-medium sm:px-5">
                    Taken by
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-right font-medium sm:px-5">
                    Price
                  </th>
                  <th scope="col" className="px-5 py-3.5">
                    <span className="sr-only">Action</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {listingSpots.map((spot) => (
                  <tr key={spot.n} className="border-b border-hairline/60 last:border-0">
                    <td className="px-3 py-4 sm:px-5">
                      <span className="mr-3 inline-flex h-7 w-7 items-center justify-center rounded-lg bg-hairline/80 text-[12px] font-semibold tabular-nums text-ink-2">
                        {spot.n}
                      </span>
                      <span className="font-medium">{spot.name}</span>
                    </td>
                    <td className="hidden px-5 py-4 whitespace-nowrap sm:table-cell">
                      <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-md bg-hairline/80 text-[11px] font-bold text-ink-2">
                        {spot.sizeShort}
                      </span>
                      <span className="text-[12px] text-ink-2">{spot.dims}</span>
                    </td>
                    <td className="px-3 py-4 sm:px-5">
                      <SpotLogoLink spot={spot} />
                    </td>
                    <td className="px-3 py-4 text-right sm:px-5">
                      <span className="tabular-nums text-ink-2 line-through">
                        {spot.price}&nbsp;€
                      </span>
                    </td>
                    <td className="px-3 py-4 text-right sm:px-5">
                      <span className="shrink-0 rounded-full px-4 py-1.5 text-[13px] font-medium bg-hairline/60 text-ink-2">
                        Sold
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
