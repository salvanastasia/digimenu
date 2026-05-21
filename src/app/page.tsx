import { LanguageProvider } from "@/context/LanguageContext";
import { MenuApp } from "@/components/MenuApp";

export default function Home() {
  return (
    <LanguageProvider>
      <MenuApp />
    </LanguageProvider>
  );
}
