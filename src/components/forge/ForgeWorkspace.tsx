"use client";

import React from "react";
import { ForgeProvider } from "@/contexts/ForgeContext";
import { IngredientsPanel } from "./IngredientsPanel";
import { AssemblyArea } from "./AssemblyArea";
import { OutputStream } from "./OutputStream";

export const ForgeWorkspace = () => {
  return (
    <ForgeProvider>
      <div className="flex h-[calc(100vh-64px)] w-full gap-4 p-4 font-mono text-sm overflow-hidden">
        <IngredientsPanel />
        <AssemblyArea />
        <OutputStream />
      </div>
    </ForgeProvider>
  );
};
