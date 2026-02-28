"use client";

import React, { useState, useEffect, useTransition } from "react";
import {
  X,
  Plus,
  Trash2,
  Edit2,
  Save,
  Sparkles,
  Loader2,
  Tag as TagIcon,
  Hash,
  ChevronRight,
  ChevronDown,
  Check,
  AlertCircle,
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { Taxonomy, TagDimension, SmartTag } from "@/types";
import { TagBadge } from "./TagBadge";
import { cn } from "@/utils/cn";
import {
  createTag,
  updateTag,
  deleteTag,
  createDimension,
  updateDimension,
  deleteDimension,
} from "@/app/actions/taxonomy";
import { predictDimension } from "@/app/actions/ai";
import { useRouter } from "next/navigation";

interface TaxonomyManagerProps {
  taxonomy: Taxonomy;
  onClose: () => void;
}

export function TaxonomyManager({ taxonomy, onClose }: TaxonomyManagerProps) {
  const t = useTranslations("Common"); // Ideally specialized translations
  const locale = useLocale();
  const isEs = locale === "es";
  const router = useRouter();

  const [activeDimensionId, setActiveDimensionId] = useState<string | null>(
    taxonomy.dimensions[0]?.id || null,
  );
  const [tags, setTags] = useState<SmartTag[]>(taxonomy.tags);
  const [dimensions, setDimensions] = useState<TagDimension[]>(
    taxonomy.dimensions,
  );

  const [isPending, startTransition] = useTransition();
  const [aiLoading, setAiLoading] = useState(false);

  // New Tag Form State
  const [newTagName, setNewTagName] = useState("");
  const [targetDimensionId, setTargetDimensionId] = useState<string>("");
  const [isAiSuggested, setIsAiSuggested] = useState(false);

  // Filter tags by active dimension
  const activeTags = tags.filter((t) => t.dimensionId === activeDimensionId);
  const activeDimension = dimensions.find((d) => d.id === activeDimensionId);

  // AI Prediction Effect
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (newTagName.trim().length > 2 && !targetDimensionId) {
        setAiLoading(true);
        const result = await predictDimension(
          newTagName,
          dimensions.map((d) => ({
            id: d.id,
            nameEn: d.nameEn,
            nameEs: d.nameEs,
          })),
        );

        if (result.success && result.dimensionId) {
          setTargetDimensionId(result.dimensionId);
          setIsAiSuggested(true);
          // Auto-switch view to suggested dimension if reasonable
          // setActiveDimensionId(result.dimensionId);
        }
        setAiLoading(false);
      }
    }, 800); // Debounce

    return () => clearTimeout(timer);
  }, [newTagName, targetDimensionId, dimensions]);

  // Handlers
  const handleAddTag = () => {
    if (!newTagName.trim() || !targetDimensionId) return;

    const slug = newTagName.toLowerCase().replace(/\s+/g, "-");
    const dimId = targetDimensionId;

    startTransition(async () => {
      const result = await createTag({
        slug,
        dimensionId: dimId,
        nameEn: newTagName,
        nameEs: newTagName,
        descriptionEn: "Created via Manager",
        descriptionEs: "Creado vía Gestor",
      });

      if (result.success) {
        setNewTagName("");
        setTargetDimensionId("");
        setIsAiSuggested(false);
        router.refresh();
      }
    });
  };

  const handleDeleteTag = (tagId: string) => {
    if (!confirm("Delete this tag?")) return;
    startTransition(async () => {
      await deleteTag(tagId);
      router.refresh();
    });
  };

  // Dimension Handlers
  const [isAddingDimension, setIsAddingDimension] = useState(false);
  const [newDimensionName, setNewDimensionName] = useState("");

  const handleCreateDimension = () => {
    if (!newDimensionName.trim()) return;
    const id = newDimensionName.toLowerCase().replace(/\s+/g, "_");
    startTransition(async () => {
      await createDimension({
        id,
        nameEn: newDimensionName,
        nameEs: newDimensionName,
        color: "blue", // Default
      });
      setIsAddingDimension(false);
      setNewDimensionName("");
      router.refresh();
    });
  };

  const handleDeleteDimension = (id: string) => {
    if (!confirm("Delete dimension and ALL its tags?")) return;
    startTransition(async () => {
      await deleteDimension(id);
      if (activeDimensionId === id) setActiveDimensionId(null);
      router.refresh();
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-5xl h-[80vh] bg-(--bg-surface) border border-(--border-primary) rounded-xl shadow-2xl flex flex-col overflow-hidden relative ring-1 ring-white/10">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-(--border-primary) bg-black/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20 text-indigo-400">
              <Hash size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold font-mono tracking-tight text-(--text-primary)">
                {isEs ? "Gestor de Taxonomía" : "Taxonomy Manager"}
              </h2>
              <p className="text-xs text-(--text-muted)">
                {isEs
                  ? "Organiza tus dimensiones y etiquetas"
                  : "Organize your dimensions and tags"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-(--text-muted) hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content: Master-Detail */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar (Dimensions) */}
          <div className="w-64 bg-black/10 border-r border-(--border-primary) flex flex-col">
            <div className="p-3 border-b border-(--border-primary) flex justify-between items-center">
              <span className="text-xs font-mono font-bold uppercase text-(--text-muted) tracking-wider">
                Dimensions
              </span>
              <button
                onClick={() => setIsAddingDimension(true)}
                className="p-1 hover:bg-white/10 rounded text-(--text-muted) hover:text-green-400 transition-colors"
                title="Add Dimension"
              >
                <Plus size={14} />
              </button>
            </div>

            {/* Add Dimension Form */}
            {isAddingDimension && (
              <div className="p-2 border-b border-(--border-primary) bg-black/20 animate-in slide-in-from-top-2">
                <input
                  autoFocus
                  type="text"
                  value={newDimensionName}
                  onChange={(e) => setNewDimensionName(e.target.value)}
                  placeholder="Dimension name..."
                  className="w-full bg-black/20 border border-(--border-primary) rounded px-2 py-1 text-xs mb-2 focus:outline-none focus:border-indigo-500"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleCreateDimension();
                    if (e.key === "Escape") setIsAddingDimension(false);
                  }}
                />
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setIsAddingDimension(false)}
                    className="text-[10px] text-(--text-muted) hover:text-(--text-primary)"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateDimension}
                    className="text-[10px] bg-green-500/10 text-green-400 px-2 py-0.5 rounded border border-green-500/20 hover:bg-green-500/20"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {dimensions.map((dim) => (
                <div key={dim.id} className="group relative">
                  <button
                    onClick={() => setActiveDimensionId(dim.id)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-left transition-all",
                      activeDimensionId === dim.id
                        ? "bg-(--bg-surface-active) text-(--acc-primary) font-medium shadow-sm ring-1 ring-(--border-primary)"
                        : "text-(--text-muted) hover:text-(--text-primary) hover:bg-white/5",
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: dim.color || "gray" }}
                      ></span>
                      <span>{isEs ? dim.nameEs : dim.nameEn}</span>
                    </div>
                    {activeDimensionId === dim.id && (
                      <ChevronRight size={14} className="opacity-50" />
                    )}
                  </button>
                  {/* Delete Dimension Button (Only on hover and if not active or active) - actually context menu best but simple hover button works */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteDimension(dim.id);
                    }}
                    className={cn(
                      "absolute right-2 top-1/2 -translate-y-1/2 p-1 text-red-400 hover:bg-red-500/20 rounded opacity-0 group-hover:opacity-100 transition-opacity",
                      activeDimensionId === dim.id ? "right-8" : "right-2",
                    )}
                    title="Delete Dimension"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Main (Tags) */}
          <div className="flex-1 flex flex-col bg-(--bg-surface)">
            {/* Toolbar / Creation Form */}
            <div className="p-4 border-b border-(--border-primary) bg-(--bg-surface-muted)/50 space-y-3">
              <label className="text-xs font-mono font-bold uppercase text-(--text-muted) flex items-center gap-2">
                <Plus size={12} className="text-green-400" />
                {isEs ? "Nueva Etiqueta" : "New Tag"}
              </label>

              <div className="flex gap-3 items-end">
                <div className="flex-1 space-y-1.5 relative">
                  <input
                    type="text"
                    value={newTagName}
                    onChange={(e) => {
                      setNewTagName(e.target.value);
                      setIsAiSuggested(false);
                      if (!targetDimensionId)
                        setTargetDimensionId(activeDimensionId || "");
                    }}
                    placeholder={
                      isEs ? "Nombre de la etiqueta..." : "Tag name..."
                    }
                    className="w-full bg-black/20 border border-(--border-primary) rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                  />
                  {/* AI Thinking Indicator */}
                  {aiLoading && (
                    <div className="absolute right-3 top-2.5 flex items-center gap-1.5 animate-pulse pointer-events-none">
                      <Sparkles size={12} className="text-purple-400" />
                      <span className="text-[10px] text-purple-400 font-mono">
                        Thinking...
                      </span>
                    </div>
                  )}
                </div>

                <div className="w-[200px] space-y-1.5">
                  <div className="relative">
                    <select
                      value={targetDimensionId}
                      onChange={(e) => {
                        setTargetDimensionId(e.target.value);
                        setIsAiSuggested(false);
                      }}
                      className={cn(
                        "w-full appearance-none bg-black/20 border rounded-lg px-3 py-2 text-sm focus:outline-none transition-all pr-8",
                        isAiSuggested
                          ? "border-purple-500/50 shadow-[0_0_10px_rgba(168,85,247,0.15)] text-purple-200"
                          : "border-(--border-primary)",
                      )}
                    >
                      <option value="" disabled>
                        Select Dimension
                      </option>
                      {dimensions.map((d) => (
                        <option key={d.id} value={d.id}>
                          {isEs ? d.nameEs : d.nameEn}
                        </option>
                      ))}
                    </select>
                    {/* Default arrow fallback if needed, or custom icon */}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-(--text-muted)">
                      {isAiSuggested ? (
                        <Sparkles
                          size={14}
                          className="text-purple-400 animate-pulse"
                        />
                      ) : (
                        <ChevronDown size={14} />
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleAddTag}
                  disabled={
                    !newTagName.trim() || !targetDimensionId || isPending
                  }
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-indigo-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isPending ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Plus size={16} />
                  )}
                  {isEs ? "Crear" : "Create"}
                </button>
              </div>
              {isAiSuggested && (
                <div className="text-[10px] text-purple-400 font-mono flex items-center gap-1.5 animate-in slide-in-from-top-1">
                  <Sparkles size={10} />
                  {isEs
                    ? "Dimensión sugerida por IA"
                    : "Dimension suggested by AI"}
                </div>
              )}
            </div>

            {/* Tags List */}
            <div className="flex-1 overflow-y-auto p-4">
              {activeTags.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-(--text-muted) opacity-50 space-y-2">
                  <TagIcon size={32} className="opacity-20" />
                  <p className="text-sm font-mono">
                    {isEs
                      ? "No hay etiquetas en esta dimensión"
                      : "No tags in this dimension"}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {activeTags.map((tag) => (
                    <div
                      key={tag.id}
                      className="group flex items-center justify-between p-3 rounded-lg border border-(--border-primary) bg-black/5 hover:bg-black/10 hover:border-(--border-primary)/80 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        {/* Tag Preview */}
                        <TagBadge
                          name={isEs ? tag.nameEs : tag.nameEn}
                          className="bg-black/20"
                        />
                        <div className="flex flex-col">
                          <span className="text-xs font-mono text-(--text-muted) opacity-50">
                            {tag.id}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleDeleteTag(tag.id)}
                          className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="p-2 border-t border-(--border-primary) bg-black/30 text-[10px] text-center text-(--text-muted) font-mono">
          Taxonomy Manager v1.0 • AI-Powered Organization
        </div>
      </div>
    </div>
  );
}
