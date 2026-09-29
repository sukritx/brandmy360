const AVATAR_BASE = "/sites/brandmylaptop-com-284b5fbe/shared/avatars/";

const ITEMS = [
  {
    href: "/carolcborg",
    name: "Carolina Cardoso Borges",
    avatar: `${AVATAR_BASE}cd8f825f-a046-4be0-9858-69afed20d4b4.jpg`,
    action: "listed a Mac",
    time: "31m ago",
    isNew: true,
  },
  {
    href: "/praveendhote",
    name: "Praveen Dhote",
    avatar: `${AVATAR_BASE}7500f691-6871-4a9c-8b6a-1b6333b31bef.jpg`,
    action: "listed a Mac",
    time: "23h ago",
    isNew: true,
  },
  {
    href: "/salescreatorcollective",
    name: "Thibaut Souyris",
    avatar: `${AVATAR_BASE}932b43bc-0d9a-4876-b09e-77d8f50bf480.jpg`,
    action: "listed a Mac",
    time: "23h ago",
    isNew: true,
  },
  {
    href: "/lizardn",
    name: "Yelyzaveta Shatilova",
    avatar: `${AVATAR_BASE}05e4c0de-a0f0-4955-9896-aa86d3d98c8e.jpg`,
    action: "listed a Mac",
    time: "1d ago",
    isNew: false,
  },
  {
    href: "/creativelyange",
    name: "Angel",
    avatar: `${AVATAR_BASE}cf981e4d-193d-4163-8b2e-6e19f8435bb2.jpg`,
    action: "listed a Mac",
    time: "2d ago",
    isNew: true,
  },
] as const;

function ActivityItem({
  item,
  duplicate,
}: {
  item: (typeof ITEMS)[number];
  duplicate?: boolean;
}) {
  return (
    <li
      aria-hidden={duplicate || undefined}
      className="mr-2 h-[52px] w-[168px] shrink-0 sm:mr-3 sm:w-[185.6px]"
    >
      <a
        className="flex h-full flex-col justify-center rounded-xl border border-hairline bg-white px-2.5 py-2 transition-colors hover:border-ink/30"
        href={item.href}
      >
        <span className="flex items-baseline gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt=""
            loading="lazy"
            className="h-4 w-4 shrink-0 self-center rounded-full object-cover"
            src={item.avatar}
          />
          <span className="min-w-0 flex-1 truncate text-[12px] font-medium">{item.name}</span>
          {item.isNew && <span className="shrink-0 text-[11px] font-medium text-blue">new</span>}
        </span>
        <span className="mt-0.5 flex items-baseline gap-2 text-[11px] text-ink-2">
          <span className="min-w-0 flex-1 truncate">{item.action}</span>
          <span className="shrink-0 text-[10px] text-ink-2/70">{item.time}</span>
        </span>
      </a>
    </li>
  );
}

export function LatestActivity() {
  return (
    <div className="relative mt-3 overflow-hidden">
      <ul className="no-scrollbar flex w-max animate-marquee">
        {ITEMS.map((item) => (
          <ActivityItem key={item.href} item={item} />
        ))}
        {ITEMS.map((item) => (
          <ActivityItem key={`duplicate-${item.href}`} item={item} duplicate />
        ))}
      </ul>
    </div>
  );
}
