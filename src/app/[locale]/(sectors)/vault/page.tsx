"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { Plus, Terminal } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { TerminalSearch } from "@/components/TerminalSearch";
import { TagCloud } from "@/components/TagCloud";
import { PromptCard } from "@/components/PromptCard";
import { PromptEditor } from "@/components/PromptEditor";
import { Prompt, PromptVersion, Tag } from "@/types";
import { classifyPrompt } from "@/utils/classification";
import { TAG_COLORS } from "@/utils/styling";
import { SystemErrorModal } from "@/components/SystemErrorModal";
import { VaultSkeleton } from "@/components/VaultSkeleton";
import { searchPrompts, savePrompt, deletePrompt } from "@/lib/actions/vault";

export default function VaultPage() {
  const tCommon = useTranslations("Common");
  const tErrors = useTranslations("Errors");
  const tSystem = useTranslations("System");
  const tEditor = useTranslations("Editor");

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [prompts, setPrompts] = useState<Prompt[]>([]);
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
  const [isLoading, setIsLoading] = useState(true);

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

  // Fetch Prompts (Load standard prompts on mount)
  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const data = await searchPrompts("");
        setPrompts(data);
      } catch (error) {
        console.error("Failed to load prompts:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPrompts();
  }, []);

  // Search Effect (Triggered when searchQuery updates)
  useEffect(() => {
    const performSearch = async () => {
      try {
        const results = await searchPrompts(searchQuery);
        setPrompts(results);
      } catch (error) {
        console.error("Search failed:", error);
      }
    };
    performSearch();
  }, [searchQuery]);

  // Handlers
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // Filter local state based on tags (Client-side filtering of Server-side results)
  const filteredPrompts = useMemo(() => {
    return prompts.filter((prompt) => {
      if (selectedTags.length > 0) {
        const hasAllTags = selectedTags.every((tag) =>
          prompt.tags.includes(tag),
        );
        if (!hasAllTags) return false;
      }
      return true;
    });
  }, [prompts, selectedTags]);

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
    // Optimistic update
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
    // TODO: Persist tag add
  }, []);

  const handleCardTagRemove = useCallback((promptId: string, tag: string) => {
    setPrompts((prev) =>
      prev.map((prompt) =>
        prompt.id === promptId
          ? { ...prompt, tags: prompt.tags.filter((t) => t !== tag) }
          : prompt,
      ),
    );
    // TODO: Persist tag remove
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
    async (
      id: string | null,
      content: string,
      title: string,
      description: string,
      contentEs?: string | null,
      contentEn?: string | null,
      titleEs?: string | null,
      titleEn?: string | null,
      descriptionEs?: string | null,
      descriptionEn?: string | null,
    ) => {
      // Prepare data for server action
      const promptData = {
        id: id || undefined,
        // Use specific language version if available, otherwise fallback to current UI value
        titleEs: titleEs || title,
        titleEn: titleEn || title,
        descriptionEs: descriptionEs || description,
        descriptionEn: descriptionEn || description,
        content: content,
        contentEs: contentEs,
        contentEn: contentEn,
        tags: classifyPrompt(content + " " + title + " " + description),
      };

      const result = await savePrompt(promptData);

      if (result.success) {
        const updated = await searchPrompts(searchQuery);
        setPrompts(updated);
        setIsEditorOpen(false);
      } else {
        setSystemError({ message: tErrors("saveFailed") });
      }
    },
    [searchQuery, tErrors],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      // Optimistic update
      const previousPrompts = prompts;
      setPrompts((prev) => prev.filter((p) => p.id !== id));

      const result = await deletePrompt(id);
      if (!result.success) {
        // Rollback
        setPrompts(previousPrompts);
        setSystemError({ message: tErrors("deleteFailed") });
      }
    },
    [prompts, tErrors],
  );

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

  const handleCommand = useCallback(
    (command: string) => {
      if (command === "new" || command === "add") {
        handleNewPrompt();
      }
    },
    [handleNewPrompt],
  );

  // URL Param Listener
  useEffect(() => {
    if (searchParams.get("new") === "true") {
      handleNewPrompt();
      // Clear param without reload
      router.replace(pathname);
    }
  }, [searchParams, pathname, router, handleNewPrompt]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 py-2">
          {/* Prompts grid */}
          {isLoading ? (
            <VaultSkeleton />
          ) : filteredPrompts.length > 0 ? (
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

          {/* Row 2: Terminal Search + Actions */}
          <div className="flex gap-2 items-center">
            <div className="bg-black/50 border border-gray-700 rounded px-3 py-1.5 flex-1">
              <TerminalSearch
                tags={tags}
                selectedTags={selectedTags}
                placeholder={tCommon("searchPlaceholder")}
                onSearch={handleSearch}
                onTagSelect={handleTagSelect}
                onTagRemove={handleTagRemove}
                onCommand={handleCommand}
              />
            </div>
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
