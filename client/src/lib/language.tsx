import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type SiteLanguage = "ID" | "EN";

interface LanguageContextValue {
  lang: SiteLanguage;
  setLang: (lang: SiteLanguage) => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<SiteLanguage>("ID");

  useEffect(() => {
    const saved = window.localStorage.getItem("site-lang");
    if (saved === "ID" || saved === "EN") {
      setLang(saved);
      return;
    }
    setLang("ID");
  }, []);

  useEffect(() => {
    window.localStorage.setItem("site-lang", lang);
    document.documentElement.lang = lang === "ID" ? "id" : "en";
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang }), [lang]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useSiteLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useSiteLanguage must be used within LanguageProvider");
  }
  return context;
}
