import fs from 'node:fs';
import path from 'node:path';

const PREFIXES = ['/laptops', '/brand/', '/campaign', '/dashboard', '/sponsor'];
const roots = ['src/app', 'src/components/sites'];
const files = [];
const walk = (dir) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.tsx$/.test(e.name)) files.push(p);
  }
};
roots.forEach(walk);

let touched = 0;
let count = 0;
for (const f of files) {
  const orig = fs.readFileSync(f, 'utf8');
  // find every <Link ...> opening tag
  const out = orig.replace(/<Link\b[^>]*>/g, (tag) => {
    if (tag.includes('prefetch')) return tag;
    const hrefMatch = tag.match(/href=(\{[^}]*\}|"[^"]*")/);
    if (!hrefMatch) return tag;
    const href = hrefMatch[1];
    const bare = href.replace(/^"|"$/g, '').replace(/[{}]/g, '');
    if (!PREFIXES.some((p) => bare.startsWith(p))) return tag;
    count++;
    return tag.replace(/href=(\{[^}]*\}|"[^"]*")/, (m) => `${m} prefetch={false}`);
  });
  if (out !== orig) {
    fs.writeFileSync(f, out);
    touched++;
    console.log('patched', f);
  }
}
console.log('files patched:', touched, 'links patched:', count);
