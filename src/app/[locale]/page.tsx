"use client";

import { ForgeWorkspace } from "@/components/forge/ForgeWorkspace";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col bg-black/20">
      {/* Header Stat Strip (Visual Decoration) */}
      <div className="h-1 w-full bg-linear-to-r from-cyan-500/20 via-amber-500/20 to-fuchsia-500/20" />

      <ForgeWorkspace />

      {/* Footer Stat Strip (Visual Decoration) */}
      <div className="h-px w-full bg-white/5" />
    </div>
  );
}
