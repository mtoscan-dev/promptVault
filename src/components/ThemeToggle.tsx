"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";

export function ThemeToggle() {
  const t = useTranslations("Common");
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    // Check local storage or system preference
    const savedTheme = localStorage.getItem("theme") as "dark" | "light" | null;
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";

    const initialTheme = savedTheme || systemTheme;
    setTheme(initialTheme);

    if (initialTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);

    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 border border-gray-100 hover:border-green-600/50 hover:bg-gray-800 rounded text-xs font-mono transition-all group dark:bg-gray-950 dark:border-gray-800"
      title={theme === "dark" ? t("themeLight") : t("themeDark")}
    >
      {theme === "dark" ? (
        <Sun size={14} className="text-yellow-500" />
      ) : (
        <Moon size={14} className="text-blue-400" />
      )}
      <span className="text-gray-400 group-hover:text-green-400 tracking-tighter">
        [ {theme === "dark" ? t("themeDark") : t("themeLight")} ]
      </span>
    </button>
  );
}
