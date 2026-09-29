export function HowItCompares() {
  return (
    <section className="mt-12 rounded-2xl border border-hairline bg-white p-6 sm:p-8">
      <h2 className="text-[15px] font-medium">How it compares</h2>
      <dl className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-6">
        <div>
          <dt className="text-[clamp(1.25rem,2.4vw,1.6rem)] font-medium leading-[1.1] tracking-[-0.03em]">
            Months
          </dt>
          <dd className="mt-2 text-[14px] leading-relaxed text-ink-2">
            A newsletter slot lasts one send.
          </dd>
        </div>
        <div>
          <dt className="text-[clamp(1.25rem,2.4vw,1.6rem)] font-medium leading-[1.1] tracking-[-0.03em]">
            Every time it opens
          </dt>
          <dd className="mt-2 text-[14px] leading-relaxed text-ink-2">
            A podcast read is heard once.
          </dd>
        </div>
        <div>
          <dt className="text-[clamp(1.25rem,2.4vw,1.6rem)] font-medium leading-[1.1] tracking-[-0.03em]">
            In the room
          </dt>
          <dd className="mt-2 text-[14px] leading-relaxed text-ink-2">Not on a screen.</dd>
        </div>
      </dl>
    </section>
  );
}
