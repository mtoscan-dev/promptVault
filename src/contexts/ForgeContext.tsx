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

// Mock Data
const MOCK_PERSONAS: ForgePersona[] = [
  {
    id: "patagonia-1",
    name: "Patagonia Architect",
    version: "v1.0",
    description: "Expert in resilient cloud architectures.",
    instructions:
      "Role: Senior Cloud Architect specializing in high-availability systems. Style: Concise, technical, and focused on reliability.",
  },
  {
    id: "frontend-enhancer",
    name: "Frontend Enhancer",
    version: "v2.0",
    description: "Specialist in premium UI/UX.",
    instructions:
      "Role: Expert Frontend Engineer. Focus: Accessibility, animations, and visual excellence using Tailwind.",
  },
];

const MOCK_SKILLS: ForgeSkill[] = [
  {
    id: "nextjs-opt",
    name: "NextJS_RAM_Optimizer",
    description: "Optimizes Next.js memory usage.",
    instructions:
      "Skill: Analyze code for memory leaks and optimize server-side rendering performance.",
  },
  {
    id: "claude-code",
    name: "ClaudeCode_Patterns",
    description: "Technical logic for Claude Code CLI.",
    instructions:
      "Skill: Adhere to Claude Code architectural patterns and CLI best practices.",
  },
];

const MOCK_RULES: ForgeRule[] = [
  {
    id: "white-hat",
    name: "White_Hat_Standard",
    description: "Security-first compliance.",
    instructions:
      "Rule: All code MUST follow OWASP Top 10 security guidelines.",
  },
  {
    id: "clean-code",
    name: "Clean_Code_Architecture",
    description: "Strict adherence to DRY and SOLID.",
    instructions: "Rule: Follow SOLID principles and maintain high DRY scores.",
  },
];

export const ForgeProvider = ({ children }: { children: React.ReactNode }) => {
  const [activePersonaId, setActivePersonaId] = useState<string | null>(
    MOCK_PERSONAS[0].id,
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

  const executeInference = useCallback(async () => {
    if (!userInput.trim()) return;

    setIsCompiling(true);
    resetOutput();

    // Simulating Ollama streaming
    const mockResponse =
      "PROMPT GENERATED > Executing operation with defined constraints...\n\nAnalyzing system architecture...\nOptimizing resource allocation...\nOperation complete.";
    const chunks = mockResponse.split("");

    setMetrics({ tps: 12.4, latency: 140 });

    for (let i = 0; i < chunks.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 30));
      setOutputStream((prev) => prev + chunks[i]);
    }

    setIsCompiling(false);
  }, [userInput, resetOutput]);

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
      availablePersonas: MOCK_PERSONAS,
      availableSkills: MOCK_SKILLS,
      availableRules: MOCK_RULES,
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
