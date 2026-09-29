import fs from 'node:fs';
import path from 'node:path';

const SITE = 'brandmylaptop-com-284b5fbe';
const OUT = path.join('public', 'sites', SITE, 'shared');
const list = JSON.parse(fs.readFileSync(`docs/research/${SITE}/_assets.json`, 'utf8'));

const dirs = ['logos', 'avatars', 'stickers', 'og', 'badges', 'media'];
dirs.forEach((d) => fs.mkdirSync(path.join(OUT, d), { recursive: true }));

const manifest = {};

function classify(raw) {
  let u = raw;
  // unwrap next/image
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
  else if (u.includes('uneed.best') || u.includes('producthunt') || u.includes('tinyshelf') || u.includes('yourwebsitescore') || u.includes('startupfa.me') || u.includes('tinylaunch')) dir = 'badges';
  let name = decodeURIComponent(u.split('?')[0].split('/').pop() || 'file');
  name = name.replace(/[^a-zA-Z0-9._-]/g, '_');
  if (!/\.(png|jpe?g|webp|svg|gif|avif)$/i.test(name)) name += '.png';
  // dedupe by short hash of url
  return { url: u, dir, name };
}

const jobs = [];
for (const raw of list) {
  const { url, dir, name } = classify(raw);
  if (url.startsWith('data:')) continue;
  let fname = name;
  const existing = jobs.find((j) => j.fname === `${dir}/${fname}`);
  if (existing && existing.url !== url) {
    const h = Buffer.from(url).toString('base64url').slice(-8).replace(/[^a-zA-Z0-9]/g, '');
    fname = `${name.replace(/(\.[^.]+)$/, '')}-${h}$1`;
  }
  jobs.push({ raw, url, dir, fname: `${dir}/${fname}` });
}

const results = [];
let done = 0;
async function worker(queue) {
  while (queue.length) {
    const job = queue.shift();
    const dest = path.join(OUT, job.fname);
    try {
      const res = await fetch(job.url, { headers: { 'user-agent': 'Mozilla/5.0 chrome/131' } });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 40) throw new Error('too small ' + buf.length);
      fs.writeFileSync(dest, buf);
      manifest[job.raw] = { local: `/sites/${SITE}/shared/${job.fname.replace(/\\/g, '/')}`, bytes: buf.length, status: 'ok' };
      results.push(`OK ${job.fname} ${buf.length}b`);
    } catch (e) {
      manifest[job.raw] = { local: null, status: 'failed', error: String(e).slice(0, 120) };
      results.push(`FAIL ${job.fname} ${String(e).slice(0, 90)}`);
    }
    done++;
    if (done % 20 === 0) console.log(`  ${done}/${jobs.length}`);
  }
}
const q = [...jobs];
await Promise.all([worker(q), worker(q), worker(q), worker(q)]);
fs.writeFileSync(`docs/research/${SITE}/_asset-manifest.json`, JSON.stringify(manifest, null, 1));
const ok = Object.values(manifest).filter((m) => m.status === 'ok').length;
console.log(`DOWNLOADED ${ok}/${jobs.length}`);
console.log(results.filter((r) => r.startsWith('FAIL')).join('\n'));
