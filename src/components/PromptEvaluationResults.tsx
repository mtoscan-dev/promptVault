"use client";

import React from "react";
import {
  BarChart2,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Target,
  Layout,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { useLocale, useTranslations } from "next-intl";

interface EvaluationCategory {
  score: number;
  feedback: string;
  strengths?: string[];
}

interface EvaluationData {
  totalScore: number;
  categories: {
    structure: EvaluationCategory;
    context: EvaluationCategory;
    quality: EvaluationCategory;
    viability: EvaluationCategory;
  };
  prioritySuggestions: string[];
}

interface PromptEvaluationResultsProps {
  data: EvaluationData;
  className?: string;
}

export function PromptEvaluationResults({
  data,
  className,
}: PromptEvaluationResultsProps) {
  const t = useTranslations("Editor.Evaluation");
  const locale = useLocale();
  const isEs = locale === "es";

  const categories = [
    {
      id: "structure",
      icon: Layout,
      label: t("categories.structure"),
      color: "blue",
      details: data.categories.structure,
    },
    {
      id: "context",
      icon: Target,
      label: t("categories.context"),
      color: "purple",
      details: data.categories.context,
    },
    {
      id: "quality",
      icon: TrendingUp,
      label: t("categories.quality"),
      color: "yellow",
      details: data.categories.quality,
    },
    {
      id: "viability",
      icon: ShieldCheck,
      label: t("categories.viability"),
      color: "green",
      details: data.categories.viability,
    },
  ];

  const getScoreColor = (score: number, max: number) => {
    const percentage = (score / max) * 100;
    if (percentage >= 80) return "text-green-400";
    if (percentage >= 50) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div
      className={cn(
        "space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500",
        className,
      )}
    >
      {/* Total Score Header */}
      <div className="flex items-center justify-between p-4 bg-black/20 border border-white/5 rounded-xl backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/10 rounded-lg border border-indigo-500/20 text-indigo-400">
            <BarChart2 size={20} />
          </div>
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-(--text-muted)">
              {t("totalScore")}
            </h4>
            <div className="flex items-baseline gap-1">
              <span
                className={cn(
                  "text-2xl font-bold font-mono",
                  getScoreColor(data.totalScore, 75),
                )}
              >
                {data.totalScore}
              </span>
              <span className="text-xs text-(--text-muted) opacity-50">
                / 75
              </span>
            </div>
          </div>
        </div>

        {/* Progress Circle or Meter could go here */}
        <div className="w-12 h-12 rounded-full border-2 border-white/5 flex items-center justify-center relative">
          <div
            className="absolute inset-0 rounded-full border-2 border-indigo-500/40"
            style={{
              clipPath: `polygon(0 0, 100% 0, 100% ${Math.min(100, (data.totalScore / 75) * 100)}%, 0 ${Math.min(100, (data.totalScore / 75) * 100)}%)`,
              transform: "rotate(-90deg)",
            }}
          />
          <span className="text-[10px] font-mono text-indigo-300 font-bold">
            {Math.round((data.totalScore / 75) * 100)}%
          </span>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="grid gap-3">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="p-3 bg-white/5 border border-white/5 rounded-lg transition-all hover:bg-white/10 hover:border-white/10 group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <cat.icon
                  size={14}
                  className={cn(
                    cat.color === "blue" && "text-blue-400",
                    cat.color === "purple" && "text-purple-400",
                    cat.color === "yellow" && "text-yellow-400",
                    cat.color === "green" && "text-green-400",
                  )}
                />
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-white/70">
                  {cat.label}
                </span>
              </div>
              <span
                className={cn(
                  "text-xs font-mono font-bold",
                  getScoreColor(
                    cat.details.score,
                    cat.id === "viability" ? 15 : 20,
                  ),
                )}
              >
                {cat.details.score}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="h-1 bg-white/5 rounded-full mb-2 overflow-hidden">
              <div
                className={cn(
                  "h-full transition-all duration-1000",
                  cat.color === "blue" && "bg-blue-500",
                  cat.color === "purple" && "bg-purple-500",
                  cat.color === "yellow" && "bg-yellow-500",
                  cat.color === "green" && "bg-green-500",
                )}
                style={{
                  width: `${(cat.details.score / (cat.id === "viability" ? 15 : 20)) * 100}%`,
                }}
              />
            </div>

            <p className="text-[10px] text-(--text-muted) leading-relaxed">
              {cat.details.feedback}
            </p>
          </div>
        ))}
      </div>

      {/* Actionable Suggestions */}
      {data.prioritySuggestions.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-(--text-muted) flex items-center gap-2 px-1">
            <AlertTriangle size={12} className="text-yellow-400" />
            {t("refinementSuggestions")}
          </h4>
          <div className="space-y-2">
            {data.prioritySuggestions.map((suggestion, i) => (
              <div
                key={i}
                className="flex gap-2 p-3 bg-yellow-500/5 border border-yellow-500/10 rounded-lg text-[11px] text-yellow-100/80 leading-snug animate-in slide-in-from-left-2 duration-300"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <span className="text-yellow-500 shrink-0 select-none">
                  {i + 1}.
                </span>
                <span>{suggestion}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
