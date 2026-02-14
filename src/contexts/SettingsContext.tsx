"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type ExportLanguage = "original" | "en" | "es" | "fr" | "de" | "ja";

interface SettingsContextType {
  exportLanguage: ExportLanguage;
  setExportLanguage: (lang: ExportLanguage) => void;
  // Future settings can go here
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [exportLanguage, setExportLanguageState] =
    useState<ExportLanguage>("original");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Load from localStorage on mount
    const savedLang = localStorage.getItem(
      "vault_export_language",
    ) as ExportLanguage;
    if (savedLang) {
      setExportLanguageState(savedLang);
    }
    setMounted(true);
  }, []);

  const setExportLanguage = (lang: ExportLanguage) => {
    setExportLanguageState(lang);
    localStorage.setItem("vault_export_language", lang);
  };

  // Prevent hydration mismatch by not rendering until mounted if needed,
  // currently we just provide default.

  return (
    <SettingsContext.Provider value={{ exportLanguage, setExportLanguage }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
