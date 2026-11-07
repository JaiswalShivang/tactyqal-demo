import type { Metadata } from "next";
import {
  Bricolage_Grotesque,
  Instrument_Serif,
  Plus_Jakarta_Sans,
  JetBrains_Mono,
} from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tactyqal.com"),
  title: {
    default: "Tactyqal Labs — Empower Your Kid To Build The Next App",
    template: "%s | Tactyqal Labs",
  },
  description:
    "1:1 mentoring program where teens build full-stack apps in 8 weeks. Real projects, real revenue, university admission edge. Join the cohort.",
  keywords: [
    "teen startup",
    "no-code app development",
    "entrepreneurship for kids",
    "university admissions",
    "1:1 mentoring",
    "tactyqal labs",
  ],
  authors: [{ name: "Tactyqal Labs" }],
  creator: "Tactyqal Labs",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://tactyqal.com",
    siteName: "Tactyqal Labs",
    title: "Tactyqal Labs — Empower Your Kid To Build The Next App",
    description:
      "1:1 mentoring program where teens build full-stack apps in 8 weeks.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Tactyqal Labs — The Builder's Ticket",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tactyqal Labs — Empower Your Kid To Build The Next App",
    description:
      "1:1 mentoring program where teens build full-stack apps in 8 weeks.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${instrumentSerif.variable} ${plusJakarta.variable} ${jetbrainsMono.variable}`}
    >
      <body className="bg-paper text-ink font-sans min-h-screen antialiased">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
