import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  X,
  Save,
  GitBranch,
  Clock,
  ChevronDown,
  Plus,
  Languages,
  Sparkles,
  Zap,
  BarChart2,
  Copy,
  RefreshCw,
  Check,
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { es, enUS } from "date-fns/locale";
import { useSettings } from "@/contexts/SettingsContext";
import { Prompt, PromptVersion } from "@/types";
import { cn } from "@/utils/cn";
import { translatePromptFields } from "@/app/actions/forge-ai";

interface PromptEditorProps {
  prompt: Prompt | null;
  initialContent?: string;
  onClose: () => void;
  onSave: (
    id: string | null,
    content: string,
    title: string,
    description: string,
    contentEs?: string | null,
    contentEn?: string | null,
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
  const [isAutoSuggestEnabled, setIsAutoSuggestEnabled] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<number | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Bilingual Content State
  // We keep track of the specific language versions if they exist
  const [contentEs, setContentEs] = useState<string | null>(null);
  const [contentEn, setContentEn] = useState<string | null>(null);

  useEffect(() => {
    if (prompt) {
      setTitle(prompt.title);
      setDescription(prompt.description);
      const currentVersion = prompt.versions.find(
        (v) => v.id === prompt.currentVersionId,
      );
      setContent(currentVersion?.content || "");
      setSelectedVersion(currentVersion || null);

      // Load existing bilingual content
      setContentEs(prompt.contentEs || null);
      setContentEn(prompt.contentEn || null);
    } else {
      setTitle("");
      setDescription("");
      setContent(initialContent || "");
      setSelectedVersion(null);
      setContentEs(null);
      setContentEn(null);
    }
  }, [prompt, initialContent]);

  const handleSave = () => {
    if (!title.trim() || !content.trim()) return;

    // Final sync before save:
    // If we are in "es" locale (or logic), we assume current UI is ES.
    // If we are in "en", current UI is EN.
    // However, the user might be editing EITHER.
    // Lacking explicit language toggle in UI, we rely on the heuristic used in Translate.
    // BUT, we should probably update the "current" one based on what we have.
    // Actually, `content` is the MASTER. `contentEs/En` are valid translations.
    // If I just translated to EN, `content` IS English. `contentEn` should be updated to `content`.
    // We'll handle this sync inside handleTranslate mostly.
    // Here we just pass what we have.

    onSave(
      prompt?.id || null,
      content,
      title,
      description,
      contentEs,
      contentEn,
    );
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

  // Get User Preference
  const { exportLanguage } = useSettings();

  const handleTranslate = async () => {
    // 1. Identify Preferred Language (User's Context)
    // If exportLanguage is 'original', fall back to locale.
    const preferredLang =
      exportLanguage === "original" ? locale : exportLanguage;
    const isEsPreferred = preferredLang === "es";

    // 2. Identify Source and Target
    // We assume the User is looking at/editing the "Source".
    // Or, we check which buckets are available.

    // Heuristic:
    // If we have content in Preferred bucket, we treat that as source (User might have edited it).
    // If Preferred bucket is empty, but we have the Other bucket, that Other is source.

    let sourceContent = { title, description, content };
    let targetLang: "es" | "en" = isEsPreferred ? "en" : "es"; // Default target is opposite of preferred

    // Current State Check
    const hasEs = !!(contentEs || (isEsPreferred && content)); // Simplified check
    const hasEn = !!(contentEn || (!isEsPreferred && content));

    // Gap Filling Logic
    if (isEsPreferred) {
      // Prefer Spanish.
      if (hasEs && !hasEn) {
        // Have ES, Missing EN -> Translate to EN
        targetLang = "en";
      } else if (!hasEs && hasEn) {
        // Missing ES, Have EN -> Translate to ES
        targetLang = "es";
      } else if (hasEs && hasEn) {
        // Have Both -> Assume we want to update the Translation form the Preferred (ES -> EN)
        targetLang = "en";
      }
    } else {
      // Prefer English/Other
      if (hasEn && !hasEs) {
        // Have EN, Missing ES -> Translate to ES
        targetLang = "es";
      } else if (!hasEn && hasEs) {
        // Missing EN, Have ES -> Translate to EN
        targetLang = "en";
      } else if (hasEn && hasEs) {
        // Have Both -> Update ES from EN
        targetLang = "es";
      }
    }

    // Determine Source Data based on Target
    // If Target is ES, Source is EN.
    if (targetLang === "es") {
      // If we are currently viewing EN, take current state.
      // If we are viewing ES (but generating ES?), that implies we are fixing ES.
      // Let's assume current editor state IS the source content if it matches the source lang.
      // BUT, checking "isEsPreferred" helps.
      if (!isEsPreferred) {
        // We are EN user, so current state is EN.
        sourceContent = { title, description, content };
      } else {
        // We are ES user. If we are translating TO ES, it means we didn't have it.
        // So current state MUST be EN (loaded fallback) or we look at contentEn var.
        // Ideally use current state as it handles unsaved edits.
        sourceContent = { title, description, content };
      }
    } else {
      // Target is EN. Source is ES.
      sourceContent = { title, description, content };
    }

    if (!sourceContent.title && !sourceContent.content) return;

    setIsAnalyzing(true);

    try {
      const result = await translatePromptFields(sourceContent, targetLang);

      if (result.success && result.data) {
        // Save result to the correct bucket
        if (targetLang === "es") {
          setContentEs(result.data.content);
          // Updating UI: "Show according to selected language"
          // If preferred is ES, and we just generated ES, show it!
          if (isEsPreferred) {
            if (result.data.title) setTitle(result.data.title);
            if (result.data.description)
              setDescription(result.data.description);
            if (result.data.content) setContent(result.data.content);
          }
        } else {
          setContentEn(result.data.content);
          // If preferred is EN, and we generated EN, show it.
          if (!isEsPreferred) {
            if (result.data.title) setTitle(result.data.title);
            if (result.data.description)
              setDescription(result.data.description);
            if (result.data.content) setContent(result.data.content);
          }
        }
        console.log(
          `Translated to ${targetLang}. Displaying: ${isEsPreferred ? "ES" : "Non-ES"}`,
        );
      }
    } catch (e) {
      console.error("Translation failed", e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setAnalysisResult(null);

    // Mock analysis delay
    setTimeout(() => {
      const mockScore = Math.floor(Math.random() * 40) + 60; // Random score 60-100
      setAnalysisResult(mockScore);
      setIsAnalyzing(false);
    }, 1500);
  };

  const toggleAutoSuggest = () => {
    setIsAutoSuggestEnabled(!isAutoSuggestEnabled);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-400 border-green-400";
    if (score >= 70) return "text-yellow-400 border-yellow-400";
    return "text-red-400 border-red-400";
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
      <div className="bg-(--bg-surface) border border-(--border-primary) rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-(--border-primary)">
          <div className="flex items-center gap-3">
            <span className="text-green-400 font-mono">
              {isNewPrompt ? "$ new_prompt" : "$ edit_prompt"}
            </span>
            {prompt && (
              <div className="relative">
                <button
                  onClick={() => setShowVersions(!showVersions)}
                  className="flex items-center gap-2 px-3 py-1 bg-(--bg-surface-hover) rounded text-sm font-mono text-(--text-primary) hover:bg-(--bg-surface-active) transition-colors"
                >
                  <GitBranch size={14} className="text-purple-400" />
                  {t("v")}
                  {selectedVersion?.versionNumber || prompt.versions.length}
                  <ChevronDown size={14} />
                </button>

                {showVersions && (
                  <div className="absolute top-full left-0 mt-1 bg-(--bg-surface) border border-(--border-primary) rounded shadow-lg z-10 min-w-[250px]">
                    <div className="p-2 border-b border-(--border-primary) text-xs text-(--text-muted) font-mono uppercase tracking-tighter">
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
                            "w-full px-3 py-2 text-left text-sm font-mono flex items-center justify-between hover:bg-(--bg-surface-hover) transition-colors",
                            version.id === selectedVersion?.id
                              ? "bg-(--bg-surface-active) text-(--acc-primary)"
                              : "text-(--text-primary)",
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
            className="p-2 text-(--text-muted) hover:text-(--text-primary) hover:bg-(--bg-surface-hover) rounded transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs text-(--text-muted) font-mono mb-1 uppercase tracking-tighter">
              {t("promptTitle")}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="..."
              className="w-full bg-black/5 dark:bg-black/50 border border-(--border-primary) rounded px-3 py-2 text-(--acc-primary) font-mono focus:outline-none focus:border-green-600 transition-colors"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs text-(--text-muted) font-mono mb-1 uppercase tracking-tighter">
              {t("description")}
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="..."
              className="w-full bg-black/5 dark:bg-black/50 border border-(--border-primary) rounded px-3 py-2 text-(--text-primary) font-mono text-sm focus:outline-none focus:border-green-600 transition-colors"
            />
          </div>

          {/* Content */}
          <div className="flex-1">
            <label className="block text-xs text-(--text-muted) font-mono mb-1 uppercase tracking-tighter">
              {t("content")}
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="..."
              rows={12}
              className="w-full bg-black/5 dark:bg-black/50 border border-(--border-primary) rounded px-3 py-2 text-(--text-primary) font-mono text-sm focus:outline-none focus:border-green-600 transition-colors resize-none"
            />
          </div>

          {/* Info about auto-tagging */}
          <div className="bg-(--bg-surface-hover) rounded p-3 text-xs text-(--text-muted) font-mono">
            <span className="text-purple-400">ℹ</span> {t("tags")}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-(--border-primary)">
          <div className="flex items-center gap-2 py-1 px-1 bg-black/20 rounded border border-white/5 overflow-x-auto">
            <button
              onClick={handleTranslate}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-gray-400 hover:text-white hover:bg-white/5 rounded transition-colors whitespace-nowrap"
              title={t("translate")}
            >
              <Languages size={14} className="text-blue-400" />
              <span>{t("translate")}</span>
            </button>

            <div className="w-px h-4 bg-white/10" />

            <div className="flex items-center gap-2">
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-gray-400 hover:text-white hover:bg-white/5 rounded transition-colors whitespace-nowrap disabled:opacity-50"
                title={t("analyze")}
              >
                <BarChart2 size={14} className="text-purple-400" />
                <span>{t("analyze")}</span>
              </button>

              {/* Analysis Result */}
              {(analysisResult !== null || isAnalyzing) && (
                <div className="flex items-center gap-2 px-2 py-1 bg-black/40 rounded border border-white/10">
                  {isAnalyzing ? (
                    <span className="text-[10px] text-purple-400 animate-pulse font-mono">
                      {t("analyzing")}
                    </span>
                  ) : (
                    <>
                      <span className="text-[10px] text-gray-500 font-mono">
                        {t("score")}:
                      </span>
                      <span
                        className={cn(
                          "text-xs font-bold font-mono",
                          analysisResult &&
                            (analysisResult >= 90
                              ? "text-green-400"
                              : analysisResult >= 70
                                ? "text-yellow-400"
                                : "text-red-400"),
                        )}
                      >
                        {analysisResult}/100
                      </span>
                      {/* Simple progress bar */}
                      <div className="w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden ml-1">
                        <div
                          className={cn(
                            "h-full transition-all duration-500",
                            analysisResult &&
                              (analysisResult >= 90
                                ? "bg-green-500"
                                : analysisResult >= 70
                                  ? "bg-yellow-500"
                                  : "bg-red-500"),
                          )}
                          style={{ width: `${analysisResult}%` }}
                        />
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="w-px h-4 bg-white/10" />

            <button
              onClick={toggleAutoSuggest}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded transition-colors whitespace-nowrap",
                isAutoSuggestEnabled
                  ? "text-yellow-400 bg-yellow-400/10 hover:bg-yellow-400/20"
                  : "text-gray-400 hover:text-white hover:bg-white/5",
              )}
              title={t("autoSuggest")}
            >
              <Sparkles
                size={14}
                className={isAutoSuggestEnabled ? "fill-yellow-400" : ""}
              />
              <span>{t("autoSuggest")}</span>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-xs text-(--text-muted) font-mono lowercase opacity-60 mr-2">
              {hasChanges && (
                <span className="text-yellow-600 dark:text-yellow-500">
                  ● {t("save")}?
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-mono text-(--text-muted) hover:text-(--text-primary) hover:bg-(--bg-surface-hover) rounded transition-colors"
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
