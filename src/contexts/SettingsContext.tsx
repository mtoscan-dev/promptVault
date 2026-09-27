"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { updateSetting } from "@/lib/actions/settings";
import type { getSettings } from "@/lib/actions/settings";

export type ExportLanguage = "original" | "en" | "es" | "fr" | "de" | "ja";

interface SettingsContextType {
  exportLanguage: ExportLanguage;
  setExportLanguage: (lang: ExportLanguage) => void;
  language: "en" | "es";
  setLanguage: (lang: "en" | "es") => void;
  notifications: boolean;
  toggleNotifications: () => void;
  reducedMotion: boolean;
  toggleReducedMotion: () => void;
  theme: string;
  setTheme: (theme: string) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
);

export function SettingsProvider({
  children,
  initialSettings,
}: {
  children: React.ReactNode;
  initialSettings?: Awaited<ReturnType<typeof getSettings>>;
}) {
  const [exportLanguage, setExportLanguageState] = useState<ExportLanguage>(
    (initialSettings?.exportLanguage as ExportLanguage) || "original",
  );
  const [language, setLanguageState] = useState<"en" | "es">(
    (initialSettings?.language as "en" | "es") || "en",
  );
  const [notifications, setNotifications] = useState<boolean>(
    initialSettings?.notifications ?? true,
  );
  const [reducedMotion, setReducedMotion] = useState<boolean>(
    initialSettings?.reducedMotion ?? false,
  );
  const [theme, setTheme] = useState<string>(
    initialSettings?.theme || "system",
  );

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const setLanguage = async (lang: "en" | "es") => {
    setLanguageState(lang);
    await updateSetting("language", lang);
  };

  const setExportLanguage = async (lang: ExportLanguage) => {
    // Optimistic Update
    setExportLanguageState(lang);
    await updateSetting("exportLanguage", lang);
  };

  const toggleNotifications = async () => {
    const newValue = !notifications;
    setNotifications(newValue);
    await updateSetting("notifications", newValue);
  };

  const toggleReducedMotion = async () => {
    const newValue = !reducedMotion;
    setReducedMotion(newValue);
    await updateSetting("reducedMotion", newValue);
  };

  const setThemePreference = async (newTheme: string) => {
    setTheme(newTheme);
    await updateSetting("theme", newTheme);
  };

  // Prevent hydration mismatch by not rendering until mounted if needed,
  // currently we just provide default.

  return (
    <SettingsContext.Provider
      value={{
        exportLanguage,
        setExportLanguage,
        language,
        setLanguage,
        notifications,
        toggleNotifications,
        reducedMotion,
        toggleReducedMotion,
        theme,
        setTheme: setThemePreference,
      }}
    >
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
