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
  analyzePrompt,
  optimizePrompt,
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

    const analyzeMessages = [
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

          const result = await Promise.race([
            analyzePrompt(content, viewLanguage),
            timeoutPromise,
          ]);

          if (result.success && result.data) {
            setAnalysisResult(result.data);
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
    if (
      !analysisResult ||
      typeof analysisResult === "number" ||
      !analysisResult?.suggestions.length
    )
      return;

    setIsOptimizing(true);
    try {
      const result = await optimizePrompt(
        content,
        analysisResult.suggestions,
        viewLanguage,
      );

      if (result.success && result.data?.optimizedContent) {
        setContent(result.data.optimizedContent);
        await handleAnalyze();
      }
    } catch (error) {
      console.error("Optimization failed", error);
    } finally {
      setIsOptimizing(false);
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

  return (
    <div className="fixed inset-0 bg-black/60 dark:bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-(--bg-surface) border border-(--border-primary) rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-(--border-primary)">
          <div className="flex items-center gap-3">
            <span className="text-green-400 font-mono">
              {isNewPrompt ? "$ new_prompt" : "$ edit_prompt"}
            </span>

            {/* Language Toggle */}
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-black/20 border border-white/10 rounded overflow-hidden ml-2">
                <button
                  onClick={() => handleLanguageSwitch("en")}
                  className={cn(
                    "px-3 py-1 text-xs font-mono transition-all",
                    viewLanguage === "en"
                      ? "bg-green-500/20 text-green-400 font-bold"
                      : "text-(--text-muted) hover:text-(--text-primary) hover:bg-white/5",
                  )}
                  title={
                    contentEn
                      ? t("englishAvailable")
                      : t("switchToEnglishMissing")
                  }
                >
                  EN
                  {contentEn && (
                    <span className="inline-block w-1 h-1 rounded-full bg-green-500 ml-1 mb-0.5"></span>
                  )}
                </button>
                <div className="w-px h-full bg-white/10"></div>
                <button
                  onClick={() => handleLanguageSwitch("es")}
                  className={cn(
                    "px-3 py-1 text-xs font-mono transition-all",
                    viewLanguage === "es"
                      ? "bg-green-500/20 text-green-400 font-bold"
                      : "text-(--text-muted) hover:text-(--text-primary) hover:bg-white/5",
                  )}
                  title={
                    contentEs
                      ? t("spanishAvailable")
                      : t("switchToSpanishMissing")
                  }
                >
                  ES
                  {contentEs && (
                    <span className="inline-block w-1 h-1 rounded-full bg-green-500 ml-1 mb-0.5"></span>
                  )}
                </button>
              </div>

              {isUnsynced && contentEs && contentEn && (
                <span className="text-[10px] text-yellow-400 font-mono flex items-center gap-1 ml-2">
                  <span className="animate-pulse">●</span>{" "}
                  {t("unsyncedChanges")}
                </span>
              )}

              {((!contentEn && viewLanguage === "es") ||
                (!contentEs && viewLanguage === "en")) && (
                <span className="text-[10px] text-orange-400/80 font-mono animate-pulse flex items-center gap-1">
                  <span className="text-orange-500">⚠</span>{" "}
                  {t("missingTranslation")}
                </span>
              )}
            </div>

            {prompt && (
              <div className="relative ml-2">
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
              {t("promptTitle")} ({viewLanguage.toUpperCase()})
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

          {/* Tagging UI */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs text-(--text-muted) font-mono uppercase tracking-tighter">
                {t("tags")}
              </label>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-gray-500">
                  {selectedTags.length} {t("tagsActive")}
                </span>
                <button
                  onClick={() => setShowTaxonomyPicker(!showTaxonomyPicker)}
                  className="p-1 px-2 text-[10px] bg-(--bg-surface-active) hover:bg-(--bg-surface-hover) border border-(--border-primary) rounded flex items-center gap-1 transition-colors text-(--text-primary)"
                  title="Browse Taxonomy"
                >
                  <Plus size={10} />
                  {t("addTag")}
                </button>
              </div>
            </div>
            {showTaxonomyPicker && taxonomy && (
              <TaxonomyPicker
                taxonomy={taxonomy}
                selectedTags={selectedTags}
                onToggleTag={toggleTag}
                onClose={() => setShowTaxonomyPicker(false)}
              />
            )}
            <div className="flex flex-wrap gap-2 p-3 bg-black/10 dark:bg-black/30 border border-(--border-primary) rounded min-h-[50px] transition-all duration-300">
              {selectedTags.length > 0 ? (
                selectedTags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => toggleTag(tag)}
                    className="group"
                  >
                    <TagBadge
                      name={locale === "es" ? tag.nameEs : tag.nameEn}
                      className="cursor-pointer hover:bg-red-500/20 border-green-500/30 transition-colors"
                    />
                  </button>
                ))
              ) : (
                <div className="text-xs text-gray-600 font-mono italic">
                  {t("noTagsAssigned")}
                </div>
              )}
            </div>

            {/* Taxonomy Picker Side Panel */}

            {/* Suggested Tags Area */}
            {suggestedTags.length > 0 && !tagProcess.isProcessing && (
              <div className="animate-in slide-in-from-top-2 fade-in duration-500">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={12} className="text-blue-400 animate-pulse" />
                  <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest">
                    {t("aiSuggestions")}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 p-2 bg-blue-500/5 border border-blue-500/20 rounded-lg">
                  {suggestedTags.map((tag) => (
                    <button
                      key={tag.id}
                      onClick={() => toggleTag(tag)}
                      className="animate-glow-blue"
                    >
                      <TagBadge
                        name={locale === "es" ? tag.nameEs : tag.nameEn}
                        className="cursor-pointer border-blue-500/30 bg-blue-500/10 shadow-[0_0_10px_rgba(59,130,246,0.2)]"
                      />
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      suggestedTags.forEach((t) => toggleTag(t));
                      setSuggestedTags([]);
                    }}
                    className="text-[10px] font-mono text-blue-300 hover:text-blue-200 px-2 py-1 rounded hover:bg-blue-500/10 transition-colors"
                  >
                    + {t("applyAll")}
                  </button>
                </div>
              </div>
            )}
            {/* Tag Process Loader */}
            {tagProcess.isProcessing && (
              <div className="flex items-center gap-2 text-[10px] font-mono text-blue-400 animate-pulse">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                {tagProcess.currentMessage}
              </div>
            )}
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

          {/* Analysis Result Display */}
          {analysisResult && !analyzeProcess.isProcessing && (
            <div className="bg-black/20 border border-white/10 rounded-lg p-4 animate-in fade-in duration-300 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart2 size={16} className="text-purple-400" />
                  <span className="text-sm font-mono text-(--text-primary)">
                    {t("aiAnalysis")} ({viewLanguage.toUpperCase()})
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-(--text-muted) font-mono">
                      {t("score")}:
                    </span>
                    <span
                      className={cn(
                        "text-lg font-bold font-mono",
                        analysisResult.score >= 90
                          ? "text-green-400"
                          : analysisResult.score >= 70
                            ? "text-yellow-400"
                            : "text-red-400",
                      )}
                    >
                      {analysisResult.score}/100
                    </span>
                  </div>

                  {analysisResult.score < 100 && (
                    <button
                      onClick={handleOptimize}
                      disabled={isOptimizing}
                      className="flex items-center gap-1.5 px-3 py-1 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 hover:border-purple-500/50 rounded text-xs text-purple-300 font-mono transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isOptimizing ? (
                        <RefreshCw size={12} className="animate-spin" />
                      ) : (
                        <Zap size={12} />
                      )}
                      {isOptimizing ? t("fixing") : t("autoFix")}
                    </button>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-gray-700/50 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full transition-all duration-500",
                    analysisResult.score >= 90
                      ? "bg-green-500"
                      : analysisResult.score >= 70
                        ? "bg-yellow-500"
                        : "bg-red-500",
                  )}
                  style={{ width: `${analysisResult.score}%` }}
                />
              </div>

              {/* Clarity & Suggestions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="bg-black/20 p-3 rounded border border-white/5">
                  <div className="flex items-center gap-2 mb-2">
                    <Info size={14} className="text-blue-400" />
                    <span className="text-xs font-mono text-blue-400 uppercase">
                      {t("clarity")}
                    </span>
                  </div>
                  <p className="text-sm text-(--text-muted)">
                    {analysisResult.clarity}
                  </p>
                </div>

                <div className="bg-black/20 p-3 rounded border border-white/5">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={14} className="text-yellow-400" />
                    <span className="text-xs font-mono text-yellow-400 uppercase">
                      {t("suggestions")}
                    </span>
                  </div>
                  <ul className="text-sm text-(--text-muted) space-y-1 list-disc list-inside">
                    {analysisResult.suggestions.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Info about auto-tagging */}
          <div className="bg-(--bg-surface-hover) rounded p-3 text-xs text-(--text-muted) font-mono">
            <span className="text-purple-400">ℹ</span>{" "}
            {t("autoTagInfo") || "Tags are auto-suggested as you type."}
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
          isTranslated={!!contentEs && !!contentEn && !isUnsynced}
          hasMetadata={!!title.trim() && !!description.trim()}
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
