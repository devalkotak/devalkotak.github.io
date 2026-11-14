import type { Metadata } from "next";
import { Instrument_Sans, JetBrains_Mono } from "next/font/google";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import "./globals.css";

// One family for everything. Variable font, so the in-between weights the
// design uses (450 body, 650 headings) are real, not synthesised.
const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// Only for things that are literally code: the command palette and demos.
const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const SITE_URL = "https://devalkotak.github.io";
const SITE_TITLE = "Deval Kotak";
const SITE_DESCRIPTION =
  "Security engineer in Mumbai. Breaking systems to understand them, then building stronger ones. Writeups, tooling and the work behind both.";

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
    "security engineering",
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
      <body
        className={`${instrumentSans.variable} ${jetBrainsMono.variable} antialiased`}
      >
        <a
          href="#main"
          className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-background transition focus:translate-y-0"
        >
          Skip to content
        </a>
        <Nav />
        <main id="main" tabIndex={-1} className="min-h-screen pt-28 pb-12 outline-none">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
