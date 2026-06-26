import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "News-Labs — Government News Intelligence",
  description:
    "Real-time government news from around the world, powered by AI analysis and policy intelligence.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <style>{`
          :root {
            --nl-background: 0 0% 100%;
            --nl-foreground: 222 47% 11%;
            --nl-primary: 222 47% 11%;
            --nl-muted: 210 40% 96%;
            --nl-border: 214 32% 91%;
          }
        `}</style>
      </head>
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
