import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { OrientationProvider } from "@/components/orientation/OrientationProvider";
import { site } from "@/data/site";
import { AccountProvider } from "@/lib/account/AccountProvider";
import "./globals.css";

const anton = localFont({ src: "../../node_modules/@fontsource/anton/files/anton-latin-400-normal.woff2", variable: "--font-anton", display: "swap" });
const inter = localFont({ src: "../../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2", variable: "--font-inter", weight: "100 900", display: "swap" });
const marker = localFont({ src: "../../node_modules/@fontsource/permanent-marker/files/permanent-marker-latin-400-normal.woff2", variable: "--font-marker", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — Pas de cinéma. Du concret.`, template: `%s · ${site.name}` },
  description: site.description,
  openGraph: { type: "website", locale: site.locale, siteName: site.name, title: `${site.name} — Pas de cinéma. Du concret.`, description: site.description },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#121212",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" data-scroll-behavior="smooth" className={`${anton.variable} ${inter.variable} ${marker.variable}`}>
      <body>
        <a href="#contenu" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-lime focus:px-4 focus:py-2 focus:text-black">
          Aller au contenu
        </a>
        <AccountProvider>
          <OrientationProvider>
            <Header />
            <main id="contenu">{children}</main>
            <Footer />
          </OrientationProvider>
        </AccountProvider>
      </body>
    </html>
  );
}
