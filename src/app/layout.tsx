import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Prima Wijayakusuma — Innovation Practitioner and Technopreneur",
  description:
    "Prima Wijayakusuma is an Innovation Practitioner and Technopreneur working in engineering research, electronics, electromagnetic applications, and smart technology systems.",
  keywords: [
    "Prima Wijayakusuma",
    "innovation practitioner",
    "technopreneur",
    "IoT",
    "smart electronics",
    "TerraGrow",
    "SEHATIN",
    "Beijing Institute of Technology",
  ],
  openGraph: {
    title: "Prima Wijayakusuma — Innovation Practitioner and Technopreneur",
    description:
      "Engineering research, smart electronics, and sustainable innovation. Awarded by KIPA and MINDS; published in IEEE Xplore and HardwareX.",
    type: "profile",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="font-sans">{children}</body>
    </html>
  );
}
