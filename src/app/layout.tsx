import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Laptop ad space marketplace — sell spots on your lid",
  description:
    "Creators sell the sticker spots on their lid. Brands buy them. Print stickers, print money.",
  icons: {
    icon: [
      { url: "/sites/brandmylaptop-com-284b5fbe/shared/seo/favicon-32x32.png", sizes: "32x32" },
      { url: "/sites/brandmylaptop-com-284b5fbe/shared/seo/favicon-16x16.png", sizes: "16x16" },
      { url: "/sites/brandmylaptop-com-284b5fbe/shared/seo/icon-192.png", sizes: "192x192" },
    ],
    shortcut: "/sites/brandmylaptop-com-284b5fbe/shared/seo/favicon.ico",
    apple: "/sites/brandmylaptop-com-284b5fbe/shared/seo/apple-touch-icon.png",
    other: { rel: "manifest", url: "/sites/brandmylaptop-com-284b5fbe/shared/seo/site.webmanifest" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="has-ads has-ad-rails">{children}</body>
    </html>
  );
}
