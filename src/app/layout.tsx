import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "Il menu digitale di aribrì",
  description:
    "Menu digitale di aribrì Ristorante Pizzeria B&B a San Pancrazio Salentino.",
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
      <body className="min-h-full bg-[#f7f7f7] font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
