import Link from "next/link";

const BROWSE_BY = [
  { href: "/laptops/developers", label: "Developers" },
  { href: "/laptops/indie-hackers-and-founders", label: "Indie hackers and founders" },
  { href: "/laptops/designers", label: "Designers" },
  { href: "/laptops/content-creators", label: "Content creators" },
  { href: "/laptops/marketers", label: "Marketers" },
  { href: "/laptops/freelancers", label: "Freelancers" },
  { href: "/laptops/students", label: "Students" },
  { href: "/laptops/teachers-and-researchers", label: "Teachers and researchers" },
  { href: "/laptops/gamers", label: "Gamers" },
  { href: "/laptops/all-sorts-of-people", label: "All sorts of people" },
  { href: "/laptops/creators-posting-in-public", label: "Creators posting in public" },
  { href: "/laptops/coworking-spaces-and-cafes", label: "Coworking spaces and cafés" },
  { href: "/laptops/conferences-and-meetups", label: "Conferences and meetups" },
  { href: "/laptops/business-travel", label: "Business travel" },
  { href: "/laptops/client-and-investor-meetings", label: "Client and investor meetings" },
  { href: "/laptops/campuses-and-universities", label: "Campuses and universities" },
];

export function BrowseBy() {
  return (
    <section className="mt-12">
      <h2 className="text-[15px] font-medium">Browse by who carries it</h2>
      <ul className="mt-3 flex flex-wrap gap-2">
        {BROWSE_BY.map((chip) => (
          <li key={chip.href}>
            <Link
              className="block rounded-full border border-hairline bg-white px-4 py-2 text-[14px] transition-colors hover:border-ink/30"
              href={chip.href}
            >
              {chip.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
