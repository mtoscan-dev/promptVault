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
  Info,
  RefreshCw,
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { es, enUS } from "date-fns/locale";
import { useSettings } from "@/contexts/SettingsContext";
import {
  Prompt,
  PromptVersion,
  AnalysisResult,
  SmartTag,
  Taxonomy,
} from "@/types";
import { cn } from "@/utils/cn";
import {
  generatePromptMetadata,
  analyzePromptEnhanced,
  optimizePromptEnhanced,
  suggestSmartTags,
  translatePromptFields,
  checkAIGateway,
  getTaxonomy,
} from "@/app/actions/forge-ai";
import { detectLanguage } from "@/utils/languageDetection";
import { useProcessSimulator } from "@/hooks/useProcessSimulator";
import { PromptToolbar } from "./PromptToolbar";
import { TagBadge } from "./TagBadge";
import { TaxonomyPicker } from "./TaxonomyPicker";
import { PromptEvaluationResults } from "./PromptEvaluationResults";

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
    tags?: string[],
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
  const isEs = locale === "es";
  const dateLocale = locale === "es" ? es : enUS;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [showVersions, setShowVersions] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<PromptVersion | null>(
    null,
  );
  // Analysis State
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null,
  );
  const [isOptimizing, setIsOptimizing] = useState(false);

  // Tagging State
  const [selectedTags, setSelectedTags] = useState<SmartTag[]>([]);
  const [suggestedTags, setSuggestedTags] = useState<SmartTag[]>([]);
  const [showTaxonomyPicker, setShowTaxonomyPicker] = useState(false);
  const [taxonomy, setTaxonomy] = useState<Taxonomy | null>(null);

  // Fetch Taxonomy on Mount
  useEffect(() => {
    getTaxonomy().then((res) => {
      if (res.success && res.data) {
        setTaxonomy(res.data);
      }
    });
  }, []);

  // Process Simulators
  const translateProcess = useProcessSimulator();
  const analyzeProcess = useProcessSimulator();
  const suggestProcess = useProcessSimulator();
  const tagProcess = useProcessSimulator();

  // Bilingual State
  const [viewLanguage, setViewLanguage] = useState<"es" | "en">("en");

  // Bilingual Content State (Buckets)
  const [contentEs, setContentEs] = useState<string | null>(null);
  const [contentEn, setContentEn] = useState<string | null>(null);

  // Bilingual Metadata State
  const [titleEs, setTitleEs] = useState<string | null>(null);
  const [titleEn, setTitleEn] = useState<string | null>(null);
  const [descriptionEs, setDescriptionEs] = useState<string | null>(null);
  const [descriptionEn, setDescriptionEn] = useState<string | null>(null);

  // Switch Language Logic
  const handleLanguageSwitch = (lang: "es" | "en") => {
    if (lang === viewLanguage) return;

    // 1. Save current inputs to the OLD language bucket
    if (viewLanguage === "es") {
      setTitleEs(title);
      setDescriptionEs(description);
      setContentEs(content);
    } else {
      setTitleEn(title);
      setDescriptionEn(description);
      setContentEn(content);
    }

    // 2. Load NEW language bucket to inputs
    if (lang === "es") {
      setTitle(titleEs || "");
      setDescription(descriptionEs || "");
      setContent(contentEs || "");
    } else {
      setTitle(titleEn || "");
      setDescription(descriptionEn || "");
      setContent(contentEn || "");
    }

    // 3. Update View
    setViewLanguage(lang);
    setAnalysisResult(null); // Clear analysis on switch
  };

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
          const preferredLang = viewLanguage;
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
  useEffect(() => {
    if (prompt) {
      // Determine preferred language
      const preferredLang =
        exportLanguage === "original" ? locale : exportLanguage;

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

      // Initialize bucket state
      setContentEs(esContent);
      setContentEn(enContent);
      setTitleEs(esTitle);
      setTitleEn(enTitle);
      setDescriptionEs(esDesc);
      setDescriptionEn(enDesc);

      // Determine Initial View Language and Active Content
      let initialView: "es" | "en" = locale === "es" ? "es" : "en";

      if (locale === "es") {
        if (esContent) {
          initialView = "es";
          activeContent = esContent;
          if (esTitle) activeTitle = esTitle;
          if (esDesc) activeDesc = esDesc;
        } else if (enContent) {
          initialView = "en";
          activeContent = enContent;
          if (enTitle) activeTitle = enTitle;
          if (enDesc) activeDesc = enDesc;
        }
      } else {
        // EN Site Locale
        if (enContent) {
          initialView = "en";
          activeContent = enContent;
          if (enTitle) activeTitle = enTitle;
          if (enDesc) activeDesc = enDesc;
        } else if (esContent) {
          initialView = "es";
          activeContent = esContent;
          if (esTitle) activeTitle = esTitle;
          if (esDesc) activeDesc = esDesc;
        }
      }

      setViewLanguage(initialView);
      setTitle(activeTitle);
      setDescription(activeDesc);
      setContent(activeContent);
      setSelectedVersion(currentVersion || null);

      // Restore Tags
      if (taxonomy) {
        const hydratedTags = prompt.tags
          .map((id) => taxonomy.tags.find((t) => t.id === id))
          .filter((t): t is SmartTag => !!t);
        setSelectedTags(hydratedTags);
      }
    } else {
      // New Prompt
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
      setSelectedTags([]);
      // Default view language to locale
      setViewLanguage(locale === "es" ? "es" : "en");
    }
  }, [prompt, initialContent, exportLanguage, locale, taxonomy]);

  // Health Check
  useEffect(() => {
    checkAIGateway().then((result) => {
      console.log("[PromptEditor] AI Gateway Check:", result);
      if (!result.success && result.hint) {
        console.warn(`[PromptEditor] ⚠️ ${result.hint}`);
      }
    });
  }, []);

  // Auto-Detect Language on Content Change
  useEffect(() => {
    const handler = setTimeout(() => {
      if (!content.trim()) return;

      const detected = detectLanguage(content);
      if (detected && detected !== viewLanguage) {
        setViewLanguage(detected);
      }
    }, 1000); // 1s debounce

    return () => clearTimeout(handler);
  }, [content, viewLanguage]);

  // Auto-Tag on Content Change
  useEffect(() => {
    const handler = setTimeout(() => {
      if (!content.trim() || content.length < 50) return;

      // Prevent auto-tagging if:
      // 1. We have tags assigned.
      // 2. The content hasn't changed from the original loaded version (no modifications).
      if (prompt && selectedTags.length > 0) {
        // Determine the original content for the current view language
        let originalContent = null;
        if (viewLanguage === "es") {
          originalContent =
            prompt.contentEs ||
            (prompt.content && !prompt.contentEn ? prompt.content : null);
        } else {
          originalContent =
            prompt.contentEn ||
            (prompt.content && !prompt.contentEs ? prompt.content : null);
        }

        // If content matches the original (persisted) version, skip auto-tagging
        // But be careful: if originalContent is null, we can't compare.
        // We only skip if content === originalContent.
        if (content === originalContent) {
          return;
        }
      }

      handleAutoTag();
    }, 2000); // 2s debounce

    return () => clearTimeout(handler);
  }, [content, prompt, selectedTags.length, viewLanguage]);

  const handleAutoTag = async () => {
    if (!content.trim()) return;
    setSuggestedTags([]);

    const tagMessages = [
      t("status.tagging.analyzing"),
      t("status.tagging.referencing"),
      t("status.tagging.categorizing"),
      t("status.tagging.validating"),
    ];

    try {
      await tagProcess.startProcess(
        tagMessages,
        async () => {
          const result = await suggestSmartTags(content, viewLanguage);
          if (result.success && Array.isArray(result.data)) {
            const newSuggestions = result.data.filter(
              (suggested: SmartTag) =>
                !selectedTags.some((s) => s.id === suggested.id),
            );
            setSuggestedTags(newSuggestions);
          }
          return result;
        },
        { minDuration: 1500 },
      );
    } catch (error) {
      console.error(error);
    }
  };

  const toggleTag = (tag: SmartTag) => {
    setSelectedTags((prev) =>
      prev.some((t) => t.id === tag.id)
        ? prev.filter((t) => t.id !== tag.id)
        : [...prev, tag],
    );
    setSuggestedTags((prev) => prev.filter((t) => t.id !== tag.id));
  };

  const handleSave = () => {
    if (!title.trim() || !content.trim()) return;

    // Sync current inputs to their bucket before saving
    let finalContentEs = contentEs;
    let finalContentEn = contentEn;
    let finalTitleEs = titleEs;
    let finalTitleEn = titleEn;
    let finalDescEs = descriptionEs;
    let finalDescEn = descriptionEn;

    if (viewLanguage === "es") {
      finalContentEs = content;
      finalTitleEs = title;
      finalDescEs = description;
    } else {
      finalContentEn = content;
      finalTitleEn = title;
      finalDescEn = description;
    }

    onSave(
      prompt?.id || null,
      content,
      title,
      description,
      finalContentEs,
      finalContentEn,
      finalTitleEs,
      finalTitleEn,
      finalDescEs,
      finalDescEn,
      selectedTags.map((t) => t.id),
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

  const isUnsynced = (() => {
    if (viewLanguage === "es") {
      const modified =
        title !== titleEs ||
        description !== descriptionEs ||
        content !== contentEs;
      return modified;
    } else {
      const modified =
        title !== titleEn ||
        description !== descriptionEn ||
        content !== contentEn;
      return modified;
    }
  })();

  const handleTranslate = async () => {
    const isEsView = viewLanguage === "es";
    let targetLang: "es" | "en" = isEsView ? "en" : "es";

    const fieldsToTranslate: any = {};
    const targetBucket = isEsView
      ? { t: titleEn, d: descriptionEn, c: contentEn }
      : { t: titleEs, d: descriptionEs, c: contentEs };

    if (title !== targetBucket.t) fieldsToTranslate.title = title;
    if (description !== targetBucket.d)
      fieldsToTranslate.description = description;
    if (content !== targetBucket.c) fieldsToTranslate.content = content;

    if (Object.keys(fieldsToTranslate).length === 0) return;

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

          const result = await Promise.race([
            translatePromptFields(fieldsToTranslate, targetLang),
            timeoutPromise,
          ]);

          if (result.success && result.data) {
            // 1. Save Current (Source) to its bucket
            if (isEsView) {
              setContentEs(content);
              setTitleEs(title);
              setDescriptionEs(description);
            } else {
              setContentEn(content);
              setTitleEn(title);
              setDescriptionEn(description);
            }

            // 2. Update Target Bucket
            if (targetLang === "es") {
              setContentEs(result.data.content);
              if (result.data.title) setTitleEs(result.data.title);
              if (result.data.description)
                setDescriptionEs(result.data.description);
            } else {
              setContentEn(result.data.content);
              if (result.data.title) setTitleEn(result.data.title);
              if (result.data.description)
                setDescriptionEn(result.data.description);
            }

            // 3. Switch View to Target
            handleLanguageSwitch(targetLang);

            if (result.data.content) setContent(result.data.content);
            if (result.data.title) setTitle(result.data.title);
            if (result.data.description)
              setDescription(result.data.description);

            // Sync buckets
            if (targetLang === "es") {
              setContentEs(result.data.content || contentEs);
              setTitleEs(result.data.title || titleEs);
              setDescriptionEs(result.data.description || descriptionEs);
            } else {
              setContentEn(result.data.content || contentEn);
              setTitleEn(result.data.title || titleEn);
              setDescriptionEn(result.data.description || descriptionEn);
            }

            setViewLanguage(targetLang);
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

    // Determine which content to analyze — always prefer English
    let contentToAnalyze = content;

    if (viewLanguage === "es") {
      // Save current ES content to bucket before switching
      setTitleEs(title);
      setDescriptionEs(description);
      setContentEs(content);

      // Check if English content exists
      const enContent = contentEn;
      if (!enContent || !enContent.trim()) {
        console.warn("[Analyze] No English content available");
        return;
      }

      // Switch UI to English
      setTitle(titleEn || "");
      setDescription(descriptionEn || "");
      setContent(enContent);
      setViewLanguage("en");
      contentToAnalyze = enContent;

      console.log("[Analyze] Auto-switched to EN for analysis");
    }

    const analyzeMessages = [
      // Show switching message first if we auto-switched
      ...(viewLanguage === "es" ? [t("switchingToEnglish")] : []),
      t("status.analyze.tokenizing"),
      t("status.analyze.checking"),
      t("status.analyze.evaluating"),
      t("status.analyze.scoring"),
    ];

    try {
      await analyzeProcess.startProcess(
        analyzeMessages,
        async () => {
          const timeoutPromise = new Promise<{
            success: boolean;
            data?: any;
            error?: string;
          }>((_, reject) => {
            setTimeout(
              () => reject(new Error("Analysis timed out after 120s")),
              120000,
            );
          });

          // Always analyze with the resolved English content
          const result = await Promise.race([
            analyzePromptEnhanced(contentToAnalyze, "en"),
            timeoutPromise,
          ]);

          if (result.success && result.data) {
            setAnalysisResult(result.data as AnalysisResult);
          }
          return result;
        },
        { minDuration: 2000 },
      );
    } catch (error) {
      console.error("Analysis Failed", error);
    }
  };

  const handleOptimize = async () => {
    if (!analysisResult || !analysisResult.prioritySuggestions.length) {
      console.warn("[Optimize] Skipped — no analysisResult or suggestions");
      return;
    }

    const previousScore = analysisResult.totalScore;
    console.log(`[Optimize] Starting — current score: ${previousScore}/75`);

    setIsOptimizing(true);
    try {
      const result = await optimizePromptEnhanced(
        content,
        analysisResult,
        previousScore,
        viewLanguage,
      );

      console.log("[Optimize] Result:", result);

      if (result.success && result.data?.optimizedContent) {
        const optimizedContent = result.data.optimizedContent;
        console.log(
          `[Optimize] Got optimized content (${optimizedContent.length} chars)`,
        );
        setContent(optimizedContent);
        setAnalysisResult(null);

        // Re-analyze using the process wrapper for proper UI + monitor activation
        const analyzeMessages = [
          t("status.analyze.tokenizing"),
          t("status.analyze.checking"),
          t("status.analyze.evaluating"),
          t("status.analyze.scoring"),
        ];

        await analyzeProcess.startProcess(
          analyzeMessages,
          async () => {
            const timeoutPromise = new Promise<{
              success: boolean;
              data?: any;
              error?: string;
            }>((_, reject) => {
              setTimeout(
                () => reject(new Error("Analysis timed out after 120s")),
                120000,
              );
            });

            // Use optimizedContent directly — not the stale closure `content`
            const reAnalysis = await Promise.race([
              analyzePromptEnhanced(optimizedContent, viewLanguage),
              timeoutPromise,
            ]);

            console.log("[Optimize] Re-analysis result:", reAnalysis);

            if (reAnalysis.success && reAnalysis.data) {
              setAnalysisResult(reAnalysis.data as AnalysisResult);
            }
            return reAnalysis;
          },
          { minDuration: 2000 },
        );
      } else {
        console.warn(
          "[Optimize] Optimization returned no content or failed:",
          result,
        );
      }
    } catch (error) {
      console.error("[Optimize] Error:", error);
    } finally {
      setIsOptimizing(false);
      console.log("[Optimize] Done");
    }
  };

  const isNewPrompt = !prompt;
  const hasChanges = prompt
    ? content !==
        prompt.versions.find((v) => v.id === prompt.currentVersionId)
          ?.content ||
      title !== prompt.title ||
      description !== prompt.description
    : title.trim() !== "" || content.trim() !== "";

  // Compact Language Switcher
  const LanguageSwitcher = () => (
    <div className="flex items-center bg-black/5 dark:bg-black/40 border border-black/5 dark:border-white/10 rounded-lg p-1 ml-2 sm:ml-4 gap-1">
      <button
        onClick={() => handleLanguageSwitch("en")}
        className={cn(
          "relative px-3 py-1 text-xs font-mono rounded transition-all flex items-center gap-2",
          viewLanguage === "en"
            ? "bg-(--bg-surface-active) text-(--acc-primary) shadow-sm font-bold"
            : "text-(--text-muted) hover:text-(--text-primary) hover:bg-black/5 dark:hover:bg-white/5",
        )}
        title={contentEn ? t("englishAvailable") : t("switchToEnglishMissing")}
      >
        <span>EN</span>
        <div
          className={cn(
            "w-1.5 h-1.5 rounded-full transition-colors",
            contentEn
              ? viewLanguage === "en"
                ? "bg-green-500"
                : "bg-green-500/50"
              : "bg-transparent border border-(--text-muted)",
          )}
        />
      </button>
      <div className="w-px h-4 bg-black/5 dark:bg-white/10 mx-0.5"></div>
      <button
        onClick={() => handleLanguageSwitch("es")}
        className={cn(
          "relative px-3 py-1 text-xs font-mono rounded transition-all flex items-center gap-2",
          viewLanguage === "es"
            ? "bg-(--bg-surface-active) text-(--acc-primary) shadow-sm font-bold"
            : "text-(--text-muted) hover:text-(--text-primary) hover:bg-black/5 dark:hover:bg-white/5",
        )}
        title={contentEs ? t("spanishAvailable") : t("switchToSpanishMissing")}
      >
        <span>ES</span>
        <div
          className={cn(
            "w-1.5 h-1.5 rounded-full transition-colors",
            contentEs
              ? viewLanguage === "es"
                ? "bg-green-500"
                : "bg-green-500/50"
              : "bg-transparent border border-(--text-muted)",
          )}
        />
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/60 dark:bg-black/80 flex items-center justify-center z-50 p-2 sm:p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-(--bg-surface) border border-(--border-primary) rounded-xl w-full max-w-7xl h-[90vh] flex flex-col shadow-2xl relative overflow-hidden ring-1 ring-white/10">
        {/* Header - Compact & refined */}
        <div className="shrink-0 flex items-center justify-between p-3 border-b border-(--border-primary) bg-(--bg-surface)">
          <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto no-scrollbar">
            <span className="text-green-400 font-mono text-xs sm:text-sm px-2 py-0.5 rounded bg-green-500/10 border border-green-500/20 whitespace-nowrap">
              {isNewPrompt ? "$ new_prompt" : "$ edit_prompt"}
            </span>

            <LanguageSwitcher />

            {/* Unsynced Warning */}
            {isUnsynced && contentEs && contentEn && (
              <span className="hidden sm:flex text-[10px] text-yellow-400 font-mono items-center gap-1 ml-2 animate-pulse whitespace-nowrap">
                <span>●</span> {t("unsyncedChanges")}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 pl-2">
            {prompt && showVersions && (
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowVersions(false)}
              />
            )}

            {prompt && (
              <div className="relative">
                <button
                  onClick={() => setShowVersions(!showVersions)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-(--bg-surface-hover) rounded text-xs font-mono text-(--text-primary) hover:bg-(--bg-surface-active) transition-colors border border-transparent hover:border-(--border-primary)"
                >
                  <GitBranch size={14} className="text-purple-400" />
                  <span className="hidden sm:inline">
                    v{selectedVersion?.versionNumber || prompt.versions.length}
                  </span>
                  <ChevronDown size={14} />
                </button>

                {showVersions && (
                  <div className="absolute top-full right-0 mt-2 bg-(--bg-surface) border border-(--border-primary) rounded-lg shadow-xl z-20 min-w-[260px] overflow-hidden animate-in slide-in-from-top-2">
                    <div className="p-2 border-b border-(--border-primary) text-[10px] text-(--text-muted) font-mono uppercase tracking-wider bg-(--bg-surface-muted)">
                      {t("versionHistory")}
                    </div>
                    <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                      {prompt.versions
                        .slice()
                        .reverse()
                        .map((version) => (
                          <button
                            key={version.id}
                            onClick={() => handleVersionSelect(version)}
                            className={cn(
                              "w-full px-4 py-3 text-left text-xs font-mono flex items-center justify-between hover:bg-(--bg-surface-hover) transition-colors border-l-2",
                              version.id === selectedVersion?.id
                                ? "bg-(--bg-surface-active) text-(--acc-primary) border-purple-400"
                                : "text-(--text-primary) border-transparent",
                            )}
                          >
                            <div className="flex flex-col gap-0.5">
                              <span className="flex items-center gap-2 font-bold">
                                v{version.versionNumber}
                                {version.id === prompt.currentVersionId && (
                                  <span className="text-[9px] px-1 rounded bg-green-500/20 text-green-400 border border-green-500/30">
                                    CURRENT
                                  </span>
                                )}
                              </span>
                              <span className="text-[10px] text-(--text-muted) opacity-70">
                                {/* Could add commit message style summary here if available */}
                                Changes saved
                              </span>
                            </div>
                            <span className="text-[10px] text-(--text-muted) flex items-center gap-1">
                              {format(version.createdAt, "MMM d, HH:mm", {
                                locale: dateLocale,
                              })}
                            </span>
                          </button>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="w-px h-6 bg-(--border-primary) mx-1 hidden sm:block" />

            <button
              onClick={onClose}
              className="p-2 text-(--text-muted) hover:text-(--text-primary) hover:bg-(--bg-surface-hover) rounded-md transition-colors"
              title={t("close")}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Main Workspace - Flexible Grid Logic */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
          {/* AREA 1: Editor Pane (Left/Top) */}
          <div className="flex-1 flex flex-col relative bg-black/5 dark:bg-black/20 overflow-hidden">
            {/* Editor Container */}
            <div className="flex-1 flex flex-col p-4 sm:p-6 overflow-hidden relative z-0">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs text-(--text-muted) font-mono uppercase tracking-wider flex items-center gap-2 select-none">
                  <span
                    className={cn(
                      "w-2 h-2 rounded-full",
                      content.trim()
                        ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]"
                        : "bg-gray-600",
                    )}
                  ></span>
                  {t("content")}
                </label>
                <div className="text-[10px] text-(--text-muted) font-mono opacity-50 select-none">
                  {content.length} chars
                </div>
              </div>

              {/* Textarea Wrapper with Glass Effect */}
              <div className="flex-1 relative rounded-xl border border-(--border-primary) bg-(--bg-surface)/50 backdrop-blur-sm overflow-hidden focus-within:ring-1 focus-within:ring-green-500/30 transition-all shadow-inner">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="// Type your prompt content here..."
                  className="w-full h-full p-4 sm:p-6 bg-transparent border-none focus:ring-0 resize-none font-mono text-sm leading-relaxed text-(--text-primary) outline-none custom-scrollbar"
                  style={{ paddingBottom: "100px" }} // Space for toolbar
                  spellCheck={false}
                />

                {/* Floating Toolbar within Editor */}
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 w-auto animate-in slide-in-from-bottom-4 duration-500">
                  <PromptToolbar
                    onTranslate={handleTranslate}
                    onAnalyze={handleAnalyze}
                    onAutoSuggest={handleAutoSuggest}
                    translateProcess={translateProcess}
                    analyzeProcess={analyzeProcess}
                    suggestProcess={suggestProcess}
                    isOptimizing={isOptimizing}
                    hasContent={!!content.trim()}
                    isTranslated={!!contentEs && !!contentEn && !isUnsynced}
                    hasMetadata={!!title.trim() && !!description.trim()}
                    analyzeDisabledReason={
                      viewLanguage === "es" && !contentEn?.trim()
                        ? t("translateBeforeAnalyze")
                        : undefined
                    }
                    className="static transform-none shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* AREA 2: Sidebar Pane (Right/Bottom) */}
          <div className="w-full lg:w-[340px] xl:w-[380px] shrink-0 bg-(--bg-surface) border-t lg:border-t-0 lg:border-l border-(--border-primary) flex flex-col h-[35vh] lg:h-auto overflow-hidden shadow-[-10px_0_30px_-5px_rgba(0,0,0,0.1)] z-10">
            {/* Scrollable Sidebar Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6 custom-scrollbar">
              {/* 1. Metadata Group */}
              <div className="space-y-4 animate-in slide-in-from-right-2 duration-300 delay-100">
                <div className="flex items-center gap-2 pb-2 border-b border-(--border-primary)">
                  <Info size={14} className="text-(--text-muted)" />
                  <span className="text-xs font-bold text-(--text-muted) uppercase tracking-wider">
                    Metadata ({viewLanguage.toUpperCase()})
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="group">
                    <div className="flex justify-between mb-1.5">
                      <label className="text-[10px] text-(--text-muted) font-mono uppercase group-focus-within:text-green-400 transition-colors">
                        {t("promptTitle")}
                      </label>
                      {suggestProcess.isProcessing && !title.trim() && (
                        <Sparkles
                          size={12}
                          className="text-yellow-400 animate-pulse"
                        />
                      )}
                    </div>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Ex: Customer Support Bot..."
                      className="w-full bg-black/5 dark:bg-black/20 border border-(--border-primary) rounded-md px-3 py-2 text-sm text-(--text-primary) font-medium focus:border-green-500/50 focus:bg-black/10 focus:outline-none transition-all placeholder:text-gray-600"
                    />
                  </div>

                  <div className="group">
                    <div className="flex justify-between mb-1.5">
                      <label className="text-[10px] text-(--text-muted) font-mono uppercase group-focus-within:text-green-400 transition-colors">
                        {t("description")}
                      </label>
                      {suggestProcess.isProcessing && !description.trim() && (
                        <Sparkles
                          size={12}
                          className="text-yellow-400 animate-pulse"
                        />
                      )}
                    </div>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Briefly describe what this prompt does..."
                      rows={3}
                      className="w-full bg-black/5 dark:bg-black/20 border border-(--border-primary) rounded-md px-3 py-2 text-xs text-(--text-primary) focus:border-green-500/50 focus:bg-black/10 focus:outline-none transition-all resize-none placeholder:text-gray-600"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Tags Group */}
              <div className="space-y-3 animate-in slide-in-from-right-2 duration-300 delay-200">
                <div className="flex items-center justify-between pb-2 border-b border-(--border-primary)">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-(--text-muted) uppercase tracking-wider">
                      {t("tags")}
                    </span>
                    <span className="px-1.5 py-0.5 rounded-full bg-black/10 dark:bg-white/10 text-[10px] font-mono font-bold">
                      {selectedTags.length}
                    </span>
                  </div>
                  <button
                    onClick={() => setShowTaxonomyPicker(!showTaxonomyPicker)}
                    className="p-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded text-(--text-primary) transition-colors flex items-center gap-1 text-[10px] font-mono border border-transparent hover:border-(--border-primary)"
                  >
                    <Plus size={12} />
                    {t("addTag")}
                  </button>
                </div>

                <div className="min-h-[80px] p-3 rounded-lg border border-(--border-primary) bg-black/5 dark:bg-black/20 flex flex-wrap gap-2 content-start transition-all hover:border-(--border-primary)/80">
                  {selectedTags.length > 0 ? (
                    selectedTags.map((tag) => (
                      <button
                        key={tag.id}
                        onClick={() => toggleTag(tag)}
                        className="group"
                      >
                        <TagBadge
                          name={locale === "es" ? tag.nameEs : tag.nameEn}
                          className="text-[10px] px-2.5 py-1 cursor-pointer hover:bg-red-500/10 hover:border-red-500/30 transition-all shadow-sm"
                        />
                      </button>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center w-full h-full text-(--text-muted) opacity-60">
                      <span className="text-[10px] italic">
                        {t("noTagsAssigned")}
                      </span>
                    </div>
                  )}
                </div>

                {/* AI Suggested Tags */}
                {suggestedTags.length > 0 && !tagProcess.isProcessing && (
                  <div className="animate-in slide-in-from-top-2 fade-in duration-500 mt-2">
                    <div className="flex items-center justify-between mb-2 px-1">
                      <div className="flex items-center gap-1.5">
                        <Sparkles
                          size={12}
                          className="text-blue-400 animate-pulse"
                        />
                        <span className="text-[10px] text-blue-400 font-mono uppercase tracking-wider font-bold">
                          {t("aiSuggestions")}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          suggestedTags.forEach((t) => toggleTag(t));
                          setSuggestedTags([]);
                        }}
                        className="text-[10px] text-blue-400 hover:text-blue-300 hover:underline cursor-pointer font-mono"
                      >
                        + {t("applyAll")}
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {suggestedTags.map((tag) => (
                        <button
                          key={tag.id}
                          onClick={() => toggleTag(tag)}
                          className="animate-in zoom-in duration-300"
                        >
                          <TagBadge
                            name={locale === "es" ? tag.nameEs : tag.nameEn}
                            className="text-[10px] px-2.5 py-1 bg-blue-500/5 border-blue-500/30 text-blue-300 hover:bg-blue-500/20 cursor-pointer transition-all shadow-[0_0_10px_rgba(59,130,246,0.1)]"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Auto-tagging process indicator */}
                {tagProcess.isProcessing && (
                  <div className="flex items-center gap-2 px-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                    <span className="text-[10px] font-mono text-blue-400">
                      {tagProcess.currentMessage}
                    </span>
                  </div>
                )}
              </div>

              {/* 3. Analysis Card */}
              {analysisResult && !analyzeProcess.isProcessing && (
                <div className="space-y-4 animate-in slide-in-from-right-4 duration-500 delay-300">
                  <div className="flex items-center gap-2 pb-2 mb-2 border-b border-(--border-primary)">
                    <BarChart2 size={14} className="text-purple-400" />
                    <span className="text-xs font-bold text-(--text-muted) uppercase tracking-wider">
                      Analysis Report
                    </span>
                  </div>

                  <PromptEvaluationResults
                    data={analysisResult}
                    onOptimize={handleOptimize}
                    isOptimizing={isOptimizing}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer - Floating Clean Actions */}
        <div className="shrink-0 p-4 border-t border-(--border-primary) bg-(--bg-surface) flex items-center justify-between z-20 relative">
          <div className="flex items-center gap-3 text-xs text-(--text-muted)">
            {hasChanges && (
              <span className="text-yellow-500 flex items-center gap-1.5 px-2 py-1 rounded-md bg-yellow-500/5 border border-yellow-500/10 animate-pulse">
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
                Unsaved Changes
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-mono text-(--text-muted) hover:text-(--text-primary) hover:bg-(--bg-surface-hover) rounded-lg transition-colors"
            >
              {t("cancel")}
            </button>
            <button
              onClick={handleSave}
              disabled={!title.trim() || !content.trim()}
              className={cn(
                "px-6 py-2 text-xs font-bold font-mono rounded-lg flex items-center gap-2 transition-all shadow-lg",
                title.trim() && content.trim()
                  ? "bg-green-600 text-white hover:bg-green-500 hover:shadow-green-500/20 hover:-translate-y-0.5 active:translate-y-0"
                  : "bg-gray-700 text-gray-500 cursor-not-allowed opacity-50",
              )}
            >
              {isNewPrompt ? <Plus size={16} /> : <Save size={16} />}
              {isNewPrompt ? t("newTitle") : t("save")}
            </button>
          </div>
        </div>

        {/* Floating Taxonomy Picker Overlay */}
        {showTaxonomyPicker && taxonomy && (
          <div className="absolute inset-0 z-50 bg-black/40 backdrop-blur-[2px] flex justify-end">
            <div className="w-full sm:w-[380px] lg:w-[420px] h-full bg-(--bg-surface) border-l border-(--border-primary) shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
              <div className="p-4 border-b border-(--border-primary) flex justify-between items-center bg-(--bg-surface)">
                <span className="font-mono text-sm font-bold flex items-center gap-2">
                  <Plus size={16} className="text-green-400" />
                  Add Tags
                </span>
                <button
                  onClick={() => setShowTaxonomyPicker(false)}
                  className="p-1 hover:bg-white/10 rounded transition-colors text-(--text-muted) hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="flex-1 overflow-hidden relative">
                <TaxonomyPicker
                  taxonomy={taxonomy}
                  selectedTags={selectedTags}
                  onToggleTag={toggleTag}
                  onClose={() => setShowTaxonomyPicker(false)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
