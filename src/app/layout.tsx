import type { Metadata } from "next";
import { VT323, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";
import CRTOverlay from "./components/crt/CRTOverlay";
import BootSequence from "./components/crt/BootSequence";
import AboutDialog from "./components/crt/AboutDialog";

const vt323 = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-vt323",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NIKOLAI.SYS — Personal Terminal",
  description: "Personlig hjemmeside / e-portefølje (DOS edition)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nb" className={`${vt323.variable} ${ibmPlexMono.variable}`}>
      <body className="antialiased crt-on-desktop">
        <ThemeProvider>
          <BootSequence />
          <AboutDialog />
          {children}
          <CRTOverlay />
        </ThemeProvider>
      </body>
    </html>
  );
}
