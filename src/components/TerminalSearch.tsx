"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { useTranslations } from "next-intl";
import { Tag } from "@/types";
import { cn } from "@/utils/cn";

interface TerminalSearchProps {
  tags: Tag[];
  selectedTags: string[];
  placeholder?: string;
  onSearch: (query: string) => void;
  onTagSelect: (tag: string) => void;
  onTagRemove: (tag: string) => void;
  onCommand?: (command: string) => void;
}

export function TerminalSearch({
  tags,
  selectedTags,
  placeholder,
  onSearch,
  onTagSelect,
  onTagRemove,
  onCommand,
}: TerminalSearchProps) {
  const t = useTranslations("Terminal");
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<Tag[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const words = input.split(" ");
    const lastWord = words[words.length - 1].toLowerCase();

    if (lastWord.length > 0) {
      const matching = tags.filter(
        (tag) =>
          tag.name.toLowerCase().startsWith(lastWord) &&
          !selectedTags.includes(tag.name),
      );
      setSuggestions(matching.slice(0, 5));
      setSelectedSuggestion(0);
    } else {
      setSuggestions([]);
    }
  }, [input, tags, selectedTags]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === " " && suggestions.length > 0) {
      e.preventDefault();
      const selectedTag = suggestions[selectedSuggestion];
      if (selectedTag) {
        onTagSelect(selectedTag.name);
        const words = input.split(" ");
        words.pop();
        setInput(words.join(" ") + (words.length > 0 ? " " : ""));
        setSuggestions([]);
      }
    } else if (e.key === "ArrowDown" && suggestions.length > 0) {
      e.preventDefault();
      setSelectedSuggestion((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === "ArrowUp" && suggestions.length > 0) {
      e.preventDefault();
      setSelectedSuggestion(
        (prev) => (prev - 1 + suggestions.length) % suggestions.length,
      );
    } else if (
      e.key === "Backspace" &&
      input === "" &&
      selectedTags.length > 0
    ) {
      onTagRemove(selectedTags[selectedTags.length - 1]);
    } else if (e.key === "Enter") {
      e.preventDefault();
      // Check for commands
      if (onCommand && (input.trim() === "new" || input.trim() === "add")) {
        onCommand(input.trim());
        setInput("");
      } else {
        onSearch(input);
      }
    }
  };

  // Debounce logic
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(input);
    }, 500);

    return () => clearTimeout(timer);
  }, [input, onSearch]);

  const handleInputChange = (value: string) => {
    setInput(value);
    // onSearch(value); // Removed immediate call
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        {/* Terminal prompt */}
        <div className="flex items-center gap-1 shrink-0">
          <span className="text-purple-400 font-bold">~</span>
          <span className="text-green-400 font-bold">&gt;</span>
        </div>

        {/* Selected tags */}
        <div className="flex items-center gap-1 flex-wrap">
          {selectedTags.map((tag) => (
            <span
              key={tag}
              onClick={() => onTagRemove(tag)}
              className="px-2 py-0.5 bg-(--acc-primary-glow) text-(--acc-primary) text-sm rounded cursor-pointer hover:bg-(--acc-primary)/20 transition-colors border border-(--acc-primary)/30"
            >
              [{tag}]
            </span>
          ))}
        </div>

        {/* Input with blinking cursor */}
        <div className="relative flex-1 min-w-[100px]">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full bg-transparent text-(--acc-primary) outline-none font-mono text-sm caret-transparent placeholder:text-(--text-muted)"
            placeholder={placeholder}
            autoComplete="off"
            spellCheck={false}
          />
          {/* Custom blinking cursor - only show when typing or focused */}
          {(input.length > 0 || isFocused) && (
            <span
              className={cn(
                "absolute top-0 text-(--acc-primary) pointer-events-none animate-blink",
                input.length === 0 && "opacity-50",
              )}
              style={{ left: `${input.length * 0.6}em` }}
            >
              ▋
            </span>
          )}
        </div>
      </div>

      {/* Suggestions dropdown */}
      {suggestions.length > 0 && (
        <div className="absolute bottom-full left-8 mb-1 bg-gray-900 border border-green-700/50 rounded shadow-lg z-50">
          {suggestions.map((tag, index) => (
            <div
              key={tag.name}
              className={cn(
                "px-3 py-1 text-sm font-mono cursor-pointer flex items-center justify-between gap-4",
                index === selectedSuggestion
                  ? "bg-(--acc-primary-glow) text-(--acc-primary)"
                  : "text-(--text-secondary) hover:bg-(--bg-surface-hover)",
              )}
              onClick={() => {
                onTagSelect(tag.name);
                const words = input.split(" ");
                words.pop();
                setInput(words.join(" ") + (words.length > 0 ? " " : ""));
                setSuggestions([]);
                inputRef.current?.focus();
              }}
            >
              <span>{tag.name}</span>
              <span className="text-gray-600">({tag.count})</span>
            </div>
          ))}
          <div className="px-3 py-1 text-xs text-(--text-muted) border-t border-(--border-primary)">
            {t("selectHint")}
          </div>
        </div>
      )}
    </div>
  );
}
