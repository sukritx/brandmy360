import fs from 'node:fs';
const c = fs.readFileSync('docs/research/brandmylaptop-com-284b5fbe/briefs-dc03d02e/sections-html/07-y598.html', 'utf8');
const i = c.indexOf('At an event');
console.log(i >= 0 ? c.slice(Math.max(0, i - 700), i + 1500).replace(/></g, '>\n<') : 'NOT FOUND in capture');
