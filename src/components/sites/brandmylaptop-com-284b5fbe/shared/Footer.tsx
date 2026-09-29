import Link from "next/link";

import { CurrencySelect } from "./CurrencySelect";

export function Footer() {
  return (
    <footer className="border-t border-hairline">
      <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
      <div className="max-w-xs">
      <Link className="flex items-center gap-2.5 text-[15px] font-semibold tracking-[-0.01em]" href="/">
      <img src="/sites/brandmylaptop-com-284b5fbe/shared/media/logo-small.1zmf4nfgeac61.png" alt="" width={256} height={171} className="h-7 w-auto" />BrandMyLaptop</Link>
      <p className="mt-3 text-[15px] font-medium tracking-[-0.01em]">Print stickers, print money.</p>
      <div className="mt-5 flex items-center gap-2 text-[13px] text-ink-2">built by<img src="/sites/brandmylaptop-com-284b5fbe/shared/media/vincent.2710md5e2w-ud.webp" alt="" width={1424} height={1424} className="h-5 w-5 rounded-full object-cover" />
      <span className="font-medium text-ink">Vincent</span>
      <a href="https://x.com/vynsedev" target="_blank" rel="noopener noreferrer" aria-label="Vincent on X" className="ml-1 transition-colors hover:text-ink">
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3.5 w-3.5 shrink-0">
        <path fill="#000000" d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932zM17.61 20.644h2.039L6.486 3.24H4.298z" />
        
        </svg>
      </a>
      <a href="https://www.linkedin.com/in/vynse/" target="_blank" rel="noopener noreferrer" aria-label="Vincent on LinkedIn" className="transition-colors hover:text-ink">
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3.5 w-3.5 shrink-0">
        <path fill="#0A66C2" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        
        </svg>
      </a>
      </div>
      <p className="mt-4 max-w-[34ch] text-[12px] leading-relaxed text-ink-2">Started as <a href="https://brandmymac.com?ref=bml-footer" target="_blank" rel="noopener noreferrer" className="font-medium text-ink hover:underline">BrandMyMac</a> — one MacBook, twenty sticker spots, $9,690 raised, goal passed 327%. This is that, for everybody else.</p>
      </div>
      <nav className="flex flex-wrap gap-10 sm:gap-16">
      <div>
      <h2 className="text-[13px] font-medium">Marketplace</h2>
      <ul className="mt-3 space-y-2 text-[13px] text-ink-2">
      <li>
      <Link className="hover:text-ink" href="/">All laptops</Link>
      </li>
      <li>
      <a className="hover:text-ink" href="/sell">Sell your laptop</a>
      </li>
      <li>
      <a className="hover:text-ink" href="/brands">Brands buying here</a>
      </li>
      <li>
      <a className="hover:text-ink" href="/stats">Stats</a>
      </li>
      <li>
      <a className="hover:text-ink" href="/sponsor">Sponsor the site</a>
      </li>
      <li>
      <a className="hover:text-ink" href="/campaign">Book sticker spots</a>
      </li>
      <li>
      <a className="hover:text-ink" href="/dashboard">Your dashboard</a>
      </li>
      </ul>
      </div>
      <div>
      <h2 className="text-[13px] font-medium">About</h2>
      <ul className="mt-3 space-y-2 text-[13px] text-ink-2">
      <li>
      <Link className="hover:text-ink" href="/#how">How it works</Link>
      </li>
      <li>
      <Link className="hover:text-ink" href="/#faq">Questions</Link>
      </li>
      <li>
      <a className="hover:text-ink" href="/newsletter">Newsletter</a>
      </li>
      </ul>
      </div>
      <div>
      <h2 className="text-[13px] font-medium">Laptops</h2>
      <ul className="mt-3 space-y-2 text-[13px] text-ink-2">
      <li>
      <a className="hover:text-ink" href="/laptops">All laptops</a>
      </li>
      <li>
      <a className="hover:text-ink" href="/laptops/coworking-spaces-and-cafes">In coworking spaces</a>
      </li>
      <li>
      <a className="hover:text-ink" href="/laptops/conferences-and-meetups">At conferences</a>
      </li>
      <li>
      <a className="hover:text-ink" href="/laptops/business-travel">On business travel</a>
      </li>
      <li>
      <a className="hover:text-ink" href="/laptops/client-and-investor-meetings">In client meetings</a>
      </li>
      <li>
      <a className="hover:text-ink" href="/laptops/campuses-and-universities">On campus</a>
      </li>
      <li>
      <a className="hover:text-ink" href="/laptops/creators-posting-in-public">Posting in public</a>
      </li>
      </ul>
      </div>
      </nav>
      </div>
      <div className="mt-12 flex flex-col gap-4 border-t border-hairline pt-6 sm:flex-row sm:items-center sm:justify-between">
      <p className="max-w-[64ch] text-[12px] leading-relaxed text-ink-2">Stickers are paid placements, not endorsements. BrandMyLaptop is not affiliated with, endorsed by or sponsored by Apple{"\u00a0"}Inc. or any laptop manufacturer.</p>
      <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-2 sm:shrink-0">
      <CurrencySelect />
      <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] text-ink-2">
      <a className="hover:text-ink" href="/terms">Terms</a>
      <a className="hover:text-ink" href="/privacy">Privacy</a>
      <a className="hover:text-ink" href="/legal">Legal</a>
      <a href="mailto:vincent@brandmylaptop.com" className="hover:text-ink">Contact</a>
      </nav>
      </div>
      </div>
      <ul className="mt-8 flex flex-wrap items-center gap-3">
      <li>
      <a href="https://www.uneed.best/tool/brandmylaptop" title="Uneed Product of the Day" target="_blank" rel="noopener noreferrer" className="block opacity-80 transition-opacity hover:opacity-100">
      <img src="/sites/brandmylaptop-com-284b5fbe/shared/badges/POTD1A.png" alt="Uneed Product of the Day" width={179} height={48} className="h-12 w-auto max-w-full" />
      </a>
      </li>
      <li>
      <a href="https://www.producthunt.com/products/brandmylaptop?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-brandmylaptop" title="BrandMyLaptop on Product Hunt" target="_blank" rel="noopener noreferrer" className="block opacity-80 transition-opacity hover:opacity-100">
      <img src="/sites/brandmylaptop-com-284b5fbe/shared/badges/featured.svg" alt="BrandMyLaptop on Product Hunt" width={250} height={54} className="h-12 w-auto max-w-full" />
      </a>
      </li>
      <li>
      <a href="https://www.tinyshelf.co/?ref=brandmylaptop.com" title="Featured on tinyshelf" target="_blank" rel="noopener noreferrer" className="block opacity-80 transition-opacity hover:opacity-100">
      <img src="/sites/brandmylaptop-com-284b5fbe/shared/badges/tinyshelf-badge-light-5ca4026a.svg" alt="Featured on tinyshelf" width={216} height={64} className="h-12 w-auto max-w-full" />
      </a>
      </li>
      <li>
      <a href="https://yourwebsitescore.com/certified-websites/brandmylaptop.com" title="Monitor your website with YourWebsiteScore" target="_blank" rel="noopener noreferrer" className="block opacity-80 transition-opacity hover:opacity-100">
      <img src="/sites/brandmylaptop-com-284b5fbe/shared/badges/brandmylaptop.com.svg" alt="Monitor your website with YourWebsiteScore" width={238} height={50} className="h-12 w-auto max-w-full" />
      </a>
      </li>
      <li>
      <a href="https://startupfa.me/s/brandmylaptop?utm_source=brandmylaptop.com" title="BrandMyLaptop - Startup Fame Highlight" target="_blank" rel="noopener noreferrer" className="block opacity-80 transition-opacity hover:opacity-100">
      <img src="/sites/brandmylaptop-com-284b5fbe/shared/badges/highlight-badge.webp" alt="BrandMyLaptop - Startup Fame Highlight" width={228} height={54} className="h-12 w-auto max-w-full" />
      </a>
      </li>
      <li>
      <a href="https://tinylaunch.com" title="TinyLaunch — launching soon" target="_blank" rel="noopener noreferrer" className="block opacity-80 transition-opacity hover:opacity-100">
      <img src="/sites/brandmylaptop-com-284b5fbe/shared/badges/tinylaunch-badge.svg" alt="TinyLaunch — launching soon" width={158} height={48} className="h-12 w-auto max-w-full" />
      </a>
      </li>
      </ul>
      </div>
    </footer>
  );
}
