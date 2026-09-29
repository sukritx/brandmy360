import fs from 'node:fs';
const dir = 'docs/research/brandmylaptop-com-284b5fbe/giulia-96b78fb0/sections-html';
const header = fs.readFileSync(`${dir}/17-y53.html`, 'utf8');

const show = (label, re, limit = 2500) => {
  const m = header.match(re);
  console.log(`\n=== ${label} ===`);
  console.log(m ? m[0].replace(/></g, '>\n<').slice(0, limit) : 'NOT FOUND');
};

show('VIEWS LINE', /<p[^>]*>[\s\S]{0,400}?views on this lid[\s\S]{0,300}?<\/p>/);
show('H1', /<h1[\s\S]{0,600}?<\/h1>/);
show('PROGRESS + SOLD LINE', /4\s200[\s\S]{0,1200}?goal passed[\s\S]{0,900}?<\/div>/);
show('AUTHOR ROW', /giutheginger[\s\S]{0,200}?100[\s\S]{0,2600}?Share[\s\S]{0,400}?<\/button>/);
show('TAGS ROW', /For sale[\s\S]{0,1800}?This lid is closed/);
