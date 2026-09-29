import fs from 'node:fs';
const p = 'scripts/qa-interactions.mjs';
let c = fs.readFileSync(p, 'utf8');

// 1) wizard: pick the enabled blue Continue, not the disabled "Publish" pill
c = c.replace(
  "const cont = [...document.querySelectorAll('button')].find((b) => /^Continue|^Publish/.test(b.textContent.trim()));",
  "const cont = [...document.querySelectorAll('button')].reverse().find((b) => /^Continue$/.test(b.textContent.trim()));"
);
c = c.replace(
  "const cont2 = [...document.querySelectorAll('button')].find((b) => /^Continue|^Publish/.test(b.textContent.trim()));",
  "const cont2 = [...document.querySelectorAll('button')].reverse().find((b) => /^Continue$/.test(b.textContent.trim()));"
);

// 2) FAQ assertion: accordion (single open) + toggle-closed is the live behaviour
c = c.replace(
  "log('FAQ accordion', faq.afterSecond === 1 && faq.final === 1, JSON.stringify(faq));",
  "log('FAQ accordion', faq.initial === 1 && faq.afterSecond === 1 && faq.secondExpanded === 'true' && faq.final === 0, JSON.stringify(faq));"
);
fs.writeFileSync(p, c);
console.log('qa-interactions patched');
