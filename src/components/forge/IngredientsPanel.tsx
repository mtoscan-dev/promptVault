"use client";

import React from "react";
import { UserCircle2, Zap, ShieldCheck } from "lucide-react";
import { useForge } from "@/contexts/ForgeContext";
import { cn } from "@/utils/cn";

export const IngredientsPanel = () => {
  const {
    availablePersonas,
    activePersonaId,
    setActivePersona,
    availableSkills,
    activeSkillIds,
    toggleSkill,
    availableRules,
    activeRuleIds,
    toggleRule,
  } = useForge();

  return (
    <aside className="w-1/4 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
      {/* 1. ACTIVE_PERSONA */}
      <section className="bg-(--bg-surface)/40 border border-(--border-primary)/10 p-4 rounded-sm">
        <div className="flex items-center gap-2 mb-4 text-cyan-500">
          <UserCircle2 size={16} />
          <span className="uppercase tracking-widest font-bold text-[11px]">
            Active_Persona
          </span>
        </div>
        <div className="space-y-2">
          {availablePersonas.map((persona) => (
            <button
              key={persona.id}
              onClick={() => setActivePersona(persona.id)}
              className={cn(
                "w-full text-left p-2 border transition-all text-[12px]",
                activePersonaId === persona.id
                  ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-100 shadow-[0_0_10px_rgba(6,182,212,0.1)]"
                  : "border-white/5 text-white/40 hover:bg-white/5",
              )}
            >
              <div className="font-bold uppercase tracking-tight">
                {persona.name}
              </div>
              <div className="text-[10px] opacity-60 truncate">
                {persona.version} • {persona.description}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 2. LOGIC_SKILLS */}
      <section className="bg-(--bg-surface)/40 border border-(--border-primary)/10 p-4 rounded-sm">
        <div className="flex items-center gap-2 mb-4 text-amber-500">
          <Zap size={16} />
          <span className="uppercase tracking-widest font-bold text-[11px]">
            Logic_Skills
          </span>
        </div>
        <div className="space-y-2">
          {availableSkills.map((skill) => (
            <button
              key={skill.id}
              onClick={() => toggleSkill(skill.id)}
              className={cn(
                "w-full text-left p-2 border transition-all text-[12px]",
                activeSkillIds.includes(skill.id)
                  ? "border-amber-500/40 bg-amber-500/10 text-amber-100 shadow-[0_0_10px_rgba(245,158,11,0.1)]"
                  : "border-white/5 text-white/40 hover:bg-white/5",
              )}
            >
              <div className="font-bold uppercase tracking-tight">
                {skill.name}
              </div>
              <div className="text-[10px] opacity-60 truncate">
                {skill.description}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 3. GOVERNANCE_RULES */}
      <section className="bg-(--bg-surface)/40 border border-(--border-primary)/10 p-4 rounded-sm flex-1">
        <div className="flex items-center gap-2 mb-4 text-fuchsia-500">
          <ShieldCheck size={16} />
          <span className="uppercase tracking-widest font-bold text-[11px]">
            Governance_Rules
          </span>
        </div>
        <div className="space-y-3">
          {availableRules.map((rule) => (
            <label
              key={rule.id}
              className={cn(
                "flex items-center gap-3 p-2 rounded-sm cursor-pointer transition-all border border-transparent",
                activeRuleIds.includes(rule.id)
                  ? "text-fuchsia-100 bg-fuchsia-500/5 border-fuchsia-500/20"
                  : "text-white/30 hover:text-white/60 hover:bg-white/5",
              )}
            >
              <input
                type="checkbox"
                checked={activeRuleIds.includes(rule.id)}
                onChange={() => toggleRule(rule.id)}
                className="sr-only"
              />
              <div
                className={cn(
                  "w-3 h-3 border rounded-sm flex items-center justify-center transition-all",
                  activeRuleIds.includes(rule.id)
                    ? "bg-fuchsia-500 border-fuchsia-500"
                    : "border-white/20",
                )}
              >
                {activeRuleIds.includes(rule.id) && (
                  <div className="w-1 h-1 bg-white rounded-full" />
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] uppercase font-bold tracking-wider">
                  {rule.name}
                </span>
                <span className="text-[9px] opacity-50 uppercase">
                  {rule.description}
                </span>
              </div>
            </label>
          ))}
        </div>
      </section>
    </aside>
  );
};
