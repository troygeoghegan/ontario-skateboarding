import type { Metadata } from "next";
import { Oswald, Barlow_Condensed } from "next/font/google";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import "./globals.css";

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  display: "swap",
});

const barlow = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-barlow",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Ontario Skateboarding | Halton & Ontario skate community",
    template: "%s | Ontario Skateboarding",
  },
  description:
    "Canadian skateboarding community based in Halton Region, Ontario. Events, shop, videos, and local scene.",
  metadataBase: new URL("https://ontarioskateboarding.ca"),
  openGraph: {
    title: "Ontario Skateboarding",
    description: "Halton Region skate community — events, shop, and blog.",
    url: "https://ontarioskateboarding.ca",
    siteName: "Ontario Skateboarding",
    locale: "en_CA",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-CA" className={`${oswald.variable} ${barlow.variable}`}>
      <body className="min-h-screen font-body antialiased">
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
