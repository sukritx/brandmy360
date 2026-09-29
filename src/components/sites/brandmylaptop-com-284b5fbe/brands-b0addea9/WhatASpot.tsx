const SPOT_FACTS = [
  {
    title: "One price, paid once",
    body: "The creator sets the term — 3, 6, 12 or 24 months.",
  },
  {
    title: "Die-cut vinyl",
    body: "Printed at the size shown, applied by the creator, photographed once it is on.",
  },
  {
    title: "A link and a page",
    body: "From their page to your site, and a page of your own on BrandMyLaptop.",
  },
  {
    title: "Nothing charged yet",
    body: "Your card is held until the creator approves your logo.",
  },
];

export function WhatASpot() {
  return (
    <section className="mt-12 overflow-hidden rounded-2xl border border-hairline bg-white">
      <h2 className="px-6 pt-6 text-[15px] font-medium sm:px-8 sm:pt-8">What a spot is</h2>
      <dl className="mt-6 grid grid-cols-1 border-t border-hairline md:grid-cols-2">
        {SPOT_FACTS.map((fact) => (
          <div
            key={fact.title}
            className="border-b border-hairline px-6 py-5 last:border-b-0 sm:px-8 md:[&:nth-child(odd)]:border-r md:[&:nth-last-child(2)]:border-b-0"
          >
            <dt className="text-[17px] font-medium tracking-[-0.015em]">{fact.title}</dt>
            <dd className="mt-1 text-[14px] leading-relaxed text-ink-2">{fact.body}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
