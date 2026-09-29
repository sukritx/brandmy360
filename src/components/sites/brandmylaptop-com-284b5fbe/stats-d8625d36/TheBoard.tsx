export function TheBoard() {
  return (
    <section className="mt-6">
      <h2 className="text-[clamp(1.4rem,3vw,2rem)] font-medium tracking-[-0.025em]">The board</h2>
      <dl className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-hairline bg-white p-5">
          <dt className="text-[13px] text-ink-2">Laptops put up</dt>
          <dd className="mt-1 text-[26px] font-semibold tabular-nums tracking-[-0.02em]">301</dd>
        </div>
        <div className="rounded-2xl border border-hairline bg-white p-5">
          <dt className="text-[13px] text-ink-2">Taking brands today</dt>
          <dd className="mt-1 text-[26px] font-semibold tabular-nums tracking-[-0.02em]">166</dd>
        </div>
        <div className="rounded-2xl border border-hairline bg-white p-5">
          <dt className="text-[13px] text-ink-2">Spots free right now</dt>
          <dd className="mt-1 text-[26px] font-semibold tabular-nums tracking-[-0.02em]">1,656</dd>
        </div>
        <div className="rounded-2xl border border-hairline bg-white p-5">
          <dt className="text-[13px] text-ink-2">Spots taken</dt>
          <dd className="mt-1 text-[26px] font-semibold tabular-nums tracking-[-0.02em]">30</dd>
        </div>
      </dl>
    </section>
  );
}
