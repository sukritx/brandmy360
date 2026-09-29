import { ChevronDownLargeIcon } from "../shared/icons";

export function DarkCta() {
  return (
    <section className="mx-4 mt-4 overflow-hidden rounded-3xl bg-ink py-24 text-white sm:mx-6 sm:mt-6 md:py-36 lg:mx-8">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <h2 className="text-[clamp(1.75rem,5vw,3.75rem)] font-semibold leading-[1.06] tracking-[-0.025em]">
          Everyone stares at laptop lids.{" "}
          <span className="text-white/55">Yours may as well get paid.</span>
        </h2>
        <div className="mt-14 flex justify-center">
          <a
            href="#how"
            aria-label="See how it works"
            className="rounded-full p-2 text-white/45 transition-colors hover:text-white/85 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/60"
          >
            <ChevronDownLargeIcon aria-hidden="true" className="h-8 w-8" />
          </a>
        </div>
      </div>
    </section>
  );
}
