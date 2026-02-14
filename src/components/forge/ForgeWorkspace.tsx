"use client";

import React from "react";
import { ForgeProvider } from "@/contexts/ForgeContext";
import { IngredientsPanel } from "./IngredientsPanel";
import { AssemblyArea } from "./AssemblyArea";
import { OutputStream } from "./OutputStream";

import { ForgePersona, ForgeSkill, ForgeRule } from "@/types/forge";

interface ForgeWorkspaceProps {
  initialData: {
    personas: ForgePersona[];
    skills: ForgeSkill[];
    rules: ForgeRule[];
  };
}

export const ForgeWorkspace = ({ initialData }: ForgeWorkspaceProps) => {
  return (
    <ForgeProvider initialData={initialData}>
      <div className="flex h-[calc(100vh-64px)] w-full gap-4 p-4 font-mono text-sm overflow-hidden">
        <IngredientsPanel />
        <AssemblyArea />
        <OutputStream />
      </div>
    </ForgeProvider>
  );
};
