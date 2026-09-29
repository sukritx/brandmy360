import Link from "next/link";

export function BrandsHero() {
  return (
    <>
      <p className="text-[13px] text-ink-2">
        <Link className="hover:text-ink" href="/">
          BrandMyLaptop
        </Link>{" "}
        / Brands
      </p>
      <h1 className="mt-4 max-w-[18ch] text-[clamp(2rem,5vw,3.4rem)] font-medium leading-[1.02] tracking-[-0.04em]">
        Get your logo on creators’ laptops.
      </h1>
      <p className="mt-5 max-w-[58ch] text-[17px] leading-relaxed text-ink-2">
        They advertise for you, and you go everywhere they go.
      </p>
    </>
  );
}
