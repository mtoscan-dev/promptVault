"use client";

import React from "react";
import { useForge } from "@/contexts/ForgeContext";

export const LiveBlueprint = () => {
  const {
    activePersonaId,
    availablePersonas,
    activeSkillIds,
    availableSkills,
    activeRuleIds,
    availableRules,
  } = useForge();

  const activePersona = availablePersonas.find((p) => p.id === activePersonaId);
  const activeSkills = availableSkills.filter((s) =>
    activeSkillIds.includes(s.id),
  );
  const activeRules = availableRules.filter((r) =>
    activeRuleIds.includes(r.id),
  );

  const hasIngredients =
    activePersona || activeSkills.length > 0 || activeRules.length > 0;

  if (!hasIngredients) {
    return (
      <div className="border border-dashed border-white/5 p-4 rounded-sm bg-white/2">
        <p className="text-[11px] text-white/20 uppercase tracking-widest text-center">
          No_Ingredients_Selected
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 font-mono text-[12px] leading-relaxed">
      {/* Persona Segment */}
      {activePersona && (
        <div className="group relative">
          <div className="absolute -left-3 top-0 bottom-0 w-[2px] bg-cyan-500/30 group-hover:bg-cyan-500 transition-colors" />
          <div className="flex gap-2 text-cyan-500/60 font-bold uppercase text-[10px] mb-1">
            <span>[PERSONA]</span>
            <span>{activePersona.name}</span>
          </div>
          <p className="text-cyan-100/70 p-2 bg-cyan-500/5 border border-cyan-500/10 rounded-sm">
            {activePersona.instructions}
          </p>
        </div>
      )}

      {/* Skills Segments */}
      {activeSkills.map((skill) => (
        <div key={skill.id} className="group relative">
          <div className="absolute -left-3 top-0 bottom-0 w-[2px] bg-amber-500/30 group-hover:bg-amber-500 transition-colors" />
          <div className="flex gap-2 text-amber-500/60 font-bold uppercase text-[10px] mb-1">
            <span>[SKILL]</span>
            <span>{skill.name}</span>
          </div>
          <p className="text-amber-100/70 p-2 bg-amber-500/5 border border-amber-500/10 rounded-sm">
            {skill.instructions}
          </p>
        </div>
      ))}

      {/* Rules Segments */}
      {activeRules.map((rule) => (
        <div key={rule.id} className="group relative">
          <div className="absolute -left-3 top-0 bottom-0 w-[2px] bg-fuchsia-500/30 group-hover:bg-fuchsia-500 transition-colors" />
          <div className="flex gap-2 text-fuchsia-500/60 font-bold uppercase text-[10px] mb-1">
            <span>[RULE]</span>
            <span>{rule.name}</span>
          </div>
          <p className="text-fuchsia-100/70 p-2 bg-fuchsia-100/5 border border-fuchsia-500/10 rounded-sm italic">
            {rule.instructions}
          </p>
        </div>
      ))}
    </div>
  );
};
