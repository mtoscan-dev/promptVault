"use client";

import { useEffect, useState } from "react";
import { Activity, Cpu, Database } from "lucide-react";

export function SystemStats() {
  const [stats, setStats] = useState({
    ram: 0,
    tps: 0,
    ollama: "checking",
  });

  useEffect(() => {
    // Simulated telemetry
    const interval = setInterval(() => {
      setStats({
        ram: Math.floor(Math.random() * (85 - 70) + 70), // 70-85% usage
        tps: Math.floor(Math.random() * (45 - 30) + 30), // 30-45 t/s
        ollama: "online",
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-4 px-3 py-1.5 bg-black/5 dark:bg-white/5 border border-(--border-primary) rounded text-[9px] font-mono text-(--text-secondary)">
      {/* OLLAMA Status */}
      <div className="flex items-center gap-1.5">
        <div
          className={cn(
            "w-1.5 h-1.5 rounded-full animate-pulse",
            stats.ollama === "online"
              ? "bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]"
              : "bg-red-500",
          )}
        />
        <span className="tracking-tighter">
          OLLAMA_{stats.ollama.toUpperCase()}
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
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
