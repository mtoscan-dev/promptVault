export interface PromptVersion {
  id: string;
  content: string;
  createdAt: Date;
  versionNumber: number;
}

export interface Prompt {
  id: string;
  title: string;
  description: string;
  tags: string[];
  titleEs?: string | null;
  titleEn?: string | null;
  descriptionEs?: string | null;
  descriptionEn?: string | null;
  contentEs?: string | null;
  contentEn?: string | null;
  content?: string; // Derived/Active content
  versions: PromptVersion[];
  currentVersionId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Tag {
  name: string;
  color: string;
  count: number;
}

export interface AnalysisResult {
  score: number;
  clarity: string;
  suggestions: string[];
}

export interface SmartTag {
  id: string;
  nameEn: string;
  nameEs: string;
  descriptionEn: string;
  descriptionEs: string;
  dimensionId: string;
}
