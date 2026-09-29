import fs from 'node:fs';
const c = fs.readFileSync('docs/research/brandmylaptop-com-284b5fbe/sell-826541f7/wiz-8-you.html', 'utf8');
const i = c.indexOf('mt-6 grid grid-cols-1');
console.log(c.slice(i, i + 3600).replace(/></g, '>\n<'));
const alerts = [...c.matchAll(/role="alert"[^>]*>([^<]*)</g)].map((m) => m[1]);
console.log('ALERTS:', JSON.stringify(alerts));
const inputs = [...c.matchAll(/<input[^>]*>/g)].map((m) => m[0].slice(0, 200));
console.log('INPUTS:', inputs.join('\n'));
