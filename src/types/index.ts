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

export interface EvaluationCategory {
  score: number;
  feedback: string;
  strengths?: string[];
}

export interface AnalysisResult {
  totalScore: number;
  categories: {
    structure: EvaluationCategory;
    context: EvaluationCategory;
    quality: EvaluationCategory;
    viability: EvaluationCategory;
  };
  prioritySuggestions: string[];
}

export interface SmartTag {
  id: string;
  nameEn: string;
  nameEs: string;
  descriptionEn: string;
  descriptionEs: string;
  dimensionId: string;
}

export interface TagDimension {
  id: string;
  nameEn: string;
  nameEs: string;
  descriptionEn?: string | null;
  descriptionEs?: string | null;
  color?: string | null;
  icon?: string | null;
}

export interface Taxonomy {
  dimensions: TagDimension[];
  tags: SmartTag[];
}
