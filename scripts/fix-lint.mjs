import fs from 'node:fs';

// 1) Footer: convert the 4 flagged anchors to next/link
{
  const p = 'src/components/sites/brandmylaptop-com-284b5fbe/shared/Footer.tsx';
  let c = fs.readFileSync(p, 'utf8');
  if (!c.includes('import Link from "next/link"')) {
    c = 'import Link from "next/link";\n\n' + c;
  }
  const targets = ['/', '/#how', '/#faq'];
  let n = 0;
  c = c.replace(/<a\b[^>]*href="([^"]*)"[^>]*>/g, (m, href) => {
    if (!targets.includes(href)) return m;
    n++;
    return m.replace('<a', '<Link').replace(/\shref="([^"]*)"/, (mm) => mm) + '';
  });
  // now close the tags: any <Link ...>...</a> should end with </Link>
  c = c.replace(/<Link\b([^>]*)>([\s\S]*?)<\/a>/g, (m, attrs, inner) => `<Link${attrs}>${inner}</Link>`);
  fs.writeFileSync(p, c);
  console.log('Footer: converted', n, 'anchors to Link');
}

// 2) Nav: the logo anchor -> Link
{
  const p = 'src/components/sites/brandmylaptop-com-284b5fbe/shared/Nav.tsx';
  let c = fs.readFileSync(p, 'utf8');
  c = c.replace(
    /<a\s+className="flex items-center gap-2 text-\[13px\] font-semibold tracking-\[-0\.01em\] sm:gap-2\.5 sm:text-\[15px\]"\s+href="\/"\s*>/,
    '<Link\n          className="flex items-center gap-2 text-[13px] font-semibold tracking-[-0.01em] sm:gap-2.5 sm:text-[15px]"\n          href="/"\n        >'
  );
  // close the corresponding anchor (first </a> after the logo wordmark img)
  if (c.includes('<Link\n          className="flex items-center gap-2 text-[13px]')) {
    const idx = c.indexOf('<Link\n          className="flex items-center gap-2 text-[13px]');
    const closeIdx = c.indexOf('</a>', idx);
    if (closeIdx !== -1) c = c.slice(0, closeIdx) + '</Link>' + c.slice(closeIdx + 4);
  }
  if (!c.includes('import Link from "next/link"')) {
    c = 'import Link from "next/link";\n' + c;
  }
  fs.writeFileSync(p, c);
  console.log('Nav: logo converted to Link');
}

// 3) CurrencyProvider: avoid synchronous setState in effect
{
  const p = 'src/components/sites/brandmylaptop-com-284b5fbe/shared/CurrencyProvider.tsx';
  let c = fs.readFileSync(p, 'utf8');
  c = c.replace(
    `    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "USD" || stored === "EUR" || stored === "GBP") setCurrencyState(stored);
    } catch {}`,
    `    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(STORAGE_KEY);
    } catch {}
    if (stored === "USD" || stored === "EUR" || stored === "GBP") {
      queueMicrotask(() => setCurrencyState(stored as Currency));
    }`
  );
  fs.writeFileSync(p, c);
  console.log('CurrencyProvider: deferred stored-currency restore');
}
