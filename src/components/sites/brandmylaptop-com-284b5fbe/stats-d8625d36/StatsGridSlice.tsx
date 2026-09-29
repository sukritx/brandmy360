
export function StatsGridSlice() {
  return (
    <>
      <section className="mt-6 rounded-3xl border border-hairline bg-white p-6 sm:p-10">
        <h2 className="text-[17px] font-medium">These numbers move.</h2>
        <p className="mt-1 max-w-[58ch] text-[14px] leading-relaxed text-ink-2">
          Get the new ones on Monday: what sold that week, what it went for, and which laptops went
          up.
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
      <p className="mt-8 text-[13px] text-ink-2">
        These figures are free to reuse under{" "}
        <a
          href="https://creativecommons.org/licenses/by/4.0/"
          rel="license noopener noreferrer"
          target="_blank"
          className="underline decoration-hairline hover:text-ink"
        >
          CC BY 4.0
        </a>
        . Credit BrandMyLaptop and link to this page.
      </p>
    </>
  );
}
