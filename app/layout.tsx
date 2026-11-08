import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;700;800&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@500;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
        />
      </head>
      <body className="bg-paper text-ink font-sans min-h-screen antialiased">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
