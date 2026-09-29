"use client";

import { useState, type ReactNode } from "react";

type FaqItem = { q: string; answer: ReactNode };

const FAQ_ITEMS: FaqItem[] = [
  {
    q: "Is this real?",
    answer: (
      <>
        <p>
          {"It started as brandmymac.com — one MacBook, twenty sticker spots on the lid, inside and accessories, $9,307 raised against a $2,959 machine, goal passed 315%."}
        </p>
        <p>
          {"This site is that turned into a marketplace: anyone puts their own lid up, brands buy the spots on it, and the listing, the payment and the logo review are handled here."}
        </p>
      </>
    ),
  },
  {
    q: "What does buying a spot actually get me?",
    answer: (
      <>
        <p>{"Your brand on one named seller's laptop, in the world:"}</p>
        <ul className="space-y-2">
          <li className="relative pl-5 before:absolute before:left-0 before:top-[0.65em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-ink-2/50">
            {"A die-cut vinyl sticker of your logo on their lid, at the printed size the spot shows — everywhere that laptop goes, your brand is visible"}
          </li>
          <li className="relative pl-5 before:absolute before:left-0 before:top-[0.65em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-ink-2/50">
            {"A listing on that lid's page with a link to your site"}
          </li>
          <li className="relative pl-5 before:absolute before:left-0 before:top-[0.65em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-ink-2/50">
            {"It stays on for the number of months the listing shows, counted from the day you buy"}
          </li>
        </ul>
        <p>
          {"Nobody promises impressions or clicks — a sticker is presence, not performance, and it is a paid placement, not an endorsement in either direction."}
        </p>
      </>
    ),
  },
  {
    q: "How does paying work?",
    answer: (
      <>
        <p>
          {"Most spots have one price and you pay it in full, by card, through Stripe: the first brand to pay for a spot takes it. Some lids are auctions: you bid, your card is held for the bid, and at the close the highest bid the seller approved is charged and takes the spot. Outbid or not approved, the hold is released."}
        </p>
        <p>{"Everything is settled in euros; the dollar prices shown are indicative."}</p>
      </>
    ),
  },
  {
    q: "Who is actually taking my money?",
    answer: (
      <>
        <p>
          {"The seller. The payment goes straight into their own Stripe account, and Stripe takes BrandMyLaptop's 10% commission as it passes. The platform never holds it."}
        </p>
        <p>
          {"That means the sale is between you and them: we run the listing, check it is not obviously fraudulent, and can pull it — but we cannot refund you out of money we never had."}
        </p>
        <p>
          {"It is a real trade-off, so it is worth saying plainly: you are relying on a seller whose account, prices and proof photo are all in front of you before you pay."}
        </p>
      </>
    ),
  },
  {
    q: "What if my logo is refused?",
    answer: (
      <>
        <p>
          {"Nothing is charged. Your card is only authorised when you buy, and the charge goes through only if the seller says yes — a refusal releases the hold and nothing is printed. The seller approves every logo by hand before it appears: it is their laptop, and they keep the final say over what it carries."}
        </p>
        <p>{"The platform can also refuse or remove one on its own."}</p>
      </>
    ),
  },
  {
    q: "What if the sticker never appears?",
    answer: (
      <>
        <p>
          {"The seller has 14 days from your purchase to put it on and update the photo on their listing. Past that you are entitled to ask them for your money back, and they owe it."}
        </p>
        <p>
          {"Tell us as well. We will contact them, and we can remove their listing and refuse them the platform — a missed deadline is a dated breach, so it is checkable rather than arguable. That is the leverage we have and we will use it."}
        </p>
        <p>
          {"What we cannot do is pay you back ourselves, because the money went to them and not to us. A card payment also leaves you whatever your bank offers."}
        </p>
      </>
    ),
  },
  {
    q: "How do I put my own lid up?",
    answer: (
      <>
        <p>
          {"Set the machine, the layout, your prices, how long the listing runs and how long the stickers stay. Sign in with X or LinkedIn and pay a one-off $19 to publish, and your lid is live at its own address. Connect your Stripe account when you are ready to take money — until you do, the page is a shop window and nobody can buy."}
        </p>
        <p>
          {"You print the stickers yourself, at your own choice of printer and finish — each spot lists its printed size — apply them, and post the photo. Buyers pay you directly; the platform takes 10%, and Stripe takes its processing fee."}
        </p>
        <p>
          {"Listing is the start, not a guarantee. We bring people to the board and we go looking for brands, but we cannot promise anyone will buy your spots: a brand pays to be seen by the people who already see you. What a lid sells depends on who you are, what you make, where the laptop goes, and above all what you post and who you send to your page. Some lids will get sold out, or fully funded, but that also depends on the audience the sellers are bringing."}
        </p>
        <p>
          <a href="/sell" className="font-medium text-blue hover:underline">
            Put your lid up{"\u00a0›"}
          </a>
        </p>
      </>
    ),
  },
];

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="mx-4 mt-4 scroll-mt-20 rounded-3xl bg-surface py-16 sm:mx-6 sm:mt-6 md:py-24 lg:mx-8"
    >
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="text-3xl font-semibold tracking-[-0.015em] md:text-4xl">
          Questions &amp; Answers
        </h2>
        <div className="mt-8">
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={item.q} className="border-b border-hairline">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                >
                  <span className="text-[16px] font-medium">{item.q}</span>
                  <span
                    aria-hidden="true"
                    className="shrink-0 text-xl leading-none text-ink-2"
                    style={{ transform: isOpen ? "rotate(45deg)" : "none" }}
                  >
                    +
                  </span>
                </button>
                <div
                  className="overflow-hidden"
                  style={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                  inert={!isOpen}
                >
                  <div className="space-y-3 pb-6 text-[15px] leading-relaxed text-ink-2">
                    {item.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
