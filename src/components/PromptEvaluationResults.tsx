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

// --- Scoring Constants ---
const SCORE_MAX = {
  structure: 20,
  context: 20,
  quality: 20,
  viability: 15,
  total: 75,
} as const;

const LOW_SCORE_THRESHOLD = 60;

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
  onOptimize?: () => void;
  isOptimizing?: boolean;
  className?: string;
}

export function PromptEvaluationResults({
  data,
  onOptimize,
  isOptimizing,
  className,
}: PromptEvaluationResultsProps) {
  const t = useTranslations("Editor.Evaluation");
  const locale = useLocale();
  const isEs = locale === "es";

  const categories = [
    {
      id: "structure" as const,
      icon: Layout,
      label: t("categories.structure"),
      color: "blue",
      max: SCORE_MAX.structure,
      details: data.categories.structure,
    },
    {
      id: "context" as const,
      icon: Target,
      label: t("categories.context"),
      color: "purple",
      max: SCORE_MAX.context,
      details: data.categories.context,
    },
    {
      id: "quality" as const,
      icon: TrendingUp,
      label: t("categories.quality"),
      color: "yellow",
      max: SCORE_MAX.quality,
      details: data.categories.quality,
    },
    {
      id: "viability" as const,
      icon: ShieldCheck,
      label: t("categories.viability"),
      color: "green",
      max: SCORE_MAX.viability,
      details: data.categories.viability,
    },
  ];

  const getScoreColor = (score: number, max: number) => {
    const percentage = (score / max) * 100;
    if (percentage >= 80) return "text-green-400";
    if (percentage >= 50) return "text-yellow-400";
    return "text-red-400";
  };

  const isLowScore = data.totalScore < LOW_SCORE_THRESHOLD;

  // SVG circular progress values
  const circleRadius = 18;
  const circleCircumference = 2 * Math.PI * circleRadius;
  const scorePercent = Math.min(100, (data.totalScore / SCORE_MAX.total) * 100);
  const strokeOffset =
    circleCircumference - (scorePercent / 100) * circleCircumference;

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
                  getScoreColor(data.totalScore, SCORE_MAX.total),
                )}
              >
                {data.totalScore}
              </span>
              <span className="text-xs text-(--text-muted) opacity-50">
                / {SCORE_MAX.total}
              </span>
            </div>
          </div>
        </div>

        {/* SVG Circular Progress */}
        <div className="w-12 h-12 relative">
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            className="transform -rotate-90"
          >
            {/* Background circle */}
            <circle
              cx="24"
              cy="24"
              r={circleRadius}
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="text-white/5"
            />
            {/* Progress arc */}
            <circle
              cx="24"
              cy="24"
              r={circleRadius}
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray={circleCircumference}
              strokeDashoffset={strokeOffset}
              className="text-indigo-500/60 transition-all duration-1000 ease-out"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-mono text-indigo-300 font-bold">
            {Math.round(scorePercent)}%
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
                  getScoreColor(cat.details.score, cat.max),
                )}
              >
                {cat.details.score}
                <span className="text-white/30 font-normal"> / {cat.max}</span>
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
                  width: `${(cat.details.score / cat.max) * 100}%`,
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
        <div className="space-y-4">
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

          {/* Refinement Button — gated by score */}
          {onOptimize && isLowScore && (
            <button
              onClick={onOptimize}
              disabled={isOptimizing}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl transition-all border font-mono text-[10px] uppercase tracking-widest group bg-indigo-500/10 border-indigo-500/20 text-indigo-300 hover:bg-indigo-500/20 hover:border-indigo-500/40"
            >
              {isOptimizing ? (
                <TrendingUp size={14} className="animate-pulse" />
              ) : (
                <CheckCircle2
                  size={14}
                  className="group-hover:scale-110 transition-transform text-indigo-400"
                />
              )}
              {isOptimizing ? t("processing") : t("aiRefinement")}
            </button>
          )}

          {/* Score is good — show success message instead of optimize button */}
          {!isLowScore && (
            <div className="flex items-center gap-2 p-3 bg-green-500/5 border border-green-500/10 rounded-xl">
              <CheckCircle2 size={14} className="text-green-500 shrink-0" />
              <span className="text-[10px] font-mono text-green-400/80">
                {t("scoreGood")}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
