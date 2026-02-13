import { useState, useEffect } from "react";
import { format } from "date-fns";
import { X, Save, GitBranch, Clock, ChevronDown, Plus } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { es, enUS } from "date-fns/locale";
import { Prompt, PromptVersion } from "@/types";
import { cn } from "@/utils/cn";

interface PromptEditorProps {
  prompt: Prompt | null;
  initialContent?: string;
  onClose: () => void;
  onSave: (
    id: string | null,
    content: string,
    title: string,
    description: string,
  ) => void;
  onVersionSwitch: (promptId: string, versionId: string) => void;
}

export function PromptEditor({
  prompt,
  initialContent,
  onClose,
  onSave,
  onVersionSwitch,
}: PromptEditorProps) {
  const t = useTranslations("Editor");
  const locale = useLocale();
  const dateLocale = locale === "es" ? es : enUS;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [showVersions, setShowVersions] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<PromptVersion | null>(
    null,
  );

  useEffect(() => {
    if (prompt) {
      setTitle(prompt.title);
      setDescription(prompt.description);
      const currentVersion = prompt.versions.find(
        (v) => v.id === prompt.currentVersionId,
      );
      setContent(currentVersion?.content || "");
      setSelectedVersion(currentVersion || null);
    } else {
      setTitle("");
      setDescription("");
      setContent(initialContent || "");
      setSelectedVersion(null);
    }
  }, [prompt, initialContent]);

  const handleSave = () => {
    if (!title.trim() || !content.trim()) return;
    onSave(prompt?.id || null, content, title, description);
    onClose();
  };

  const handleVersionSelect = (version: PromptVersion) => {
    setSelectedVersion(version);
    setContent(version.content);
    if (prompt) {
      onVersionSwitch(prompt.id, version.id);
    }
    setShowVersions(false);
  };

  const isNewPrompt = !prompt;
  const hasChanges = prompt
    ? content !==
        prompt.versions.find((v) => v.id === prompt.currentVersionId)
          ?.content ||
      title !== prompt.title ||
      description !== prompt.description
    : title.trim() !== "" || content.trim() !== "";

  return (
    <div className="fixed inset-0 bg-black/60 dark:bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-[var(--bg-surface)] border border-[var(--border-primary)] rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border-primary)]">
          <div className="flex items-center gap-3">
            <span className="text-green-400 font-mono">
              {isNewPrompt ? "$ new_prompt" : "$ edit_prompt"}
            </span>
            {prompt && (
              <div className="relative">
                <button
                  onClick={() => setShowVersions(!showVersions)}
                  className="flex items-center gap-2 px-3 py-1 bg-[var(--bg-surface-hover)] rounded text-sm font-mono text-[var(--text-primary)] hover:bg-[var(--bg-surface-active)] transition-colors"
                >
                  <GitBranch size={14} className="text-purple-400" />
                  {t("v")}
                  {selectedVersion?.versionNumber || prompt.versions.length}
                  <ChevronDown size={14} />
                </button>

                {showVersions && (
                  <div className="absolute top-full left-0 mt-1 bg-[var(--bg-surface)] border border-[var(--border-primary)] rounded shadow-lg z-10 min-w-[250px]">
                    <div className="p-2 border-b border-[var(--border-primary)] text-xs text-[var(--text-muted)] font-mono uppercase tracking-tighter">
                      {t("versionHistory")}
                    </div>
                    {prompt.versions
                      .slice()
                      .reverse()
                      .map((version) => (
                        <button
                          key={version.id}
                          onClick={() => handleVersionSelect(version)}
                          className={cn(
                            "w-full px-3 py-2 text-left text-sm font-mono flex items-center justify-between hover:bg-[var(--bg-surface-hover)] transition-colors",
                            version.id === selectedVersion?.id
                              ? "bg-[var(--bg-surface-active)] text-[var(--acc-primary)]"
                              : "text-[var(--text-primary)]",
                          )}
                        >
                          <span className="flex items-center gap-2">
                            <GitBranch size={12} />
                            Version {version.versionNumber}
                          </span>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock size={10} />
                            {format(version.createdAt, "MMM d, yyyy", {
                              locale: dateLocale,
                            })}
                          </span>
                        </button>
                      ))}
                  </div>
                )}
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] rounded transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs text-[var(--text-muted)] font-mono mb-1 uppercase tracking-tighter">
              {t("promptTitle")}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="..."
              className="w-full bg-black/5 dark:bg-black/50 border border-[var(--border-primary)] rounded px-3 py-2 text-[var(--acc-primary)] font-mono focus:outline-none focus:border-green-600 transition-colors"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs text-[var(--text-muted)] font-mono mb-1 uppercase tracking-tighter">
              {t("description")}
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="..."
              className="w-full bg-black/5 dark:bg-black/50 border border-[var(--border-primary)] rounded px-3 py-2 text-[var(--text-primary)] font-mono text-sm focus:outline-none focus:border-green-600 transition-colors"
            />
          </div>

          {/* Content */}
          <div className="flex-1">
            <label className="block text-xs text-[var(--text-muted)] font-mono mb-1 uppercase tracking-tighter">
              {t("content")}
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="..."
              rows={12}
              className="w-full bg-black/5 dark:bg-black/50 border border-[var(--border-primary)] rounded px-3 py-2 text-[var(--text-primary)] font-mono text-sm focus:outline-none focus:border-green-600 transition-colors resize-none"
            />
          </div>

          {/* Info about auto-tagging */}
          <div className="bg-[var(--bg-surface-hover)] rounded p-3 text-xs text-[var(--text-muted)] font-mono">
            <span className="text-purple-400">ℹ</span> {t("tags")}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-[var(--border-primary)]">
          <div className="text-xs text-[var(--text-muted)] font-mono lowercase opacity-60">
            {hasChanges && (
              <span className="text-yellow-600 dark:text-yellow-500">
                ● {t("save")}?
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] rounded transition-colors"
            >
              {t("cancel")}
            </button>
            <button
              onClick={handleSave}
              disabled={!title.trim() || !content.trim()}
              className={cn(
                "px-4 py-2 text-sm font-mono rounded flex items-center gap-2 transition-colors",
                title.trim() && content.trim()
                  ? "bg-green-600 text-white hover:bg-green-500"
                  : "bg-gray-700 text-gray-500 cursor-not-allowed",
              )}
            >
              {isNewPrompt ? <Plus size={16} /> : <Save size={16} />}
              {isNewPrompt ? t("newTitle") : t("save")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
