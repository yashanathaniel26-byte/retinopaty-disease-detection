"use client";

import { useCallback, useRef, useState } from "react";
import { BarChart3, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PredictResponse } from "@/types/classification";
import { useLLMInterpretation } from "@/hooks/useLLMInterpretation";
import ClassificationTab from "./ClassificationTab";
import InterpretationTab from "./InterpretationTab";

type ResultsTabsProps = {
  result: PredictResponse;
  inferenceTime: string | null;
};

const TABS = [
  { id: "classification", label: "Hasil Klasifikasi", Icon: BarChart3 },
  { id: "interpretation", label: "Interpretasi & Edukasi", Icon: BookOpen },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function ResultsTabs({ result, inferenceTime }: ResultsTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>("classification");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const { interpretation, isLoading, error, refetch } =
    useLLMInterpretation(result);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      let nextIndex = index;
      if (e.key === "ArrowRight") {
        nextIndex = (index + 1) % TABS.length;
      } else if (e.key === "ArrowLeft") {
        nextIndex = (index - 1 + TABS.length) % TABS.length;
      } else if (e.key === "Home") {
        nextIndex = 0;
      } else if (e.key === "End") {
        nextIndex = TABS.length - 1;
      } else {
        return;
      }
      e.preventDefault();
      const nextTab = TABS[nextIndex];
      setActiveTab(nextTab.id);
      tabRefs.current[nextIndex]?.focus();
    },
    []
  );

  return (
    <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white sm:mt-6">
      {/* Tab Header */}
      <div
        className="flex border-b border-slate-200 bg-slate-50/50"
        role="tablist"
        aria-label="Hasil analisis"
      >
        {TABS.map((tab, index) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.Icon;
          return (
            <button
              key={tab.id}
              ref={(el) => { tabRefs.current[index] = el; }}
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.id}`}
              id={`tab-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveTab(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 border-b-2 px-4 py-3.5 text-sm font-medium transition-colors",
                isActive
                  ? "border-emerald-600 text-emerald-700"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              )}
              type="button"
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">{tab.label}</span>
              {/* Short labels on mobile */}
              <span className="sm:hidden">
                {tab.id === "classification" ? "Klasifikasi" : "Interpretasi"}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab Body */}
      <div className="p-4 sm:p-6">
        <div
          id="tabpanel-classification"
          role="tabpanel"
          aria-labelledby="tab-classification"
          className={cn(activeTab !== "classification" && "hidden")}
        >
          <ClassificationTab result={result} inferenceTime={inferenceTime} />
        </div>

        <div
          id="tabpanel-interpretation"
          role="tabpanel"
          aria-labelledby="tab-interpretation"
          className={cn(activeTab !== "interpretation" && "hidden")}
        >
          <InterpretationTab
            interpretation={interpretation}
            isLoading={isLoading}
            error={error}
            refetch={refetch}
          />
        </div>
      </div>
    </div>
  );
}
