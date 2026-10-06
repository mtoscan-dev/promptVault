import { useState, useEffect, useRef } from "react";
import { cn } from "@/utils/cn";
import { useTranslations } from "next-intl";
import { Radio } from "lucide-react";
import { getSystemStatus } from "@/app/actions/ai";

interface SystemMonitorProps {
  isActive: boolean;
  className?: string;
}

interface SystemStatus {
  llm: {
    online: boolean;
    model: string | null;
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
      return;
    }

    const id = setInterval(() => {
      setTokensPerSec(Math.floor(45 + Math.random() * 15));
    }, 200);

    return () => {
      clearInterval(id);
      setTokensPerSec(0);
    };
  }, [isActive]);

  const llmOnline = status?.llm.online ?? false;
  const modelName = status?.llm.model ?? null;

  return (
    <div
      className={cn(
        "flex items-center gap-3 px-3 py-1.5 bg-black/40 border border-white/5 rounded-md backdrop-blur-sm",
        className,
      )}
    >
      {/* LLM Status — freeLLMAPI connectivity */}
      <div className="flex items-center gap-2">
        {isChecking ? (
          // Checking state
          <div className="flex items-center gap-1.5 animate-pulse">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.5)]" />
            <span className="text-[10px] font-mono text-amber-400 tracking-tighter whitespace-nowrap">
              {t("checking")}
            </span>
          </div>
        ) : llmOnline ? (
          // Online — show model name
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.5)] animate-pulse" />
            <span className="text-[10px] font-mono text-green-400 tracking-tighter whitespace-nowrap">
              {modelName || t("online")}
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
