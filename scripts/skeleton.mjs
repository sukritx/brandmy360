import fs from 'node:fs';
const file = process.argv[2];
const limit = Number(process.argv[3] || 140);
const c = fs.readFileSync(file, 'utf8');
let depth = 0;
const out = [];
const re = /<(\/?)([a-z0-9-]+)([^>]*)>/gi;
let m;
const voidTags = new Set(['img', 'input', 'br', 'path', 'meta', 'link', 'source', 'circle', 'rect', 'line', 'polyline', 'polygon', 'use', 'stop', 'hr', 'ellipse']);
while ((m = re.exec(c))) {
  const full = m[0];
  const close = m[1];
  const tag = m[2];
  const attrs = m[3];
  if (close) {
    depth--;
    continue;
  }
  const clsM = attrs.match(/class="([^"]*)"/);
  const cls = clsM ? clsM[1] : '';
  const styleM = attrs.match(/style="([^"]*)"/);
  const style = styleM ? ' | style:' + styleM[1].slice(0, 90) : '';
  const selfClose = /\/>$/.test(full) || voidTags.has(tag.toLowerCase());
  out.push('  '.repeat(Math.max(0, depth)) + tag + ' .' + cls.split(' ').slice(0, 7).join('.').slice(0, 100) + style);
  if (!selfClose) depth++;
}
console.log(out.slice(0, limit).join('\n'));
console.log('...total lines:', out.length);
