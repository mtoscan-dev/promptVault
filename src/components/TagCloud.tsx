import { Tag } from "@/types";
import { cn } from "@/utils/cn";
import { getTagStyle } from "@/utils/styling";

interface TagCloudProps {
  tags: Tag[];
  selectedTags: string[];
  onTagClick: (tag: string) => void;
}

export function TagCloud({ tags, selectedTags, onTagClick }: TagCloudProps) {
  if (tags.length === 0) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {tags.map((tag) => {
        const isSelected = selectedTags.includes(tag.name);
        const style = getTagStyle(tag.name);

        return (
          <button
            key={tag.name}
            onClick={() => onTagClick(tag.name)}
            style={!isSelected ? style : undefined}
            className={cn(
              "px-2 py-0.5 text-xs font-mono rounded border transition-all uppercase tracking-tighter hover:brightness-125 shadow-sm",
              isSelected
                ? "bg-[var(--acc-primary-glow)] border-[var(--acc-primary)] text-[var(--acc-primary)]"
                : "border-[var(--border-primary)]",
            )}
          >
            $ {tag.name}
            <span className="ml-1 text-gray-600">({tag.count})</span>
          </button>
        );
      })}
    </div>
  );
}
