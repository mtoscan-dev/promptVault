"use client";

import { Terminal } from "lucide-react";
import { useTranslations } from "next-intl";
import { BunkerHUD } from "./BunkerHUD";
import { SystemStats } from "./SystemStats";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useParams } from "next/navigation";

export function BunkerHeader() {
  const t = useTranslations("Common");
  const params = useParams();
  const locale = params?.locale || "en";

  return (
    <header className="border-b border-(--border-primary) bg-(--bg-surface)/50 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-[1600px] mx-auto px-4 py-1">
        <div className="flex items-center justify-between gap-4">
          {/* Brand & Stats */}
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="flex items-center gap-2 text-(--acc-primary) group"
            >
              <div className="p-1.5 bg-(--acc-primary-glow) rounded border border-(--acc-primary)/20 group-hover:border-(--acc-primary) transition-colors">
                <Terminal size={18} />
              </div>
              <div className="flex flex-col -space-y-1">
                <span className="text-sm font-bold tracking-tighter uppercase whitespace-nowrap">
                  {t("title")}
                </span>
                <span className="text-[9px] opacity-50 font-mono tracking-[0.2em]">
                  SOVEREIGN_OS v1.0
                </span>
              </div>
            </Link>

            <div className="hidden lg:block">
              <SystemStats />
            </div>
          </div>

          {/* HUD Navigation */}
          <div className="flex-1 max-w-4xl px-4">
            <BunkerHUD />
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <Link
              href={`/${locale}/vault?new=true`}
              className="flex items-center gap-2 px-3 py-1 bg-green-600/10 hover:bg-green-600/20 text-green-400 border border-green-600/30 rounded transition-colors group"
              title={t("newPrompt")}
            >
              <Plus
                size={14}
                className="group-hover:scale-110 transition-transform"
              />
              <span className="text-[10px] font-mono hidden sm:inline font-bold uppercase tracking-wider">
                {t("prompt")}
              </span>
            </Link>
            <div className="h-4 w-px bg-gray-700 mx-1" />
            <LocaleSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
