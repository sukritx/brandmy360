import fs from 'node:fs';
const c = fs.readFileSync('docs/research/brandmylaptop-com-284b5fbe/root-7280be29/grid-card-full.html', 'utf8');
// sticker img tags
const imgs = [...c.matchAll(/<img[^>]*class="[^"]*drop-shadow[^"]*"[^>]*>/g)].map((m) => m[0]);
console.log('=== sticker img tags ===');
imgs.slice(0, 3).forEach((i) => console.log(i, '\n'));
// label spans
const spans = [...c.matchAll(/<span class="max-w-full text-center[^>]*>.*?<\/span>/g)].map((m) => m[0]);
console.log('=== label spans ===');
spans.slice(0, 3).forEach((s) => console.log(s, '\n'));
// apple svg
const svg = c.match(/<svg[^>]*viewBox="0 0 24 24"[^>]*>.*?<\/svg>/s);
console.log('=== apple svg ===');
console.log(svg ? svg[0] : 'none');
// sticker top img + wrapper
const brandSticker = c.match(/<img[^>]*brandmylaptop[^>]*>/);
console.log('=== brandmy sticker ===');
console.log(brandSticker ? brandSticker[0] : 'none');
// the lid outer + inner style attrs
const outer = c.match(/<div class="absolute inset-0 m-auto[^>]*>/);
console.log('=== lid outer ===');
console.log(outer ? outer[0] : 'none');
const inner = c.match(/<div class="relative flex min-h-0 w-full shrink-0[^>]*>/);
console.log('=== lid inner ===');
console.log(inner ? inner[0] : 'none');
const grid = c.match(/<div class="relative flex-1 min-h-0 grid[^>]*>/);
console.log('=== grid ===');
console.log(grid ? grid[0] : 'none');
