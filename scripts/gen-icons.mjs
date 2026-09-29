import fs from 'node:fs';
const svgs = JSON.parse(fs.readFileSync('docs/research/brandmylaptop-com-284b5fbe/_svgs.json', 'utf8'));
const byKey = Object.fromEntries(svgs.map((s) => [s.key, s]));

const NAMES = {
  '2ffe2094f0': ['ChevronLeftIcon', 'M10 3 5 8l5 5'],
  '418ba049fb': ['ChevronRightIcon', 'm6 3 5 5-5 5'],
  '8c20faa1c2': ['LinkedInIcon', 'linkedin'],
  '992fb408f8': ['TikTokIcon', 'tiktok'],
  '308dc478c1': ['InstagramIcon', 'instagram'],
  'bf403ccb37': ['YouTubeIcon', 'youtube'],
  '0771ce56f8': ['AppleLogoLightIcon', 'apple light'],
  'd6e79988b2': ['XIcon', 'x'],
  '48c16d0378': ['FilterIcon', 'filter'],
  '51c767f204': ['ChevronDownSmallIcon', 'chevron down small'],
  'c7f8ebbeaa': ['CameraIcon', 'camera'],
  '197353dd55': ['TwitchIcon', 'twitch'],
  '2079408d51': ['AppleLogoDarkIcon', 'apple dark'],
  'c7317b75c4': ['ChevronDownLargeIcon', 'chevron down large'],
  'dcb800d82c': ['SelectChevronIcon', 'select chevron'],
  '0c3872d046': ['XBlackIcon', 'x black'],
  '4265dcd59e': ['LinkedInBrandIcon', 'linkedin brand'],
};

// class-name overrides: keep the class from the source but allow props
const convert = (svg, name) => {
  let s = svg;
  // Remove the className (callers pass their own)
  s = s.replace(/\s*class="[^"]*"/, '');
  s = s.replace(/stroke-width=/g, 'strokeWidth=');
  s = s.replace(/stroke-linecap=/g, 'strokeLinecap=');
  s = s.replace(/stroke-linejoin=/g, 'strokeLinejoin=');
  s = s.replace(/fill-rule=/g, 'fillRule=');
  s = s.replace(/clip-rule=/g, 'clipRule=');
  s = s.replace(/viewbox=/gi, 'viewBox=');
  s = s.replace(/\s*aria-hidden="[^"]*"/, '');
  // self-close voids
  for (const tag of ['path', 'circle', 'rect', 'line', 'polyline', 'polygon', 'ellipse', 'use']) {
    s = s.replace(new RegExp(`<${tag}\\b([^>]*?)(?<!/)>`, 'g'), (m, attrs) => `<${tag}${attrs} />`);
  }
  // spread props
  s = s.replace(/^<svg/, '<svg {...props}');
  return s;
};

let out = `import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

`;
for (const [key, [name, note]] of Object.entries(NAMES)) {
  const s = byKey[key];
  if (!s) {
    console.log('MISSING', key, name);
    continue;
  }
  out += `// ${note}\n`;
  out += `export function ${name}(props: IconProps) {\n  return (\n    ${convert(s.svg, name)}\n  );\n}\n\n`;
}
fs.writeFileSync('src/components/sites/brandmylaptop-com-284b5fbe/shared/icons.tsx', out);
console.log('wrote icons.tsx', out.length);
