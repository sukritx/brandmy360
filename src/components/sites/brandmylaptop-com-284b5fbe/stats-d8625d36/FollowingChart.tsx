const ROWS = [
  { label: "Under 100 followers", value: "13", width: "14.285714285714285%", count: "112 laptops" },
  { label: "100 – 1k followers", value: "17", width: "18.681318681318682%", count: "24 laptops" },
  { label: "1k – 10k followers", value: "25", width: "27.472527472527474%", count: "23 laptops" },
  { label: "10k and up followers", value: "91", width: "100%", count: "7 laptops" },
] as const;

export function FollowingChart() {
  return (
    <section className="mt-6 rounded-3xl bg-surface p-6 sm:p-10">
      <h2 className="text-[clamp(1.4rem,3vw,2rem)] font-medium tracking-[-0.025em]">
        Does a bigger following bring more visitors?
      </h2>
      <p className="mt-3 text-[15px] text-ink-2">
        Typical views on a laptop’s page, by the seller’s X following.
      </p>
      <ul className="mt-8 space-y-3">
        {ROWS.map((row) => (
          <li key={row.label} className="rounded-2xl border border-hairline bg-white p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 className="text-[15px] font-medium">{row.label}</h3>
              <p className="text-[22px] font-semibold tabular-nums tracking-[-0.02em]">{row.value}</p>
            </div>
            <div className="mt-3 h-2 rounded-full bg-hairline/60" aria-hidden="true">
              <div className="h-full rounded-full bg-blue/50" style={{ width: row.width }} />
            </div>
            <p className="mt-2 text-[12px] tabular-nums text-ink-2">{row.count}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
