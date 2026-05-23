import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import { GOOGLE_FONTS_STYLESHEET } from "@/lib/google-fonts-url";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: {
    default: "DigiMenu — Menu digitale per ristoranti",
    template: "%s · DigiMenu",
  },
  description:
    "Menu digitale multilingue per ristoranti e locali. Brand personalizzato, preferiti, allergeni e dashboard centralizzata.",
  appleWebApp: {
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#560200",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className={`${manrope.variable} h-full`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link href={GOOGLE_FONTS_STYLESHEET} rel="stylesheet" />
      </head>
      <body className="min-h-full bg-[#f7f7f7] font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
