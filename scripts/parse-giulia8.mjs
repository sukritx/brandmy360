import fs from 'node:fs';
const dir = 'docs/research/brandmylaptop-com-284b5fbe/giulia-96b78fb0/sections-html';
const details = fs.readFileSync(`${dir}/18-y1199.html`, 'utf8');
const others = fs.readFileSync(`${dir}/20-y3150.html`, 'utf8');

// details section wrapper + grid
console.log('=== DETAILS SECTION HEAD ===');
console.log(details.slice(0, 1500).replace(/></g, '>\n<'));

const cards = [...details.matchAll(/<(?:section|article|div) class="[^"]*(?:rounded-2xl|rounded-3xl)[^"]*"[^>]*>/g)].map((m) => m[0].slice(0, 220));
console.log('\n=== CARD WRAPPERS ===');
cards.forEach((c) => console.log(' ', c));

// headings inside details
const heads = [...details.matchAll(/<h[23][^>]*>([^<]+)<\/h[23]>/g)].map((m) => m[1]);
console.log('\n=== DETAILS HEADINGS ===', JSON.stringify(heads));

// dl/dt/dd rows
const dl = [...details.matchAll(/<(dl|dt|dd|div)[^>]*class="[^"]*(?:flex|grid)[^"]*"[^>]*>/g)].slice(0, 14).map((m) => m[0].slice(0, 160));
console.log('\n=== ROW-ISH ELEMENTS ===');
dl.forEach((d) => console.log(' ', d));

// machine card rows
const machineIdx = details.indexOf('The machine');
console.log('\n=== MACHINE CARD ===');
console.log(details.slice(machineIdx - 400, machineIdx + 2200).replace(/></g, '>\n<').slice(0, 2600));

// others section head
console.log('\n=== OTHERS SECTION HEAD ===');
console.log(others.slice(0, 1400).replace(/></g, '>\n<'));
