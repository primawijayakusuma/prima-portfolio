import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const SITE = "https://primawijayakusuma.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: "Prima Wijayakusuma — Engineer & Innovation Practitioner",
  description:
    "Engineer and innovation practitioner working across electronics, wireless systems, intelligent sensing, AI, biomedical technology, and product development.",
  keywords: [
    "Prima Wijayakusuma",
    "engineer",
    "innovation practitioner",
    "technology builder",
    "AIoT",
    "smart electronics",
    "intelligent sensing",
    "deep tech",
    "TerraGrow",
    "NOVA",
    "Medivue",
    "SEHATIN",
    "HardwareX",
    "Beijing Institute of Technology",
  ],
  authors: [{ name: "Prima Wijayakusuma", url: SITE }],
  openGraph: {
    title: "Prima Wijayakusuma — Engineer & Innovation Practitioner",
    description:
      "Turning scientific and engineering ideas into technologies that can be built, tested, validated, and developed toward real-world products.",
    url: SITE,
    siteName: "Prima Wijayakusuma",
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: "Prima Wijayakusuma — Engineer & Innovation Practitioner",
    description:
      "Engineer, innovation practitioner, and technology builder working across AIoT, smart electronics, intelligent sensing, and deep tech.",
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
      className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
