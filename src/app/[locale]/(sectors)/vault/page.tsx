"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { Plus, Terminal, Database, GitBranch } from "lucide-react";
import { useTranslations } from "next-intl";
import { v4 as uuidv4 } from "uuid";
import { TerminalSearch } from "@/components/TerminalSearch";
import { TagCloud } from "@/components/TagCloud";
import { PromptCard } from "@/components/PromptCard";
import { PromptEditor } from "@/components/PromptEditor";
import { Prompt, PromptVersion, Tag } from "@/types";
import { initialPrompts } from "@/data/mock";
import { classifyPrompt } from "@/utils/classification";
import { TAG_COLORS } from "@/utils/styling";
import { SystemErrorModal } from "@/components/SystemErrorModal";

export default function VaultPage() {
  const tCommon = useTranslations("Common");
  const tErrors = useTranslations("Errors");
  const tSystem = useTranslations("System");

  const [prompts, setPrompts] = useState<Prompt[]>(initialPrompts);
  const [tags, setTags] = useState<Tag[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isNewPrompt, setIsNewPrompt] = useState(false);
  const [pasteContent, setPasteContent] = useState("");
  const [systemError, setSystemError] = useState<{ message: string } | null>(
    null,
  );

  // Derive Tags
  useEffect(() => {
    const tagMap = new Map<string, number>();
    prompts.forEach((prompt) => {
      prompt.tags.forEach((tag) => {
        tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
      });
    });

    const tagList: Tag[] = Array.from(tagMap.entries()).map(
      ([name, count]) => ({
        name,
        color: TAG_COLORS[name] || TAG_COLORS.default,
        count,
      }),
    );

    setTags(tagList.sort((a, b) => b.count - a.count));
  }, [prompts]);

  // Derive Tag Counts for Card Logic (immediate consistency)
  const tagCounts = useMemo(() => {
    const map: Record<string, number> = {};
    prompts.forEach((prompt) => {
      prompt.tags.forEach((tag) => {
        map[tag] = (map[tag] || 0) + 1;
      });
    });
    return map;
  }, [prompts]);

  // Global Paste Listener
  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      // Don't trigger if we are already in an input/textarea
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      const text = event.clipboardData?.getData("text");
      if (text) {
        setPasteContent(text);
        setSelectedPrompt(null);
        setIsNewPrompt(true);
        setIsEditorOpen(true);
      } else {
        // Check if there's any file or non-text data
        const items = event.clipboardData?.items;
        if (items && items.length > 0) {
          setSystemError({
            message: tSystem("pasteError"),
          });
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [tSystem]);

  // Search Logic
  const filteredPrompts = prompts.filter((prompt) => {
    if (selectedTags.length > 0) {
      const hasAllTags = selectedTags.every((tag) => prompt.tags.includes(tag));
      if (!hasAllTags) return false;
    }

    const lowerQuery = searchQuery.toLowerCase().trim();
    if (!lowerQuery) return true;

    const currentVersion = prompt.versions.find(
      (v) => v.id === prompt.currentVersionId,
    );
    const content = currentVersion?.content || "";

    return (
      prompt.title.toLowerCase().includes(lowerQuery) ||
      prompt.description.toLowerCase().includes(lowerQuery) ||
      content.toLowerCase().includes(lowerQuery)
    );
  });

  // Handlers
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleTagSelect = useCallback((tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev : [...prev, tag]));
  }, []);

  const handleTagRemove = useCallback((tag: string) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tag));
  }, []);

  const handleTagCloudClick = useCallback((tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  }, []);

  const handleCardTagSearch = useCallback((tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev : [...prev, tag]));
  }, []);

  const handleCardTagAdd = useCallback((promptId: string, tag: string) => {
    setPrompts((prev) =>
      prev.map((prompt) =>
        prompt.id === promptId
          ? {
              ...prompt,
              tags: prompt.tags.includes(tag)
                ? prompt.tags
                : [...prompt.tags, tag],
            }
          : prompt,
      ),
    );
  }, []);

  const handleCardTagRemove = useCallback((promptId: string, tag: string) => {
    setPrompts((prev) =>
      prev.map((prompt) =>
        prompt.id === promptId
          ? { ...prompt, tags: prompt.tags.filter((t) => t !== tag) }
          : prompt,
      ),
    );
  }, []);

  const handlePromptSelect = useCallback((prompt: Prompt) => {
    setSelectedPrompt(prompt);
    setIsNewPrompt(false);
    setIsEditorOpen(true);
  }, []);

  const handleNewPrompt = useCallback(() => {
    setSelectedPrompt(null);
    setPasteContent("");
    setIsNewPrompt(true);
    setIsEditorOpen(true);
  }, []);

  const handleSave = useCallback(
    (
      id: string | null,
      content: string,
      title: string,
      description: string,
    ) => {
      if (id) {
        // Update existing
        setPrompts((prev) =>
          prev.map((prompt) => {
            if (prompt.id !== id) return prompt;

            const newVersionId = uuidv4();
            const newVersion: PromptVersion = {
              id: newVersionId,
              content,
              createdAt: new Date(),
              versionNumber: prompt.versions.length + 1,
            };

            const autoTags = classifyPrompt(
              content +
                " " +
                (title || prompt.title) +
                " " +
                (description || prompt.description),
            );

            return {
              ...prompt,
              title: title || prompt.title,
              description: description || prompt.description,
              tags: autoTags,
              versions: [...prompt.versions, newVersion],
              currentVersionId: newVersionId,
              updatedAt: new Date(),
            };
          }),
        );
      } else {
        // Create new
        const versionId = uuidv4();
        const autoTags = classifyPrompt(
          content + " " + title + " " + description,
        );

        const newPrompt: Prompt = {
          id: uuidv4(),
          title,
          description,
          tags: autoTags,
          versions: [
            {
              id: versionId,
              content,
              createdAt: new Date(),
              versionNumber: 1,
            },
          ],
          currentVersionId: versionId,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setPrompts((prev) => [newPrompt, ...prev]);
      }
    },
    [],
  );

  const handleDelete = useCallback((id: string) => {
    if (confirm("Are you sure you want to delete this prompt?")) {
      setPrompts((prev) => prev.filter((p) => p.id !== id));
    }
  }, []);

  const switchVersion = useCallback((promptId: string, versionId: string) => {
    setPrompts((prev) =>
      prev.map((prompt) => {
        if (prompt.id !== promptId) return prompt;
        return {
          ...prompt,
          currentVersionId: versionId,
        };
      }),
    );
  }, []);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 py-2">
          {/* Prompts grid */}
          {filteredPrompts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredPrompts.map((prompt) => (
                <PromptCard
                  key={prompt.id}
                  prompt={prompt}
                  onSelect={handlePromptSelect}
                  onDelete={handleDelete}
                  onTagSearch={handleCardTagSearch}
                  onTagRemove={handleCardTagRemove}
                  onTagAdd={handleCardTagAdd}
                  tagCounts={tagCounts}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-gray-600">
              <Terminal size={48} className="mb-4 opacity-50" />
              <p className="text-lg mb-2">{tErrors("noPrompts")}</p>
              <p className="text-sm">
                {searchQuery || selectedTags.length > 0
                  ? tErrors("adjustSearch")
                  : tErrors("createFirst")}
              </p>
              {prompts.length === 0 && (
                <button
                  onClick={handleNewPrompt}
                  className="mt-4 flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded transition-colors"
                >
                  <Plus size={16} />
                  {tErrors("createFirstBtn")}
                </button>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer with terminal search */}
      <footer className="border-t border-(--border-primary) bg-(--bg-surface)/80 backdrop-blur-sm sticky bottom-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-1.5 space-y-1.5">
          {/* Row 1: Tags */}
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="text-gray-600 text-xs shrink-0">
              {tCommon("tags")}:
            </span>
            <TagCloud
              tags={tags}
              selectedTags={selectedTags}
              onTagClick={handleTagCloudClick}
            />
          </div>

          {/* Row 2: Terminal Search */}
          <div className="bg-black/50 border border-gray-700 rounded px-3 py-1.5">
            <TerminalSearch
              tags={tags}
              selectedTags={selectedTags}
              placeholder={tCommon("searchPlaceholder")}
              onSearch={handleSearch}
              onTagSelect={handleTagSelect}
              onTagRemove={handleTagRemove}
            />
          </div>
        </div>
      </footer>

      {/* Editor modal */}
      {isEditorOpen && (
        <PromptEditor
          prompt={isNewPrompt ? null : selectedPrompt}
          initialContent={isNewPrompt ? pasteContent : undefined}
          onClose={() => {
            setIsEditorOpen(false);
            setPasteContent("");
          }}
          onSave={handleSave}
          onVersionSwitch={switchVersion}
        />
      )}

      {systemError && (
        <SystemErrorModal
          message={systemError.message}
          onClose={() => setSystemError(null)}
        />
      )}
    </div>
  );
}
