"use client";

import React from "react";
import { Play, Sparkles } from "lucide-react";
import { useForge } from "@/contexts/ForgeContext";
import { LiveBlueprint } from "./LiveBlueprint";

export const AssemblyArea = () => {
  const { userInput, setUserInput, executeInference, isCompiling } = useForge();

  return (
    <main className="flex-1 flex flex-col gap-4">
      <div className="flex-1 bg-(--bg-surface)/60 border border-(--border-primary)/10 rounded-sm relative flex flex-col overflow-hidden">
        <div className="p-3 border-b border-white/5 flex justify-between items-center bg-white/5 backdrop-blur-sm">
          <span className="text-white/40 flex items-center gap-2 text-[11px] tracking-widest uppercase">
            <Sparkles size={14} className="text-emerald-400" /> LIVE_BLUEPRINT
          </span>
          <div className="flex items-center gap-2">
            <div
              className={`h-1.5 w-1.5 rounded-full ${isCompiling ? "bg-amber-500 animate-pulse" : "bg-emerald-500"}`}
            />
            <span
              className={`text-[10px] uppercase tracking-wider ${isCompiling ? "text-amber-500/70" : "text-emerald-500/70"}`}
            >
              {isCompiling ? "Compiling_Context..." : "Ready_to_Compile"}
            </span>
          </div>
        </div>

        <div className="flex-1 flex flex-col p-4 gap-4 overflow-y-auto custom-scrollbar">
          <LiveBlueprint />

          <div className="relative flex-1 mt-2">
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/20" />
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Introduce tu requerimiento operativo..."
              className="w-full h-full bg-black/20 p-6 outline-none resize-none text-[14px] text-white/80 placeholder:text-white/10 font-mono tracking-tight leading-relaxed border border-white/5 rounded-sm focus:border-white/20 transition-colors"
            />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/20" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20" />
          </div>
        </div>

        <div className="p-4 border-t border-white/5 bg-black/40">
          <button
            onClick={executeInference}
            disabled={isCompiling || !userInput.trim()}
            className={`w-full py-3 transition-all flex items-center justify-center gap-3 group relative overflow-hidden ${
              isCompiling
                ? "bg-amber-500/20 text-amber-500 border-amber-500/30 cursor-wait"
                : "bg-white/5 border border-white/20 text-white hover:bg-white hover:text-black hover:border-white disabled:opacity-20 disabled:cursor-not-allowed uppercase"
            }`}
          >
            {isCompiling && (
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-amber-500/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
            )}
            <Play
              size={16}
              className={
                isCompiling ? "animate-pulse" : "group-hover:fill-black"
              }
            />
            <span className="font-bold tracking-[0.4em] text-[12px] terminal-glow">
              {isCompiling ? "Executing_Inference..." : "Execute_Inference"}
            </span>
          </button>
        </div>
      </div>
    </main>
  );
};
