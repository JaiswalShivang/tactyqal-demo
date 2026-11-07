import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const dangrek = localFont({
  src: "../public/fonts/Dangrek.woff2",
  variable: "--font-dangrek",
  display: "swap",
});

const outfit = localFont({
  src: "../public/fonts/Outfit.woff2",
  variable: "--font-outfit",
  display: "swap",
});

const plusJakarta = localFont({
  src: "../public/fonts/PlusJakartaSans.woff2",
  variable: "--font-plus-jakarta",
  display: "swap",
});

const jetbrainsMono = localFont({
  src: "../public/fonts/JetBrainsMono.woff2",
  variable: "--font-jetbrains",
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
      className={`${outfit.variable} ${dangrek.variable} ${plusJakarta.variable} ${jetbrainsMono.variable}`}
    >
      <body className="bg-paper text-ink font-body min-h-screen antialiased">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
