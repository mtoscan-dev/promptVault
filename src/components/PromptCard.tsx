import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { useTranslations, useLocale } from "next-intl";
import { GitBranch, Clock, Trash2, Edit3, Check } from "lucide-react";
import { Prompt } from "@/types";
import { TagBadge } from "@/components/TagBadge";

interface PromptCardProps {
  prompt: Prompt;
  onSelect: (prompt: Prompt) => void;
  onDelete: (id: string) => void;
  onTagSearch: (tag: string) => void;
  onTagRemove: (promptId: string, tag: string) => void;
  onTagAdd: (promptId: string, tag: string) => void;
  tagCounts: Record<string, number>;
}

export function PromptCard({
  prompt,
  onSelect,
  onDelete,
  onTagSearch,
  onTagRemove,
  onTagAdd,
  tagCounts,
}: PromptCardProps) {
  const t = useTranslations("PromptCard");
  const tCommon = useTranslations("Common");
  const locale = useLocale();
  const dateLocale = locale === "es" ? es : enUS;

  const [copied, setCopied] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [activeTagMenu, setActiveTagMenu] = useState<string | null>(null);
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTagName, setNewTagName] = useState("");

  const currentVersion = prompt.versions.find(
    (v) => v.id === prompt.currentVersionId,
  );
  const content = currentVersion?.content || "";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent | React.MouseEvent) => {
    e.stopPropagation();
    if (newTagName.trim()) {
      onTagAdd(prompt.id, newTagName.trim());
      setNewTagName("");
      setIsAddingTag(false);
    }
  };

  return (
    <div
      className="group relative overflow-hidden bg-[var(--bg-surface)] border border-[var(--border-primary)] rounded-lg p-3 hover:border-green-600/50 transition-all duration-300 cursor-pointer hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-green-900/20 active:translate-y-0"
      onClick={handleCopy}
    >
      {/* ... previous overlays ... */}
      <div
        className={`absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-300 ${
          copied
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="bg-green-500 rounded-full p-2 shadow-lg shadow-green-500/20">
            <Check className="text-black" size={20} />
          </div>
          <span className="text-green-400 font-mono font-bold text-sm tracking-widest uppercase">
            {t("copied")}
          </span>
        </div>
      </div>

      <div
        className={`absolute inset-0 z-30 flex items-center justify-center bg-gray-950/90 backdrop-blur-md transition-all duration-300 ${
          showDeleteConfirm
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <div className="flex flex-col items-center gap-4 p-4 w-full max-w-[200px]">
          <div className="text-red-500 font-mono text-[10px] font-bold tracking-tighter uppercase mb-1 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-red-500 animate-pulse rounded-full" />
            {t("deleteConfirm")}
          </div>
          <div className="flex gap-2 w-full">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteConfirm(false);
              }}
              className="flex-1 py-1 px-2 border border-gray-700 hover:bg-gray-800 text-gray-400 text-[10px] font-mono uppercase tracking-wider transition-colors rounded"
            >
              {t("abort")}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(prompt.id);
                setShowDeleteConfirm(false);
              }}
              className="flex-1 py-1 px-2 bg-red-950/30 border border-red-900/50 hover:bg-red-900/50 text-red-500 text-[10px] font-mono uppercase tracking-wider transition-all rounded shadow-lg shadow-red-900/20"
            >
              {t("exterminate")}
            </button>
          </div>
        </div>
      </div>

      {/* Tags Command Overlay - Global Close Handler */}
      {activeTagMenu && (
        <div
          className="absolute inset-0 z-40 bg-black/20"
          onClick={(e) => {
            e.stopPropagation();
            setActiveTagMenu(null);
          }}
        />
      )}

      {/* Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-green-500/5 to-transparent h-[50%] w-full animate-scanline" />
      </div>

      {/* Header */}
      <div className="relative flex items-start justify-between gap-2 mb-2">
        <div className="flex-1">
          <h3 className="text-green-400 font-mono font-bold text-base flex items-center gap-2 group-hover:text-green-300 transition-colors">
            <span className="text-gray-500">$</span>
            {prompt.title}
          </h3>
          <p className="text-[var(--text-secondary)] text-[10px] font-mono leading-tight">
            # {prompt.description}
          </p>
        </div>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(prompt);
            }}
            className="p-1.5 text-[var(--text-muted)] hover:text-green-400 hover:bg-[var(--bg-surface-hover)] rounded transition-colors"
            title={t("edit")}
          >
            <Edit3 size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowDeleteConfirm(true);
            }}
            className="p-1.5 text-[var(--text-muted)] hover:text-red-400 hover:bg-[var(--bg-surface-hover)] rounded transition-colors"
            title={t("delete")}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Content preview */}
      <div className="bg-black/10 dark:bg-black/40 rounded p-2 mb-2 border border-[var(--border-primary)]">
        <pre className="text-[var(--text-secondary)] text-xs font-mono whitespace-pre-wrap line-clamp-2">
          {content}
        </pre>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-2">
        {prompt.tags.map((tag) => (
          <div key={tag} className="relative z-50">
            <TagBadge
              name={tag}
              onClick={() =>
                setActiveTagMenu(activeTagMenu === tag ? null : tag)
              }
            />
            {activeTagMenu === tag && (
              <div className="absolute bottom-full left-0 mb-1 flex items-center gap-1 bg-gray-950 border border-gray-700 rounded p-1 shadow-2xl animate-in fade-in slide-in-from-bottom-1 duration-200">
                {tagCounts[tag] > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onTagSearch(tag);
                        setActiveTagMenu(null);
                      }}
                      className="px-2 py-0.5 text-[10px] font-mono font-bold text-green-500/70 hover:text-green-400 hover:bg-green-500/10 transition-all"
                    >
                      [{tCommon("searchAction")}]
                    </button>
                    <div className="w-px h-3 bg-gray-800" />
                  </>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onTagRemove(prompt.id, tag);
                    setActiveTagMenu(null);
                  }}
                  className="px-2 py-0.5 text-[10px] font-mono font-bold text-red-500/70 hover:text-red-400 hover:bg-red-500/10 transition-all"
                >
                  [{tCommon("deleteAction")}]
                </button>
              </div>
            )}
          </div>
        ))}

        {/* Add Tag Button / Input */}
        <div className="relative z-50 flex items-center">
          {isAddingTag ? (
            <div className="flex items-center bg-gray-900 border border-green-500/50 rounded px-1 animate-in fade-in zoom-in-95 duration-200">
              <span className="text-green-500 text-[10px] font-mono mr-1">
                $
              </span>
              <input
                autoFocus
                type="text"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value.toLowerCase())}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddTag(e);
                  if (e.key === "Escape") {
                    setIsAddingTag(false);
                    setNewTagName("");
                  }
                }}
                onBlur={() => {
                  if (!newTagName.trim()) setIsAddingTag(false);
                }}
                className="w-16 bg-transparent text-green-400 outline-none font-mono text-[10px] uppercase tracking-tighter"
                spellCheck={false}
              />
            </div>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsAddingTag(true);
              }}
              className="opacity-0 group-hover:opacity-100 px-2 py-0.5 border border-dashed border-gray-700 text-[10px] font-mono rounded text-gray-500 hover:text-green-400 hover:border-green-500/50 transition-all uppercase tracking-tighter shrink-0"
            >
              [ {t("addTag")} + ]
            </button>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-[var(--text-muted)] font-mono">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <GitBranch size={12} />v{prompt.versions.length}
          </span>
          <span className="flex items-center gap-1" suppressHydrationWarning>
            <Clock size={12} />
            {formatDistanceToNow(prompt.updatedAt, {
              locale: dateLocale,
              addSuffix: true,
            })}
          </span>
        </div>
        <span className="text-[var(--text-muted)] opacity-60">
          id:{prompt.id.slice(0, 8)}
        </span>
      </div>
    </div>
  );
}
