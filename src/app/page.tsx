import type { Metadata } from "next";
import { LandingPage } from "@/components/landing/LandingPage";
import { JoinUsProvider } from "@/components/landing/JoinUsProvider";

export const metadata: Metadata = {
  title: "DigiMenu — Menu digitale per ristoranti",
  description:
    "Menu digitale multilingue per ristoranti e locali. Brand personalizzato, preferiti, allergeni e dashboard centralizzata.",
};

export default function Home() {
  return (
    <JoinUsProvider>
      <LandingPage />
    </JoinUsProvider>
  );
}
