const STEPS = [
  {
    title: "A creator lists their lid",
    body: "Mac or PC, the spots and their prices, how long the stickers stay. $19 once, Stripe connected, and the lid is live at its own address.",
  },
  {
    title: "A brand picks a spot",
    body: "Or posts a brief and lets creators apply. The creator approves the logo by hand, and that is what takes the payment — straight into their own Stripe.",
  },
  {
    title: "Stickers on, photo posted",
    body: "The creator prints the stickers at the size each spot lists, puts them on, and posts the photo. The platform keeps 10% — 15% on an auction — and never touches the rest.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-20 mx-auto max-w-4xl px-6 py-16 md:py-24">
      <h2 className="text-3xl font-semibold tracking-[-0.015em] md:text-4xl">How it works</h2>
      <p className="mt-4 max-w-[58ch] text-[16px] leading-relaxed text-ink-2">
        Most lids sell at a fixed price. Some run an auction instead: brands bid for a few days, and
        the highest approved bid wins at the close.
      </p>
      <ol className="mt-10 space-y-10">
        {STEPS.map((step, i) => (
          <li key={step.title} className="flex gap-6">
            <span
              aria-hidden="true"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-[15px] font-semibold text-white"
            >
              {i + 1}
            </span>
            <div>
              <h3 className="text-xl font-semibold">{step.title}</h3>
              <p className="mt-1.5 max-w-[58ch] leading-relaxed text-ink-2">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
