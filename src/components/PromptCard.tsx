import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { useTranslations, useLocale } from "next-intl";
import { GitBranch, Clock, Trash2, Edit3, Check, Copy } from "lucide-react";
import { Prompt } from "@/types";
import { TagBadge } from "@/components/TagBadge";
import { useSettings } from "@/contexts/SettingsContext";

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

  const { exportLanguage } = useSettings();

  // Determine display content based on locale
  const displayTitle =
    (locale === "es" ? prompt.titleEs : prompt.titleEn) || prompt.title;
  const displayDescription =
    (locale === "es" ? prompt.descriptionEs : prompt.descriptionEn) ||
    prompt.description;
  const content = prompt.content || "";

  const handleCopy = async () => {
    try {
      let textToCopy = content;
      let langTag = "";

      if (exportLanguage === "es") {
        if (prompt.contentEs) {
          textToCopy = prompt.contentEs;
          langTag = " [ES]";
        } else {
          textToCopy = `${content}\n\n--------------------------------------------------\n[SYSTEM]: The prompt does not exist in the selected export language (${exportLanguage.toUpperCase()}).\n[SISTEMA]: El prompt no existe en el idioma de exportación seleccionado.`;
          langTag = " [ORIGINAL]";
        }
      } else if (exportLanguage === "en") {
        if (prompt.contentEn) {
          textToCopy = prompt.contentEn;
          langTag = " [EN]";
        } else {
          textToCopy = `${content}\n\n--------------------------------------------------\n[SYSTEM]: The prompt does not exist in the selected export language (EN).\n[SISTEMA]: El prompt no existe en el idioma de exportación seleccionado.`;
          langTag = " [ORIGINAL]";
        }
      }

      await navigator.clipboard.writeText(textToCopy);
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
      className="group relative overflow-hidden bg-(--bg-surface) border border-(--border-primary) rounded-lg p-3 hover:border-green-500/50 transition-all duration-300 cursor-pointer hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-green-900/20 active:translate-y-0 h-full flex flex-col"
      onClick={(e) => {
        e.stopPropagation();
        onSelect(prompt);
      }}
    >
      {/* Copied Overlay */}
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
            {t("copied")}{" "}
            {exportLanguage !== "original" &&
              `[${exportLanguage.toUpperCase()}]`}
          </span>
        </div>
      </div>

      {/* Delete Confirmation Overlay */}
      <div
        className={`absolute inset-0 z-30 flex items-center justify-center bg-(--bg-surface)/95 backdrop-blur-md transition-all duration-300 ${
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
              className="flex-1 py-1 px-2 border border-(--border-primary) hover:bg-(--bg-surface-hover) text-(--text-secondary) hover:text-(--text-primary) text-[10px] font-mono uppercase tracking-wider transition-colors rounded"
            >
              {t("abort")}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(prompt.id);
                setShowDeleteConfirm(false);
              }}
              className="flex-1 py-1 px-2 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-500 text-[10px] font-mono uppercase tracking-wider transition-all rounded shadow-lg shadow-red-500/10"
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
        <div className="flex-1 min-w-0">
          <h3
            className="text-green-400 font-mono font-bold text-base flex items-start gap-2 group-hover:text-green-300 transition-colors line-clamp-2 min-h-12 tracking-tight leading-snug"
            title={displayTitle}
          >
            <span className="text-gray-500 mt-1 select-none">$</span>
            {displayTitle}
          </h3>
          <p
            className="text-(--text-secondary) text-[10px] font-mono leading-relaxed mt-1 line-clamp-3 overflow-hidden text-ellipsis"
            title={displayDescription}
          >
            {displayDescription}
          </p>
        </div>
        <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
          {/* Copy Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCopy();
            }}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors flex items-center justify-center"
            title={copied ? "Copied!" : "Copy to clipboard"}
          >
            {copied ? (
              <Check size={14} className="text-green-400" />
            ) : (
              <Copy size={14} />
            )}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(prompt);
            }}
            className="p-1.5 text-(--text-muted) hover:text-green-400 hover:bg-(--bg-surface-hover) rounded transition-colors flex items-center justify-center"
            title={t("edit")}
          >
            <Edit3 size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowDeleteConfirm(true);
            }}
            className="p-1.5 text-(--text-muted) hover:text-red-400 hover:bg-(--bg-surface-hover) rounded transition-colors flex items-center justify-center"
            title={t("delete")}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Content preview */}
      <div className="bg-zinc-950 rounded-md p-3 mb-3 border border-white/5 shadow-inner grow">
        <pre className="text-green-400/80 text-xs font-mono whitespace-pre-wrap line-clamp-4 leading-relaxed tracking-wide select-none">
          {content}
        </pre>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-2 mt-auto">
        {prompt.tags.map((tag) => (
          <div
            key={tag}
            className={`relative ${activeTagMenu === tag ? "z-50" : "z-10"}`}
          >
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
        <div
          className={`relative flex items-center ${isAddingTag ? "z-50" : "z-10"}`}
        >
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
      <div className="flex items-center justify-between text-xs text-(--text-muted) font-mono pt-2 border-t border-white/5">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 text-[10px]">
            <GitBranch size={10} />v{prompt.versions.length}
          </span>
          <span
            className="flex items-center gap-1 text-[10px]"
            suppressHydrationWarning
          >
            <Clock size={10} />
            {formatDistanceToNow(prompt.updatedAt, {
              locale: dateLocale,
              addSuffix: true,
            })}
          </span>
        </div>
        <span className="text-(--text-muted) opacity-40 text-[10px]">
          id:{prompt.id.slice(0, 4)}
        </span>
      </div>
    </div>
  );
}
