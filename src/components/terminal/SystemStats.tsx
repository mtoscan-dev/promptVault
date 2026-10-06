"use client";

import { useEffect, useState } from "react";
import { Activity, Cpu, Database } from "lucide-react";
import { getSystemStatus } from "@/app/actions/ai";

const POLL_INTERVAL_MS = 10_000;

export function SystemStats() {
  const [stats, setStats] = useState({
    ram: 0,
    tps: 0,
    llm: "checking",
  });

  // Real LLM connectivity (freeLLMAPI), polled — RAM/T/s stay decorative (terminal aesthetic).
  useEffect(() => {
    let cancelled = false;

    const fetchStatus = async () => {
      try {
        const result = await getSystemStatus();
        if (cancelled) return;
        setStats((prev) => ({ ...prev, llm: result.llm.online ? "online" : "offline" }));
      } catch {
        if (!cancelled) setStats((prev) => ({ ...prev, llm: "offline" }));
      }
    };

    fetchStatus();
    const statusInterval = setInterval(fetchStatus, POLL_INTERVAL_MS);

    // Simulated telemetry for RAM/T-per-s (no real metric available from freeLLMAPI's API)
    const telemetryInterval = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        ram: Math.floor(Math.random() * (85 - 70) + 70), // 70-85% usage
        tps: Math.floor(Math.random() * (45 - 30) + 30), // 30-45 t/s
      }));
    }, 2000);

    return () => {
      cancelled = true;
      clearInterval(statusInterval);
      clearInterval(telemetryInterval);
    };
  }, []);

  return (
    <div className="flex items-center gap-4 px-3 py-1.5 bg-black/5 dark:bg-white/5 border border-(--border-primary) rounded text-[9px] font-mono text-(--text-secondary)">
      {/* LLM Status */}
      <div className="flex items-center gap-1.5">
        <div
          className={cn(
            "w-1.5 h-1.5 rounded-full animate-pulse",
            stats.llm === "online"
              ? "bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]"
              : "bg-red-500",
          )}
        />
        <span className="tracking-tighter">
          LLM_{stats.llm.toUpperCase()}
        </span>
      </div>

      <div
        className="h-full bg-(--border-primary) transition-all duration-500 ease-out"
        style={{ width: `${(stats.tps / 50) * 100}%` }}
      />
      {/* RAM Usage */}
      <div className="flex items-center gap-1.5">
        <Cpu size={10} className="text-cyan-500" />
        <span>RAM:{stats.ram}%</span>
      </div>

      <div
        className="h-full bg-(--border-primary) transition-all duration-500 ease-out"
        style={{ width: `${stats.ram}%` }}
      />
      {/* Performance */}
      <div className="flex items-center gap-1.5">
        <Activity size={10} className="text-amber-500" />
        <span>{stats.tps}T/S</span>
      </div>
    </div>
  );
}

// Helper function to avoid issues if utils/cn is not ready
function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
