import fs from 'node:fs';
import path from 'node:path';

const SITE = 'brandmylaptop-com-284b5fbe';
const SRC = `docs/research/${SITE}/_shared-html`;
const DEST = `src/components/sites/${SITE}/shared`;
const manifest = JSON.parse(fs.readFileSync(`docs/research/${SITE}/_asset-manifest.json`, 'utf8'));

const VOID = new Set(['img', 'input', 'br', 'hr', 'source', 'meta', 'link', 'path', 'circle', 'rect', 'line', 'polyline', 'polygon', 'ellipse', 'use', 'stop', 'area', 'col', 'embed', 'track', 'wbr']);

function localFor(url) {
  if (!url) return null;
  const clean = url.replace(/&amp;/g, '&');
  const hit = manifest[clean] || manifest[url];
  if (hit && hit.local) return hit.local;
  return null;
}

function convert(html, opts = {}) {
  let out = html;
  // strip next/image artifacts
  out = out.replace(/\s(data-nimg|decoding|sizes|srcset|loading)="[^"]*"/g, '');
  out = out.replace(/\sstyle="color: transparent;?"/g, '');
  // images -> local
  out = out.replace(/<img\b([^>]*?)\/?>/g, (m, attrs) => {
    const srcM = attrs.match(/\ssrc="([^"]+)"/);
    const altM = attrs.match(/\salt="([^"]*)"/);
    const wM = attrs.match(/\swidth="(\d+)"/);
    const hM = attrs.match(/\sheight="(\d+)"/);
    let cls = attrs.match(/\sclass="([^"]+)"/);
    let rest = attrs
      .replace(/\ssrc="[^"]*"/, '')
      .replace(/\salt="[^"]*"/, '')
      .replace(/\swidth="\d+"/, '')
      .replace(/\sheight="\d+"/, '')
      .replace(/\sclass="[^"]*"/, '')
      .trim();
    const local = localFor(srcM ? srcM[1] : '') || (srcM ? srcM[1] : '');
    const alt = altM ? altM[1] : '';
    const attrsOut = [
      `src="${local}"`,
      `alt="${alt}"`,
      wM ? `width={${wM[1]}}` : '',
      hM ? `height={${hM[1]}}` : '',
      cls ? `className="${cls[1]}"` : '',
      rest ? convertAttrs(rest) : '',
    ]
      .filter(Boolean)
      .join(' ');
    return `<img ${attrsOut} />`;
  });
  out = convertAttrs(out);
  out = out
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, '{"\\u00a0"}')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'");
  out = out.replace(/<\/(img|input|br|hr|source|path|circle|rect|line)>/g, '');
  return out;
}

function convertAttrs(s) {
  return s
    .replace(/\sclass=/g, ' className=')
    .replace(/\sfor=/g, ' htmlFor=')
    .replace(/\sstroke-width=/g, ' strokeWidth=')
    .replace(/\sstroke-linecap=/g, ' strokeLinecap=')
    .replace(/\sstroke-linejoin=/g, ' strokeLinejoin=')
    .replace(/\sfill-rule=/g, ' fillRule=')
    .replace(/\sclip-rule=/g, ' clipRule=')
    .replace(/\stabindex=/g, ' tabIndex=')
    .replace(/\sviewbox=/gi, ' viewBox=')
    .replace(/\saria-label=/g, ' aria-label=')
    .replace(/\starget="_blank"/g, ' target="_blank"')
    .replace(/\srel="noopener noreferrer sponsored"/g, ' rel="noopener noreferrer sponsored"')
    .replace(/\saria-expanded="false"/g, ' aria-expanded={false}')
    .replace(/\saria-controls=/g, ' aria-controls=')
    .replace(/\sautocomplete=/g, ' autoComplete=')
    .replace(/\sselected=""/g, ' defaultSelected')
    .replace(/\sdisabled=""/g, ' disabled');
}

const indent = (s, pad) =>
  s
    .split('\n')
    .map((l) => (l.trim() ? pad + l : l))
    .join('\n');

fs.mkdirSync(DEST, { recursive: true });

// ---------- Nav ----------
const navHtml = fs.readFileSync(path.join(SRC, 'nav.html'), 'utf8');
let navBody = convert(navHtml.replace(/^<nav\b[^>]*>/, '').replace(/<\/nav>$/, '').trim());
fs.writeFileSync(
  path.join(DEST, 'Nav.tsx'),
  `import Link from "next/link";
import { CurrencySelect } from "./CurrencySelect";
import { MobileMenuButton } from "./MobileMenu";

export function Nav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-hairline/70 bg-white/70 backdrop-blur-xl">
${indent(navBody, '      ')}
    </nav>
  );
}
`
);

// ---------- Footer ----------
const footHtml = fs.readFileSync(path.join(SRC, 'footer.html'), 'utf8');
let footBody = convert(footHtml.replace(/^<footer\b[^>]*>/, '').replace(/<\/footer>$/, '').trim());
fs.writeFileSync(
  path.join(DEST, 'Footer.tsx'),
  `import { CurrencySelect } from "./CurrencySelect";

export function Footer() {
  return (
    <footer className="border-t border-hairline">
${indent(footBody, '      ')}
    </footer>
  );
}
`
);

// ---------- Asides ----------
const asides = JSON.parse(fs.readFileSync(path.join(SRC, 'asides.json'), 'utf8'));
const left = convert(asides[0]);
const right = convert(asides[1]);
fs.writeFileSync(
  path.join(DEST, '_rail-markup.txt'),
  `/* LEFT */\n${left}\n\n/* RIGHT */\n${right}\n`
);
console.log('nav', navBody.length, 'footer', footBody.length, 'asides', left.length, right.length);
console.log('wrote Nav.tsx, Footer.tsx, _rail-markup.txt');
