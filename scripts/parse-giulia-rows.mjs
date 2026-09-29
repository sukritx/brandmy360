import fs from 'node:fs';
const spots = fs.readFileSync('docs/research/brandmylaptop-com-284b5fbe/giulia-96b78fb0/sections-html/19-y2126.html', 'utf8');
const rows = [...spots.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)];
console.log('ROW 1:\n', rows[1][1].replace(/></g, '>\n<'));
console.log('\nTABLE HEAD:\n', rows[0][1].replace(/></g, '>\n<').slice(0, 900));
// find the section headings
const h2 = spots.match(/<h2[^>]*>([\s\S]*?)<\/h2>/);
const p = spots.match(/<p[^>]*>([^<]*This listing has closed[^<]*)<\/p>/);
console.log('\nh2:', h2 ? h2[1] : null);
console.log('p:', p ? p[1] : null);
console.log('\nsection class:', spots.slice(0, 300));
