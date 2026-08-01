import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const SITE_URL = "https://devalkotak.github.io";
const SITE_TITLE = "Deval Kotak";
const SITE_DESCRIPTION =
  "Application security engineer in Mumbai. I break systems to understand them, and build stronger ones. Writeups, tooling, and the work behind both.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s / Deval Kotak",
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_TITLE,
  authors: [{ name: "Deval Kotak", url: SITE_URL }],
  creator: "Deval Kotak",
  keywords: [
    "application security",
    "security engineer",
    "penetration testing",
    "security tooling",
    "Deval Kotak",
    "Mumbai",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: SITE_TITLE,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetBrainsMono.variable} antialiased`}>
        <Nav />
        <main className="min-h-screen pt-28 pb-12">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
