import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Language, LocalText } from "@/lib/site-data";

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (text: LocalText) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("ar");

  useEffect(() => {
    const saved = window.localStorage.getItem("az-language");
    if (saved === "ar" || saved === "en") setLanguage(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    window.localStorage.setItem("az-language", language);
  }, [language]);

  const value = useMemo(
    () => ({ language, setLanguage, t: (text: LocalText) => text[language] }),
    [language],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}