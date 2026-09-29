import { logoWall } from "@/components/sites/brandmylaptop-com-284b5fbe/shared/data";

export function LogoWall() {
  return (
    <section className="mt-12">
      <h2 className="text-[15px] font-medium">Already on a lid</h2>
      <ul className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-8">
        {logoWall.map((logo) => (
          <li
            key={logo.alt}
            title={logo.alt}
            className="flex aspect-square items-center justify-center rounded-2xl border border-hairline bg-white p-3"
          >
            {logo.img && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logo.img}
                alt={logo.alt}
                loading="lazy"
                className="max-h-full max-w-full object-contain"
              />
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
