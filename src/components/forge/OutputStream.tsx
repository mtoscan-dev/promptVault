"use client";

import React, { useEffect, useRef } from "react";
import { Terminal, Cpu, Activity } from "lucide-react";
import { useForge } from "@/contexts/ForgeContext";

export const OutputStream = () => {
  const { outputStream, metrics, isCompiling } = useForge();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [outputStream]);

  return (
    <aside className="w-1/3 bg-black/80 border-l border-white/10 flex flex-col backdrop-blur-sm">
      <div className="p-3 border-b border-white/5 flex items-center gap-2 text-white/30 uppercase text-[11px] tracking-widest bg-white/5">
        <Terminal
          size={14}
          className={isCompiling ? "text-emerald-500 animate-pulse" : ""}
        />
        Output_Stream
        {isCompiling && (
          <span className="ml-auto text-[10px] text-emerald-500/50 flex gap-1">
            <span className="animate-bounce inline-block">.</span>
            <span className="animate-bounce inline-block [animation-delay:0.2s]">
              .
            </span>
            <span className="animate-bounce inline-block [animation-delay:0.4s]">
              .
            </span>
          </span>
        )}
      </div>

      <div
        ref={scrollRef}
        className="flex-1 p-6 text-emerald-500/90 leading-relaxed overflow-y-auto custom-scrollbar font-mono text-[13px] selection:bg-emerald-500/20"
      >
        {!outputStream && !isCompiling ? (
          <div className="opacity-20 italic font-serif">
            {"> Waiting for operation..."}
          </div>
        ) : (
          <div className="whitespace-pre-wrap">
            {outputStream}
            {isCompiling && (
              <span className="inline-block w-2 h-4 bg-emerald-500/50 ml-1 animate-pulse align-middle" />
            )}
          </div>
        )}
      </div>

      <div className="p-4 bg-white/5 border-t border-white/10 grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <span className="text-[10px] text-white/20 uppercase block tracking-wider">
            Inference_Speed
          </span>
          <div
            className={`flex items-center gap-2 font-bold transition-colors ${metrics.tps > 0 ? "text-emerald-500" : "text-white/10"}`}
          >
            <Cpu size={12} />
            <span className="text-[13px] uppercase">
              {metrics.tps > 0 ? `${metrics.tps} TPS` : "0.0 TPS"}
            </span>
          </div>
        </div>
        <div className="space-y-1">
          <span className="text-[10px] text-white/20 uppercase block tracking-wider">
            Latency
          </span>
          <div
            className={`flex items-center gap-2 font-bold transition-colors ${metrics.latency > 0 ? "text-amber-500" : "text-white/10"}`}
          >
            <Activity size={12} />
            <span className="text-[13px] uppercase">
              {metrics.latency > 0 ? `${metrics.latency}ms` : "0ms"}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
