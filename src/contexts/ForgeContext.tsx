"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import {
  ForgePersona,
  ForgeSkill,
  ForgeRule,
  ForgeInferenceMetrics,
} from "@/types/forge";

interface ForgeState {
  activePersonaId: string | null;
  activeSkillIds: string[];
  activeRuleIds: string[];
  userInput: string;
  outputStream: string;
  isCompiling: boolean;
  metrics: ForgeInferenceMetrics;
}

interface ForgeContextValue extends ForgeState {
  setActivePersona: (id: string | null) => void;
  toggleSkill: (id: string) => void;
  toggleRule: (id: string) => void;
  setUserInput: (input: string) => void;
  executeInference: () => Promise<void>;
  resetOutput: () => void;

  // Mocks for now - would come from a data source or API later
  availablePersonas: ForgePersona[];
  availableSkills: ForgeSkill[];
  availableRules: ForgeRule[];
}

const ForgeContext = createContext<ForgeContextValue | undefined>(undefined);

// Mocks removed - data comes from props

interface ForgeProviderProps {
  children: React.ReactNode;
  initialData: {
    personas: ForgePersona[];
    skills: ForgeSkill[];
    rules: ForgeRule[];
  };
}

export const ForgeProvider = ({
  children,
  initialData,
}: ForgeProviderProps) => {
  const { personas, skills, rules } = initialData;

  const [activePersonaId, setActivePersonaId] = useState<string | null>(
    personas[0]?.id || null,
  );
  const [activeSkillIds, setActiveSkillIds] = useState<string[]>([]);
  const [activeRuleIds, setActiveRuleIds] = useState<string[]>([]);
  const [userInput, setUserInput] = useState("");
  const [outputStream, setOutputStream] = useState("");
  const [isCompiling, setIsCompiling] = useState(false);
  const [metrics, setMetrics] = useState<ForgeInferenceMetrics>({
    tps: 0,
    latency: 0,
  });

  const setActivePersona = useCallback(
    (id: string | null) => setActivePersonaId(id),
    [],
  );

  const toggleSkill = useCallback((id: string) => {
    setActiveSkillIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  }, []);

  const toggleRule = useCallback((id: string) => {
    setActiveRuleIds((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id],
    );
  }, []);

  const resetOutput = useCallback(() => {
    setOutputStream("");
    setMetrics({ tps: 0, latency: 0 });
  }, []);

  // Real-time inference using Server Action
  const executeInference = useCallback(async () => {
    if (!userInput.trim()) return;

    setIsCompiling(true);
    resetOutput();

    const start = Date.now();
    let tokenCount = 0;

    try {
      // Construct messages context based on active items
      const activePersona = personas.find((p) => p.id === activePersonaId);
      const activeSkills = skills.filter((s) => activeSkillIds.includes(s.id));
      const activeRules = rules.filter((r) => activeRuleIds.includes(r.id));

      const systemContext = `
        ${activePersona ? `IDENTITY:\n${activePersona.instructions}\n` : ""}
        ${activeSkills.length > 0 ? `SKILLS:\n${activeSkills.map((s) => s.instructions).join("\n")}\n` : ""}
        ${activeRules.length > 0 ? `GOVERNANCE:\n${activeRules.map((r) => r.instructions).join("\n")}\n` : ""}
      `;

      const messages = [
        { role: "system", content: systemContext },
        { role: "user", content: userInput },
      ];

      // Call Server Action
      const response = await import("@/app/actions/forge-ai").then((mod) =>
        mod.streamForgeResponse(messages),
      );

      // Handle stream
      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response stream");

      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        setOutputStream((prev) => prev + chunk);
        tokenCount++;

        // Update metrics live
        const elapsed = Date.now() - start;
        setMetrics({
          tps: Math.round((tokenCount / (elapsed / 1000)) * 10) / 10,
          latency: elapsed,
        });
      }
    } catch (error) {
      console.error("Inference failed:", error);
      setOutputStream(
        (prev) => prev + `\n\n[SYSTEM ERROR]: Inference failed. check logs.`,
      );
    } finally {
      setIsCompiling(false);
    }
  }, [
    userInput,
    resetOutput,
    activePersonaId,
    activeSkillIds,
    activeRuleIds,
    personas,
    skills,
    rules,
  ]);

  const value = useMemo(
    () => ({
      activePersonaId,
      activeSkillIds,
      activeRuleIds,
      userInput,
      outputStream,
      isCompiling,
      metrics,
      setActivePersona,
      toggleSkill,
      toggleRule,
      setUserInput,
      executeInference,
      resetOutput,
      availablePersonas: personas,
      availableSkills: skills,
      availableRules: rules,
    }),
    [
      activePersonaId,
      activeSkillIds,
      activeRuleIds,
      userInput,
      outputStream,
      isCompiling,
      metrics,
      setActivePersona,
      toggleSkill,
      toggleRule,
      executeInference,
      resetOutput,
      personas,
      skills,
      rules,
    ],
  );

  return (
    <ForgeContext.Provider value={value}>{children}</ForgeContext.Provider>
  );
};

export const useForge = () => {
  const context = useContext(ForgeContext);
  if (context === undefined) {
    throw new Error("useForge must be used within a ForgeProvider");
  }
  return context;
};
