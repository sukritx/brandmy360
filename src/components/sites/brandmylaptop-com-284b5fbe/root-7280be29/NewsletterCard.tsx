"use client";

export function NewsletterCard() {
  return (
    <section id="waitlist" className="scroll-mt-20 py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-6">
        <div className="rounded-3xl border border-hairline bg-white p-8 shadow-[0_1px_3px_rgba(0,0,0,0.06)] sm:p-10">
          <h2 className="text-2xl font-semibold tracking-[-0.015em] sm:whitespace-nowrap sm:text-3xl">
            What sold this week, every week
          </h2>
          <p className="mt-3 max-w-[58ch] leading-relaxed text-ink-2">
            One email a week: the spots that sold, what brands paid for them, the laptops that went
            up, and what the whole board is worth. The numbers, not a newsletter about them.
          </p>
          <div className="mt-6">
            <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <input
                  placeholder="your email"
                  autoComplete="email"
                  aria-label="Email"
                  className="w-full rounded-xl border border-hairline bg-white px-4 py-3 text-[15px] outline-none transition-shadow placeholder:text-ink-2/70 focus:border-blue focus:ring-4 focus:ring-blue/15"
                  type="email"
                />
                <input
                  placeholder="your X/Twitter handle (optional)"
                  autoComplete="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  aria-label="X handle, optional"
                  className="w-full rounded-xl border border-hairline bg-white px-4 py-3 text-[15px] outline-none transition-shadow placeholder:text-ink-2/70 focus:border-blue focus:ring-4 focus:ring-blue/15"
                  type="text"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-full bg-blue px-6 py-3.5 text-[15px] font-medium text-white transition-colors hover:bg-blue-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue disabled:opacity-60 sm:w-auto sm:px-8"
              >
                Send me the weekly
              </button>
            </form>
          </div>
          <p className="mt-4 text-[13px] leading-relaxed text-ink-2">
            Once a week, nothing else, and one click to stop.
          </p>
        </div>
      </div>
    </section>
  );
}
