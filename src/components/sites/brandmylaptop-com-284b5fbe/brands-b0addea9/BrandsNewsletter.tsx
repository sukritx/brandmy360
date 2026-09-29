export function BrandsNewsletter() {
  return (
    <section className="mt-16 rounded-3xl border border-hairline bg-white p-6 sm:p-8">
      <h2 className="text-[17px] font-medium">What sold this week, every week</h2>
      <p className="mt-1 max-w-[58ch] text-[14px] leading-relaxed text-ink-2">
        One email on Monday: the spots that sold, what brands paid for them, and the laptops that
        went up. The numbers, not a newsletter about them.
      </p>
      <div className="mt-5">
        <form className="space-y-3">
          <div className="grid grid-cols-1 gap-3 ">
            <input
              type="email"
              placeholder="your email"
              autoComplete="email"
              aria-label="Email"
              className="w-full rounded-xl border border-hairline bg-white px-4 py-3 text-[15px] outline-none transition-shadow placeholder:text-ink-2/70 focus:border-blue focus:ring-4 focus:ring-blue/15"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-full bg-blue px-6 py-3.5 text-[15px] font-medium text-white transition-colors hover:bg-blue-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue disabled:opacity-60 sm:w-auto sm:px-8"
          >
            Send me the numbers
          </button>
        </form>
      </div>
    </section>
  );
}
