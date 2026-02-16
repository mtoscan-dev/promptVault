import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  X,
  Save,
  GitBranch,
  Clock,
  ChevronDown,
  Plus,
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
import {
  translatePromptFields,
  generatePromptMetadata,
} from "@/app/actions/forge-ai";
import { useProcessSimulator } from "@/hooks/useProcessSimulator";
import { PromptToolbar } from "./PromptToolbar";

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
    titleEs?: string | null,
    titleEn?: string | null,
    descriptionEs?: string | null,
    descriptionEn?: string | null,
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
  const { exportLanguage } = useSettings();
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
  // Analysis State
  const [analysisResult, setAnalysisResult] = useState<number | null>(null);

  // Process Simulators
  const translateProcess = useProcessSimulator();
  const analyzeProcess = useProcessSimulator();
  const suggestProcess = useProcessSimulator();

  // Bilingual Content State
  // We keep track of the specific language versions if they exist
  const [contentEs, setContentEs] = useState<string | null>(null);
  const [contentEn, setContentEn] = useState<string | null>(null);

  // Bilingual Metadata State
  const [titleEs, setTitleEs] = useState<string | null>(null);
  const [titleEn, setTitleEn] = useState<string | null>(null);
  const [descriptionEs, setDescriptionEs] = useState<string | null>(null);
  const [descriptionEn, setDescriptionEn] = useState<string | null>(null);

  const handleAutoSuggest = async () => {
    if (!content.trim()) return;

    console.log("[PromptEditor] Manual Auto-Suggest triggered...");

    const suggestMessages = [
      t("status.autoSuggest.reading"),
      t("status.autoSuggest.extracting"),
      t("status.autoSuggest.generating"),
      t("status.autoSuggest.refining"),
    ];

    try {
      await suggestProcess.startProcess(
        suggestMessages,
        async () => {
          // Determine language for metadata
          // If preference is 'original', use the current UI locale as a strong hint
          // instead of 'auto', to prevent small models from defaulting to English.
          const preferredLang =
            exportLanguage === "original" ? locale : exportLanguage;

          console.log(
            "[PromptEditor] Auto-Suggest Preferred Models Lang:",
            preferredLang,
          );

          // Timeout Promise (120s)
          const timeoutPromise = new Promise<{
            success: boolean;
            data?: any;
            error?: string;
          }>((_, reject) => {
            setTimeout(
              () => reject(new Error("Auto-Suggest timed out")),
              120000,
            );
          });

          // Race
          const result = await Promise.race([
            generatePromptMetadata(content, preferredLang),
            timeoutPromise,
          ]);

          if (result.success && result.data) {
            console.log("[PromptEditor] Auto-Suggest success:", result.data);
            setTitle(result.data.title);
            setDescription(result.data.description);
          }
          return result;
        },
        { minDuration: 2000 },
      );
    } catch (error) {
      console.error("[PromptEditor] Auto-Suggest failed:", error);
    }
  };

  // Get User Preference
  console.log(
    "[PromptEditor] Locale:",
    locale,
    "ExportLanguage:",
    exportLanguage,
  );

  useEffect(() => {
    if (prompt) {
      // Determine preferred language
      const preferredLang =
        exportLanguage === "original" ? locale : exportLanguage;
      const isEsPreferred = preferredLang === "es";

      // Load specific language versions if available
      const esContent = prompt.contentEs || null;
      const enContent = prompt.contentEn || null;
      const esTitle = prompt.titleEs || null;
      const enTitle = prompt.titleEn || null;
      const esDesc = prompt.descriptionEs || null;
      const enDesc = prompt.descriptionEn || null;

      const currentVersion = prompt.versions.find(
        (v) => v.id === prompt.currentVersionId,
      );

      // Default to current version/main fields
      let activeTitle = prompt.title;
      let activeDesc = prompt.description;
      let activeContent = currentVersion?.content || "";

      // Override if preference exists in DB
      if (isEsPreferred && esContent) {
        activeContent = esContent;
        if (esTitle) activeTitle = esTitle;
        if (esDesc) activeDesc = esDesc;
      } else if (!isEsPreferred && enContent) {
        // Assuming 'en' or other non-es preference defaults to EN if available
        activeContent = enContent;
        if (enTitle) activeTitle = enTitle;
        if (enDesc) activeDesc = enDesc;
      }

      setTitle(activeTitle);
      setDescription(activeDesc);
      setContent(activeContent);
      setSelectedVersion(currentVersion || null);

      // Store specific versions in state for toggling/saving
      setContentEs(esContent);
      setContentEn(enContent);
      setTitleEs(esTitle);
      setTitleEn(enTitle);
      setDescriptionEs(esDesc);
      setDescriptionEn(enDesc);
    } else {
      setTitle("");
      setDescription("");
      setContent(initialContent || "");
      setSelectedVersion(null);
      setContentEs(null);
      setContentEn(null);
      setTitleEs(null);
      setTitleEn(null);
      setDescriptionEs(null);
      setDescriptionEn(null);
    }
  }, [prompt, initialContent, exportLanguage, locale]);

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
      titleEs,
      titleEn,
      descriptionEs,
      descriptionEn,
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

    console.log("[PromptEditor] Starting translation...", {
      sourceContent,
      targetLang,
    });

    const translateMessages = [
      t("status.translate.detecting"),
      t("status.translate.translating"),
      t("status.translate.adapting"),
      t("status.translate.finalizing"),
    ];

    try {
      await translateProcess.startProcess(
        translateMessages,
        async () => {
          // Create a timeout promise that rejects after 60 seconds
          const timeoutPromise = new Promise<{
            success: boolean;
            data?: any;
            error?: string;
          }>((_, reject) => {
            setTimeout(
              () => reject(new Error("Translation timed out after 120s")),
              120000,
            );
          });

          // Race the translation against the timeout
          const result = await Promise.race([
            translatePromptFields(sourceContent, targetLang),
            timeoutPromise,
          ]);

          console.log("[PromptEditor] Translation result:", result);

          if (result.success && result.data) {
            // Save result to the correct bucket AND update UI
            if (targetLang === "es") {
              // We are switching to ES.
              if (!isEsPreferred) {
                // User was likely editing EN. Backup to EN state.
                setContentEn(content);
                setTitleEn(title);
                setDescriptionEn(description);
              }

              // Set ES state
              setContentEs(result.data.content);
              if (result.data.title) setTitleEs(result.data.title);
              if (result.data.description)
                setDescriptionEs(result.data.description);

              // ALWAYS update UI to show the result
              if (result.data.title) setTitle(result.data.title);
              if (result.data.description)
                setDescription(result.data.description);
              if (result.data.content) setContent(result.data.content);
            } else {
              // targetLang === "en"
              if (isEsPreferred) {
                // User was likely editing ES
                setContentEs(content);
                setTitleEs(title);
                setDescriptionEs(description);
              }

              // Set EN state
              setContentEn(result.data.content);
              if (result.data.title) setTitleEn(result.data.title);
              if (result.data.description)
                setDescriptionEn(result.data.description);

              // ALWAYS update UI to show the result
              if (result.data.title) setTitle(result.data.title);
              if (result.data.description)
                setDescription(result.data.description);
              if (result.data.content) setContent(result.data.content);
            }
            console.log(
              `Translated to ${targetLang}. Updating UI to show result.`,
            );
          }
          return result;
        },
        { minDuration: 2500 },
      );
    } catch (e) {
      console.error("Translation failed", e);
    }
  };

  const handleAnalyze = async () => {
    setAnalysisResult(null);

    const analyzeMessages = [
      t("status.analyze.tokenizing"),
      t("status.analyze.checking"),
      t("status.analyze.evaluating"),
      t("status.analyze.scoring"),
    ];

    await analyzeProcess.startProcess(
      analyzeMessages,
      async () => {
        // Mock analysis delay
        await new Promise((resolve) => setTimeout(resolve, 1500));
        const mockScore = Math.floor(Math.random() * 40) + 60; // Random score 60-100
        setAnalysisResult(mockScore);
      },
      { minDuration: 2000 },
    );
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
      <div className="bg-(--bg-surface) border border-(--border-primary) rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl relative">
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
        <div className="flex-1 overflow-auto p-4 space-y-4 pb-24">
          {/* Title */}
          <div>
            <label className="block text-xs text-(--text-muted) font-mono mb-1 uppercase tracking-tighter">
              {t("promptTitle")}
            </label>
            <div className="relative">
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
                placeholder="..."
                className="w-full bg-black/5 dark:bg-black/50 border border-(--border-primary) rounded px-3 py-2 text-(--acc-primary) font-mono focus:outline-none focus:border-green-600 transition-colors pr-8"
              />
              {suggestProcess.isProcessing && !title.trim() && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Sparkles
                    size={14}
                    className="text-yellow-400 animate-pulse"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs text-(--text-muted) font-mono mb-1 uppercase tracking-tighter">
              {t("description")}
            </label>
            <div className="relative">
              <input
                type="text"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
                placeholder="..."
                className="w-full bg-black/5 dark:bg-black/50 border border-(--border-primary) rounded px-3 py-2 text-(--text-primary) font-mono text-sm focus:outline-none focus:border-green-600 transition-colors pr-8"
              />
              {suggestProcess.isProcessing && !description.trim() && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Sparkles
                    size={14}
                    className="text-yellow-400 animate-pulse"
                  />
                </div>
              )}
            </div>
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
              className="w-full bg-black/5 dark:bg-black/50 border border-(--border-primary) rounded px-3 py-2 text-(--text-primary) font-mono text-sm focus:outline-none focus:border-green-600 transition-colors resize-none mb-12"
            />
          </div>

          {/* Analysis Result (Inline now) */}
          {analysisResult !== null && !analyzeProcess.isProcessing && (
            <div className="bg-black/20 border border-white/5 rounded p-3 flex items-center justify-between">
              <span className="text-xs text-purple-400 font-mono">
                {t("score")}: {analysisResult}/100
              </span>
              <div className="w-32 h-1.5 bg-gray-700/50 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full transition-all duration-300",
                    analysisResult >= 90
                      ? "bg-green-500"
                      : analysisResult >= 70
                        ? "bg-yellow-500"
                        : "bg-red-500",
                  )}
                  style={{ width: `${analysisResult}%` }}
                />
              </div>
            </div>
          )}

          {/* Info about auto-tagging */}
          <div className="bg-(--bg-surface-hover) rounded p-3 text-xs text-(--text-muted) font-mono">
            <span className="text-purple-400">ℹ</span> {t("tags")}
          </div>
        </div>

        {/* Holographic Toolbar (Floating) */}
        <PromptToolbar
          onTranslate={handleTranslate}
          onAnalyze={handleAnalyze}
          onAutoSuggest={handleAutoSuggest}
          translateProcess={translateProcess}
          analyzeProcess={analyzeProcess}
          suggestProcess={suggestProcess}
          hasContent={!!content.trim()}
        />

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-(--border-primary) bg-(--bg-surface)">
          <div className="flex items-center gap-2">
            <div className="text-xs text-(--text-muted) font-mono lowercase opacity-60">
              {hasChanges && (
                <span className="text-yellow-600 dark:text-yellow-500 animate-pulse">
                  ● Unsaved Changes
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
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
                  ? "bg-green-600 text-white hover:bg-green-500 shadow-lg shadow-green-900/20"
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
