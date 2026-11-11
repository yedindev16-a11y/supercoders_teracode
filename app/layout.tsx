import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0A1F0A",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ECOTERRA — Design the Sustainable Future",
  description:
    "An interactive sustainability platform exploring how cities can evolve toward a greener tomorrow. Design your future city, visualize impact, and discover solutions. Built for TERRACODE 2026.",
  keywords: [
    "sustainability",
    "green city",
    "eco",
    "climate",
    "TERRACODE",
    "future city",
    "interactive",
    "environment",
  ],
  openGraph: {
    title: "ECOTERRA — Design the Sustainable Future",
    description:
      "An interactive sustainability platform for TERRACODE 2026. Design your future city and visualize the impact.",
    type: "website",
    siteName: "ECOTERRA",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-eco-forest text-eco-off-white">
        {children}
      </body>
    </html>
  );
}
