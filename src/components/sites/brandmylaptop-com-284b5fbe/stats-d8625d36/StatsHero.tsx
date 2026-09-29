import Link from "next/link";

export function StatsHero() {
  return (
    <>
      <p className="text-[13px] text-ink-2">
        <Link className="hover:text-ink" href="/">
          BrandMyLaptop
        </Link>{" "}
        / Stats
      </p>
      <h1 className="mt-4 text-[clamp(2rem,5vw,3.2rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
        Everything this market has done.
      </h1>
      <p className="mt-5 max-w-[58ch] text-[17px] leading-relaxed text-ink-2">
        Read from the database, every fifteen minutes.
      </p>
    </>
  );
}
