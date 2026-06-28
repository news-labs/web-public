import { Inter } from "next/font/google";
import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CookieConsentBanner } from "@/components/CookieConsentBanner";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AnalyticsLoader } from "@/components/AnalyticsLoader";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Newsfork — Government News Intelligence API",
    template: "%s | Newsfork",
  },
  description:
    "Real-time government news from 100+ countries. News-V scoring, semantic search, and edge-native REST API.",
  metadataBase: new URL("https://www.newsfork.com"),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-touch-icon.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.newsfork.com",
    siteName: "Newsfork",
    title: "Newsfork — Government News Intelligence API",
    description:
      "Real-time government news from 100+ countries. News-V scoring, semantic search, and edge-native REST API.",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "Newsfork" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@newsfork",
    creator: "@newsfork",
    images: ["/og-default.png"],
  },
};

const themeInitScript = `(function(){try{var t=localStorage.getItem('nf-theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d);}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className={`${inter.className} min-h-screen bg-background text-foreground antialiased`}>
        <ThemeProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <CookieConsentBanner />
          <AnalyticsLoader />
        </ThemeProvider>
      </body>
    </html>
  );
}
