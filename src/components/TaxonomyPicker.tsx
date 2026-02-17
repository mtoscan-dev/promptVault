import React, { useState } from "react";
import {
  X,
  ChevronDown,
  ChevronRight,
  Hash,
  Tag,
  Settings,
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { SmartTag, Taxonomy } from "@/types";
import { TagBadge } from "./TagBadge";
import { cn } from "@/utils/cn";
import { TaxonomyManager } from "./TaxonomyManager";

interface TaxonomyPickerProps {
  taxonomy: Taxonomy;
  selectedTags: SmartTag[];
  onToggleTag: (tag: SmartTag) => void;
  onClose: () => void;
}

export function TaxonomyPicker({
  taxonomy,
  selectedTags,
  onToggleTag,
  onClose,
}: TaxonomyPickerProps) {
  const t = useTranslations("Common"); // Assuming Common translations are available
  const locale = useLocale();
  const isEs = locale === "es";
  const [showManager, setShowManager] = useState(false);

  // Initialize with some dimensions expanded by default
  const [expandedDimensions, setExpandedDimensions] = useState<string[]>([
    "task",
    "persona",
    "tone",
  ]);

  const toggleDimension = (dimId: string) => {
    setExpandedDimensions((prev) =>
      prev.includes(dimId)
        ? prev.filter((id) => id !== dimId)
        : [...prev, dimId],
    );
  };

  // Group tags by dimension
  // Filter out dimensions that don't have tags in the list
  const tagsByDimension: Record<string, SmartTag[]> = {};
  taxonomy.dimensions.forEach((dim) => {
    const tags = taxonomy.tags.filter((t) => t.dimensionId === dim.id);
    if (tags.length > 0) {
      tagsByDimension[dim.id] = tags as unknown as SmartTag[];
    }
  });

  return (
    <>
      <div className="absolute top-0 right-0 bottom-0 w-80 bg-(--bg-surface) border-l border-(--border-primary) shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-(--border-primary) bg-black/20">
          <div className="flex items-center gap-2 text-(--acc-primary)">
            <Hash size={16} />
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider">
              {isEs ? "Taxonomía" : "Taxonomy"}
            </h3>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowManager(true)}
              className="p-1.5 text-(--text-muted) hover:text-(--text-primary) hover:bg-(--bg-surface-hover) rounded transition-colors"
              title={isEs ? "Gestionar Taxonomía" : "Manage Taxonomy"}
            >
              <Settings size={16} />
            </button>
            <div className="w-px h-4 bg-(--border-primary)/50 mx-1" />
            <button
              onClick={onClose}
              className="p-1.5 text-(--text-muted) hover:text-(--text-primary) hover:bg-(--bg-surface-hover) rounded transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
          {taxonomy.dimensions.map((dim) => {
            const dimensionTags = tagsByDimension[dim.id];
            // Show dimensions even if empty so users can see structure (optional, but good for discovery)
            // But strict logic was: if (!dimensionTags) return null;
            // Reverting to allow empty dimensions might require checking logic elsewhere,
            // but for now let's stick to existing "hide empty" logic unless we want to allow users to add tags to empty dims via manager.
            // Since managing is done in Manager, hiding empty dims here is fine for "Picking".
            if (!dimensionTags) return null;

            const isExpanded = expandedDimensions.includes(dim.id);

            return (
              <div key={dim.id} className="space-y-2">
                <button
                  onClick={() => toggleDimension(dim.id)}
                  className="w-full flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-(--text-muted) hover:text-(--text-primary) transition-colors group"
                >
                  {isExpanded ? (
                    <ChevronDown size={12} className="text-(--acc-primary)" />
                  ) : (
                    <ChevronRight size={12} />
                  )}
                  <span className={cn(isExpanded && "text-(--text-primary)")}>
                    {isEs ? dim.nameEs : dim.nameEn}
                  </span>
                  <div className="flex-1 h-px bg-(--border-primary)/30 group-hover:bg-(--border-primary) transition-colors" />
                  <span className="text-[10px] text-(--text-muted) opacity-50">
                    {dimensionTags.length}
                  </span>
                </button>

                {isExpanded && (
                  <div className="grid gap-2 pl-2 animate-in slide-in-from-top-1 duration-200">
                    {dimensionTags.map((tag) => {
                      const isSelected = selectedTags.some(
                        (t) => t.id === tag.id,
                      );
                      const tagName = isEs ? tag.nameEs : tag.nameEn;
                      const tagDesc = isEs
                        ? tag.descriptionEs
                        : tag.descriptionEn;

                      return (
                        <button
                          key={tag.id}
                          onClick={() => onToggleTag(tag)}
                          className={cn(
                            "w-full text-left p-2 rounded border transition-all duration-200 group/item relative overflow-hidden",
                            isSelected
                              ? "bg-(--bg-surface-active) border-(--acc-primary)/30"
                              : "bg-transparent border-transparent hover:bg-(--bg-surface-hover) hover:border-(--border-primary)/50",
                          )}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <TagBadge
                              name={tagName}
                              className={cn(
                                "pointer-events-none",
                                !isSelected &&
                                  "opacity-80 grayscale group-hover/item:grayscale-0 group-hover/item:opacity-100",
                              )}
                            />
                            {isSelected && (
                              <div className="w-1.5 h-1.5 rounded-full bg-(--acc-primary) shadow-[0_0_5px_var(--acc-primary)] animate-pulse" />
                            )}
                          </div>
                          <p className="text-[10px] text-(--text-muted) leading-relaxed line-clamp-2 pl-0.5">
                            {tagDesc}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-(--border-primary) bg-black/20 text-[10px] text-center text-(--text-muted) font-mono uppercase tracking-widest">
          {selectedTags.length}{" "}
          {isEs ? "Etiquetas Seleccionadas" : "Tags Selected"}
        </div>
      </div>

      {/* Taxonomy Manager Modal */}
      {showManager && (
        <TaxonomyManager
          taxonomy={taxonomy}
          onClose={() => setShowManager(false)}
        />
      )}
    </>
  );
}
