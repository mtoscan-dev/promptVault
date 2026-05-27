import { useState, useEffect, useRef } from "react";
import { cn } from "@/utils/cn";
import { useTranslations } from "next-intl";
import { Cpu, Zap, Radio } from "lucide-react";
import { getSystemStatus } from "@/app/actions/ai";

interface SystemMonitorProps {
  isActive: boolean;
  className?: string;
}

interface SystemStatus {
  ollama: {
    online: boolean;
    model: string | null;
    memoryMB: number;
    modelLoaded: boolean;
    gpuPercent: number;
  };
}

const POLL_INTERVAL_MS = 10_000; // 10 seconds

export function SystemMonitor({ isActive, className }: SystemMonitorProps) {
  const t = useTranslations("SystemMonitor");
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const [tokensPerSec, setTokensPerSec] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fetch real system status on mount + every 10s
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const result = await getSystemStatus();
        setStatus(result);
        setIsChecking(false);
      } catch {
        setStatus(null);
        setIsChecking(false);
      }
    };

    fetchStatus();
    intervalRef.current = setInterval(fetchStatus, POLL_INTERVAL_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Animated tokens/s when processing (simulated — real t/s requires streaming hooks)
  useEffect(() => {
    if (!isActive) {
      setTokensPerSec(0);
      return;
    }

    const id = setInterval(() => {
      setTokensPerSec(Math.floor(45 + Math.random() * 15));
    }, 200);

    return () => clearInterval(id);
  }, [isActive]);

  const memoryMB = status?.ollama.memoryMB ?? 0;
  const ollamaOnline = status?.ollama.online ?? false;
  const modelName = status?.ollama.model ?? null;
  const modelLoaded = status?.ollama.modelLoaded ?? false;
  const gpuPercent = status?.ollama.gpuPercent ?? 0;

  // Strip ":latest" suffix for cleaner display
  const displayModel = modelName?.replace(/:latest$/, "") ?? null;

  // Compute processor label: "GPU", "CPU", or "GPU/CPU" split
  const processorLabel = modelLoaded
    ? gpuPercent === 100
      ? "GPU"
      : gpuPercent === 0
        ? "CPU"
        : `GPU ${gpuPercent}%`
    : "—";

  return (
    <div
      className={cn(
        "flex items-center gap-3 px-3 py-1.5 bg-black/40 border border-white/5 rounded-md backdrop-blur-sm",
        className,
      )}
    >
      {/* Processor — Ollama GPU/CPU split */}
      <div className="flex flex-col min-w-[100px]">
        <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono mb-0.5 tracking-tighter">
          <span className="flex items-center gap-1">
            <Cpu size={10} />
            {t("neuralLoad")}
          </span>
          <span
            className={cn(
              "font-bold transition-colors duration-300",
              !modelLoaded
                ? "text-gray-500"
                : gpuPercent > 0
                  ? "text-green-400"
                  : "text-yellow-400",
            )}
          >
            {processorLabel}
          </span>
        </div>
        <div className="h-1 bg-white/10 rounded-full overflow-hidden w-full relative">
          <div
            className={cn(
              "absolute left-0 top-0 h-full transition-all duration-700 ease-out",
              !modelLoaded
                ? "bg-gray-600"
                : gpuPercent > 0
                  ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"
                  : "bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.6)]",
            )}
            style={{
              width: modelLoaded ? `${gpuPercent}%` : "0%",
            }}
          />
        </div>
      </div>

      {/* Vertical Separator */}
      <div className="w-px h-6 bg-white/10" />

      {/* Context Memory — Real Ollama Model Memory */}
      <div className="flex flex-col min-w-[100px]">
        <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono mb-0.5 tracking-tighter">
          <span className="flex items-center gap-1">
            <Zap size={10} />
            {t("memory")}
          </span>
          <span className="text-blue-400 transition-colors">
            {memoryMB > 0 ? `${memoryMB}MB` : "—"}
          </span>
        </div>
        <div className="flex gap-0.5 h-1 items-end w-full">
          {/* Binary-like visualization bars — scaled relative to 4GB max */}
          {Array.from({ length: 16 }).map((_, i) => {
            const active = memoryMB > 0 && i < (memoryMB / 4096) * 16;
            return (
              <div
                key={i}
                className={cn(
                  "flex-1 rounded-sm transition-colors duration-200",
                  active
                    ? "bg-blue-500 shadow-[0_0_4px_rgba(59,130,246,0.5)] h-full"
                    : "bg-white/5 h-[2px]",
                )}
              />
            );
          })}
        </div>
      </div>

      {/* Vertical Separator */}
      <div className="w-px h-6 bg-white/10" />

      {/* LLM Status — Real Ollama Connectivity */}
      <div className="flex items-center gap-2">
        {isChecking ? (
          // Checking state
          <div className="flex items-center gap-1.5 animate-pulse">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.5)]" />
            <span className="text-[10px] font-mono text-amber-400 tracking-tighter whitespace-nowrap">
              {t("checking")}
            </span>
          </div>
        ) : ollamaOnline ? (
          // Online — show model name
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.5)] animate-pulse" />
            <span className="text-[10px] font-mono text-green-400 tracking-tighter whitespace-nowrap">
              {displayModel || t("online")}
            </span>
          </div>
        ) : (
          // Offline — error state
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.5)]" />
            <span className="text-[10px] font-mono text-red-400 tracking-tighter whitespace-nowrap">
              {t("offline")}
            </span>
          </div>
        )}
      </div>

      {/* Active Processing Indicator (animated tokens/s) */}
      {isActive && (
        <div className="flex items-center gap-2 pl-2 border-l border-white/10 animate-pulse">
          <Radio size={12} className="text-red-400" />
          <span className="text-[10px] font-mono text-red-400 font-bold whitespace-nowrap tracking-tighter">
            {tokensPerSec} T/s
          </span>
        </div>
      )}
    </div>
  );
}
