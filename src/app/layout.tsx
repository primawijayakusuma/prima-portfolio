import type { Metadata, Viewport } from "next";
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

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#070b14" },
  ],
};

// Runs before first paint so the saved (or system) theme never flashes.
const themeInit = `(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.dataset.theme=t}catch(e){}})();`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: "Prima Wijayakusuma — Product Engineer & Human-Centric Product Developer",
  description:
    "Product engineer and human-centric product developer working across electronics, wireless systems, intelligent sensing, AI, biomedical technology, and product development.",
  keywords: [
    "Prima Wijayakusuma",
    "product engineer",
    "engineer",
    "human-centric product developer",
    "hardware product development",
    "EVT DVT PVT",
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
    title: "Prima Wijayakusuma — Product Engineer & Human-Centric Product Developer",
    description:
      "Turning scientific and engineering ideas into technologies that can be built, tested, validated, and developed toward real-world products.",
    url: SITE,
    siteName: "Prima Wijayakusuma",
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: "Prima Wijayakusuma — Product Engineer & Human-Centric Product Developer",
    description:
      "Product engineer, human-centric product developer, and technology builder working across AIoT, smart electronics, intelligent sensing, and deep tech.",
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
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
