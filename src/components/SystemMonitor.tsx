import { useState, useEffect, useRef } from "react";
import { cn } from "@/utils/cn";
import { useTranslations } from "next-intl";
import { Activity, Cpu, Zap, Radio } from "lucide-react";

interface SystemMonitorProps {
  isActive: boolean;
  className?: string;
}

export function SystemMonitor({ isActive, className }: SystemMonitorProps) {
  const t = useTranslations("SystemMonitor");
  const [cpuLoad, setCpuLoad] = useState(32);
  const [memoryUsage, setMemoryUsage] = useState(412);
  const [tokensPerSec, setTokensPerSec] = useState(0);

  useEffect(() => {
    let animationFrameId: number;
    let lastUpdate = 0;

    const updateMetrics = (time: number) => {
      if (time - lastUpdate > 100) {
        // Update every 100ms
        setCpuLoad((prev) => {
          const target = isActive
            ? 85 + (Math.random() * 10 - 5)
            : 32 + (Math.random() * 4 - 2);
          return prev + (target - prev) * 0.1;
        });

        setMemoryUsage((prev) => {
          const target = isActive
            ? 850 + (Math.random() * 50 - 25)
            : 412 + (Math.random() * 10 - 5);
          return Math.floor(prev + (target - prev) * 0.05);
        });

        if (isActive) {
          setTokensPerSec(Math.floor(45 + Math.random() * 15));
        } else {
          setTokensPerSec(0);
        }

        lastUpdate = time;
      }
      animationFrameId = requestAnimationFrame(updateMetrics);
    };

    animationFrameId = requestAnimationFrame(updateMetrics);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isActive]);

  return (
    <div
      className={cn(
        "flex items-center gap-3 px-3 py-1.5 bg-black/40 border border-white/5 rounded-md backdrop-blur-sm",
        className,
      )}
    >
      {/* Neural Load (CPU) */}
      <div className="flex flex-col min-w-[100px]">
        <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono mb-0.5 tracking-tighter">
          <span className="flex items-center gap-1">
            <Cpu size={10} />
            {t("neuralLoad")}
          </span>
          <span
            className={cn(
              "font-bold transition-colors duration-300",
              isActive ? "text-yellow-400" : "text-green-400",
            )}
          >
            {Math.round(cpuLoad)}%
          </span>
        </div>
        <div className="h-1 bg-white/10 rounded-full overflow-hidden w-full relative">
          <div
            className={cn(
              "absolute left-0 top-0 h-full transition-all duration-300 ease-out",
              isActive
                ? "bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.6)]"
                : "bg-green-500/50",
            )}
            style={{ width: `${cpuLoad}%` }}
          />
        </div>
      </div>

      {/* Vertical Separator */}
      <div className="w-px h-6 bg-white/10" />

      {/* Context Memory */}
      <div className="flex flex-col min-w-[100px]">
        <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono mb-0.5 tracking-tighter">
          <span className="flex items-center gap-1">
            <Zap size={10} />
            {t("memory")}
          </span>
          <span className="text-blue-400 transition-colors">
            {memoryUsage}MB
          </span>
        </div>
        <div className="flex gap-0.5 h-1 items-end w-full">
          {/* Binary-like visualization bars */}
          {Array.from({ length: 16 }).map((_, i) => {
            const active = i < (memoryUsage / 1000) * 16;
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

      {/* Optional: Active Processing Indicator */}
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
