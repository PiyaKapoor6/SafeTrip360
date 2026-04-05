import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SafeTrip360 — Real-Time Global Safety Platform",
  description:
    "Monitor disaster risk, air quality, crime levels, and political unrest for any location worldwide. AI-powered travel safety recommendations.",
};

import ChatBot from "@/components/ChatBot";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`} suppressHydrationWarning>
        {children}
        <ChatBot />
        {/* Placeholder for Google Maps callback to prevent "initMap is not a function" error */}
        <script dangerouslySetInnerHTML={{ __html: `window.initMap = function() {};` }} />
        {/* Keyless Google Maps API for frontend */}
        <script src="https://cdn.jsdelivr.net/gh/somanchiu/Keyless-Google-Maps-API@v7.1/mapsJavaScriptAPI.js" async defer></script>
      </body>
    </html>
  );
}
