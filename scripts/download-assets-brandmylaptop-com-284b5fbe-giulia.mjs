import fs from 'node:fs';
import path from 'node:path';

const SITE = 'brandmylaptop-com-284b5fbe';
const OUT = path.join('public', 'sites', SITE, 'shared');
const raw = JSON.parse(fs.readFileSync(`docs/research/${SITE}/giulia-96b78fb0/_assets-raw.json`, 'utf8'));
const manifest = JSON.parse(fs.readFileSync(`docs/research/${SITE}/_asset-manifest.json`, 'utf8'));

const classify = (rawUrl) => {
  let u = rawUrl;
  if (u.includes('/_next/image?')) {
    const m = u.match(/[?&]url=([^&]+)/);
    if (m) u = decodeURIComponent(m[1]);
  }
  if (u.startsWith('/')) u = 'https://brandmylaptop.com' + u;
  let dir = 'media';
  if (u.includes('/logos/sponsors/')) dir = 'logos';
  else if (u.includes('/logos/avatars/')) dir = 'avatars';
  else if (u.includes('/logos/')) dir = 'logos';
  else if (u.includes('/stickers/')) dir = 'stickers';
  else if (u.includes('/og/')) dir = 'og';
  else if (u.includes('producthunt') || u.includes('tinylaunch')) dir = 'badges';
  let name = decodeURIComponent(u.split('?')[0].split('/').pop() || 'file');
  name = name.replace(/[^a-zA-Z0-9._-]/g, '_');
  if (!/\.(png|jpe?g|webp|svg|gif|avif)$/i.test(name)) name += '.png';
  return { url: u, dir, name };
};

const jobs = new Map();
for (const r of raw) {
  const { url, dir, name } = classify(r);
  if (url.startsWith('data:')) continue;
  const exists = manifest[url] && manifest[url].local;
  const fname = `${dir}/${name}`;
  if (exists) continue;
  if (jobs.has(url)) continue;
  jobs.set(url, { url, fname });
}
console.log('new assets to download:', jobs.size);

let ok = 0;
const fails = [];
const queue = [...jobs.values()];
async function worker() {
  while (queue.length) {
    const job = queue.shift();
    try {
      const res = await fetch(job.url, { headers: { 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131 Safari/537.36' } });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 40) throw new Error('too small');
      fs.writeFileSync(path.join(OUT, job.fname), buf);
      manifest[job.url] = { local: `/sites/${SITE}/shared/${job.fname.replace(/\\/g, '/')}`, bytes: buf.length, status: 'ok' };
      manifest[job.url.replace('https://brandmylaptop.com', '')] = manifest[job.url];
      ok++;
    } catch (e) {
      fails.push(`${job.fname} ${String(e).slice(0, 60)}`);
    }
  }
}
await Promise.all([worker(), worker(), worker(), worker()]);
fs.writeFileSync(`docs/research/${SITE}/_asset-manifest.json`, JSON.stringify(manifest, null, 1));
console.log(`downloaded ${ok}/${jobs.size}`);
if (fails.length) console.log('FAILS:\n' + fails.join('\n'));

// write the local mapping for this page
const map = {};
for (const r of raw) {
  const { url } = classify(r);
  const hit = manifest[url] || manifest[url.replace('https://brandmylaptop.com', '')];
  map[r] = hit && hit.local ? hit.local : null;
}
fs.writeFileSync(`docs/research/${SITE}/giulia-96b78fb0/_asset-map.json`, JSON.stringify(map, null, 1));
console.log('unmapped:', Object.values(map).filter((v) => !v).length);
