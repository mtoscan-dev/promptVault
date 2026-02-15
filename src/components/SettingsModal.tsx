"use client";

import React, { useState, useEffect } from "react";
import { X, Monitor, Sliders, Cpu, Save } from "lucide-react";
import { createPortal } from "react-dom";
import { useSettings } from "@/contexts/SettingsContext";
import { useTranslations } from "next-intl";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabId = "general" | "appearance" | "system";

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<TabId>("general");
  const [mounted, setMounted] = useState(false);

  // Use Context for Global State & Persistence
  const {
    exportLanguage,
    setExportLanguage,
    theme,
    setTheme,
    notifications,
    toggleNotifications,
    reducedMotion,
    toggleReducedMotion,
  } = useSettings();

  const t = useTranslations("Settings");

  useEffect(() => {
    setMounted(true);
    // Lock scroll when modal is open
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-[#0a0a0a]/90 border border-(--acc-primary)/30 rounded-lg shadow-[0_0_30px_-5px_var(--acc-primary-glow)] backdrop-blur-xl animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-md bg-(--acc-primary)/10 border border-(--acc-primary)/20">
              <Sliders size={18} className="text-(--acc-primary)" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-wider text-white uppercase">
                {t("title")}
              </h2>
              <p className="text-[10px] text-white/50 font-mono tracking-widest">
                SOVEREIGN CONTROL CENTER
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-md transition-colors text-white/70 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Tabs */}
          <div className="w-48 border-r border-white/10 bg-black/20 overflow-y-auto">
            <div className="flex flex-col p-2 gap-1">
              <TabButton
                id="general"
                label={t("tabs.general")}
                icon={Sliders}
                isActive={activeTab === "general"}
                onClick={() => setActiveTab("general")}
              />
              <TabButton
                id="appearance"
                label={t("tabs.appearance")}
                icon={Monitor}
                isActive={activeTab === "appearance"}
                onClick={() => setActiveTab("appearance")}
              />
              <TabButton
                id="system"
                label={t("tabs.system")}
                icon={Cpu}
                isActive={activeTab === "system"}
                onClick={() => setActiveTab("system")}
              />
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-6 overflow-y-auto bg-linear-to-br from-transparent to-(--acc-primary)/5">
            {activeTab === "general" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <SectionHeader
                  title={t("sections.core")}
                  description={t("sections.coreDesc")}
                />

                <div className="space-y-4">
                  <SettingRow
                    label={t("fields.language")}
                    description={t("fields.languageDesc")}
                  >
                    <select className="bg-black/40 border border-white/10 rounded px-3 py-1.5 text-xs text-white focus:border-(--acc-primary) outline-none transition-colors">
                      <option>English (US)</option>
                      <option>Español</option>
                    </select>
                  </SettingRow>

                  <SettingRow
                    label={t("fields.exportLanguage")}
                    description={t("fields.exportLanguageDesc")}
                  >
                    <select
                      value={exportLanguage}
                      onChange={(e) => setExportLanguage(e.target.value as any)}
                      className="bg-black/40 border border-white/10 rounded px-3 py-1.5 text-xs text-white focus:border-(--acc-primary) outline-none transition-colors"
                    >
                      <option value="original">{t("options.original")}</option>
                      <option value="en">{t("options.en")}</option>
                      <option value="es">{t("options.es")}</option>
                      <option value="fr">{t("options.fr")}</option>
                      <option value="de">{t("options.de")}</option>
                      <option value="ja">{t("options.ja")}</option>
                    </select>
                  </SettingRow>

                  <SettingRow
                    label={t("fields.notifications")}
                    description={t("fields.notificationsDesc")}
                  >
                    <ToggleSwitch
                      enabled={notifications}
                      onToggle={toggleNotifications}
                    />
                  </SettingRow>
                </div>
              </div>
            )}

            {activeTab === "appearance" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <SectionHeader
                  title={t("sections.visual")}
                  description={t("sections.visualDesc")}
                />

                <div className="space-y-4">
                  <SettingRow
                    label={t("fields.theme")}
                    description={t("fields.themeDesc")}
                  >
                    <div className="flex bg-black/40 rounded-lg p-1 border border-white/10 w-fit">
                      <button
                        onClick={() => setTheme("dark")}
                        className={`px-3 py-1 rounded text-xs transition-colors shadow-sm ${theme === "dark" || theme === "system" ? "bg-white/10 text-white" : "text-white/50 hover:text-white"}`}
                      >
                        {t("options.dark")}
                      </button>
                      <button
                        onClick={() => setTheme("light")}
                        className={`px-3 py-1 rounded text-xs transition-colors ${theme === "light" ? "bg-white/10 text-white" : "text-white/50 hover:text-white"}`}
                      >
                        {t("options.light")}
                      </button>
                    </div>
                  </SettingRow>

                  <SettingRow
                    label={t("fields.reducedMotion")}
                    description={t("fields.reducedMotionDesc")}
                  >
                    <ToggleSwitch
                      enabled={reducedMotion}
                      onToggle={toggleReducedMotion}
                    />
                  </SettingRow>
                </div>
              </div>
            )}

            {activeTab === "system" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <SectionHeader
                  title={t("sections.diagnostics")}
                  description={t("sections.diagnosticsDesc")}
                />

                <div className="grid grid-cols-2 gap-4">
                  <StatCard
                    label={t("stats.memory")}
                    value="45%"
                    status="normal"
                  />
                  <StatCard
                    label={t("stats.latency")}
                    value="24ms"
                    status="good"
                  />
                  <StatCard
                    label={t("stats.version")}
                    value="v1.0.4"
                    status="neutral"
                  />
                  <StatCard
                    label={t("stats.build")}
                    value="Stable"
                    status="good"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer - Modified: No Save Button */}
        <div className="p-4 border-t border-white/10 bg-black/40 flex justify-end gap-3">
          <div className="mr-auto flex items-center gap-2 text-[10px] text-(--acc-primary) opacity-80">
            <div className="w-1.5 h-1.5 rounded-full bg-(--acc-primary) animate-pulse" />
            LIVE SYNC ACTIVE
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-white/70 hover:text-white hover:bg-white/5 rounded-md transition-colors"
          >
            {t("actions.close")}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

// Subcomponents
function TabButton({
  id,
  label,
  icon: Icon,
  isActive,
  onClick,
}: {
  id: TabId;
  label: string;
  icon: any;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-md transition-all duration-200 group relative ${
        isActive
          ? "text-white bg-white/10 shadow-inner"
          : "text-white/50 hover:text-white hover:bg-white/5"
      }`}
    >
      {isActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-(--acc-primary) rounded-r-full shadow-[0_0_8px_var(--acc-primary)]" />
      )}
      <Icon
        size={16}
        className={
          isActive ? "text-(--acc-primary)" : "group-hover:text-white/80"
        }
      />
      <span>{label}</span>
    </button>
  );
}

function SectionHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="pb-2 border-b border-white/5">
      <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
      <p className="text-xs text-white/50">{description}</p>
    </div>
  );
}

function SettingRow({
  label,
  description,
  children,
}: {
  label: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <h4 className="text-sm font-medium text-white/90">{label}</h4>
        <p className="text-[10px] text-white/50">{description}</p>
      </div>
      <div>{children}</div>
    </div>
  );
}

function ToggleSwitch({
  enabled,
  onToggle,
}: {
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-(--acc-primary) focus:ring-offset-2 focus:ring-offset-black ${
        enabled ? "bg-(--acc-primary)" : "bg-white/20"
      }`}
    >
      <span className="sr-only">Use setting</span>
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          enabled ? "translate-x-4" : "translate-x-0"
        }`}
      />
    </button>
  );
}

function StatCard({
  label,
  value,
  status,
}: {
  label: string;
  value: string;
  status: "good" | "normal" | "neutral";
}) {
  const statusColor =
    status === "good"
      ? "text-green-400"
      : status === "normal"
        ? "text-amber-400"
        : "text-white/60";
  return (
    <div className="p-3 rounded-lg bg-black/40 border border-white/10 flex items-center justify-between">
      <span className="text-xs text-white/60">{label}</span>
      <span className={`text-sm font-bold font-mono ${statusColor}`}>
        {value}
      </span>
    </div>
  );
}
