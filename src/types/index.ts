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
