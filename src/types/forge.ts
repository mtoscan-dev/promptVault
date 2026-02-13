export interface ForgePersona {
  id: string;
  name: string;
  version: string;
  description: string;
  instructions: string;
}

export interface ForgeSkill {
  id: string;
  name: string;
  description: string;
  instructions: string;
}

export interface ForgeRule {
  id: string;
  name: string;
  description: string;
  instructions: string;
}

export interface ForgeInferenceMetrics {
  tps: number;
  latency: number;
}
