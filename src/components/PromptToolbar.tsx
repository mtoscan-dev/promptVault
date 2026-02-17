import { useRef, useEffect } from "react";
import { Languages, BarChart2, Sparkles } from "lucide-react";
import { cn } from "@/utils/cn";
import { useTranslations } from "next-intl";
import { SystemMonitor } from "./SystemMonitor";

interface PromptToolbarProps {
  onTranslate: () => void;
  onAnalyze: () => void;
  onAutoSuggest: () => void;
  translateProcess: any;
  analyzeProcess: any;
  suggestProcess: any;
  hasContent: boolean;
  isTranslated?: boolean;
  hasMetadata?: boolean;
  className?: string;
}

export function PromptToolbar({
  onTranslate,
  onAnalyze,
  onAutoSuggest,
  translateProcess,
  analyzeProcess,
  suggestProcess,
  hasContent,
  isTranslated,
  hasMetadata,
  className,
}: PromptToolbarProps) {
  const t = useTranslations("Editor");

  const isAnyProcessing =
    translateProcess.isProcessing ||
    analyzeProcess.isProcessing ||
    suggestProcess.isProcessing;

  const currentStatusMessage =
    (translateProcess.isProcessing && translateProcess.currentMessage) ||
    (analyzeProcess.isProcessing && analyzeProcess.currentMessage) ||
    (suggestProcess.isProcessing && suggestProcess.currentMessage) ||
    null;

  return (
    <div
      className={cn(
        "absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-50 pointer-events-none",
        className,
      )}
    >
      {/* Holographic Island - Pointer events re-enabled for children */}
      <div className="pointer-events-auto flex items-center gap-1 p-1.5 bg-black/60 dark:bg-black/40 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl ring-1 ring-white/5 transition-all duration-300 hover:bg-black/70 hover:scale-[1.01] hover:ring-white/10">
        {/* Translate Button */}
        <ToolbarButton
          onClick={onTranslate}
          disabled={translateProcess.isProcessing || isTranslated}
          isActive={translateProcess.isProcessing}
          icon={Languages}
          title={isTranslated ? t("alreadyTranslated") : t("translate")}
          color="blue"
        />

        {/* Analyze Button */}
        <ToolbarButton
          onClick={onAnalyze}
          disabled={analyzeProcess.isProcessing}
          isActive={analyzeProcess.isProcessing}
          icon={BarChart2}
          title={t("analyze")}
          color="purple"
        />

        {/* Auto-Suggest Button */}
        <ToolbarButton
          onClick={onAutoSuggest}
          disabled={suggestProcess.isProcessing || !hasContent || hasMetadata}
          isActive={suggestProcess.isProcessing}
          icon={Sparkles}
          title={hasMetadata ? t("metadataComplete") : t("autoSuggest")}
          color="yellow"
        />

        {/* Divider */}
        <div className="w-px h-6 bg-white/10 mx-1" />

        {/* System Monitor Integration */}
        <div className="pointer-events-none">
          <SystemMonitor
            isActive={isAnyProcessing}
            className="bg-transparent border-0 px-0 py-0"
          />
        </div>
      </div>

      {/* Floating Status Ticker - Only visible when processing */}
      <div
        className={cn(
          "pointer-events-none transition-all duration-500 ease-out overflow-hidden flex items-center justify-center",
          isAnyProcessing
            ? "opacity-100 translate-y-0 h-6"
            : "opacity-0 translate-y-2 h-0",
        )}
      >
        <div className="px-3 py-0.5 rounded-full bg-black/80 border border-white/10 text-[10px] font-mono tracking-widest text-green-400 uppercase shadow-lg backdrop-blur-md">
          {currentStatusMessage && (
            <span className="animate-pulse">
              {t("status.subroutine", { status: currentStatusMessage })}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

interface ToolbarButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isActive?: boolean;
  icon: any;
  title: string;
  color: "blue" | "purple" | "yellow";
}

function ToolbarButton({
  onClick,
  disabled,
  isActive,
  icon: Icon,
  title,
  color,
}: ToolbarButtonProps) {
  const colorStyles = {
    blue: "text-blue-400 group-hover:text-blue-300 group-hover:bg-blue-500/10 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]",
    purple:
      "text-purple-400 group-hover:text-purple-300 group-hover:bg-purple-500/10 hover:shadow-[0_0_15px_rgba(168,85,247,0.3)]",
    yellow:
      "text-yellow-400 group-hover:text-yellow-300 group-hover:bg-yellow-500/10 hover:shadow-[0_0_15px_rgba(234,179,8,0.3)]",
  };

  const activeStyles = {
    blue: "text-blue-400 bg-blue-500/10 shadow-[0_0_10px_rgba(59,130,246,0.5)] border-blue-500/30",
    purple:
      "text-purple-400 bg-purple-500/10 shadow-[0_0_10px_rgba(168,85,247,0.5)] border-purple-500/30",
    yellow:
      "text-yellow-400 bg-yellow-500/10 shadow-[0_0_10px_rgba(234,179,8,0.5)] border-yellow-500/30",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "group relative p-2 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 disabled:hover:scale-100 disabled:opacity-50 disabled:cursor-not-allowed",
        isActive ? activeStyles[color] : colorStyles[color],
      )}
      title={title}
    >
      <Icon
        size={18}
        className={cn(
          "transition-transform duration-500",
          isActive && "animate-spin-slow",
        )}
      />

      {/* Tooltip on Hover */}
      <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/90 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none backdrop-blur border border-white/10">
        {title}
      </span>
    </button>
  );
}
