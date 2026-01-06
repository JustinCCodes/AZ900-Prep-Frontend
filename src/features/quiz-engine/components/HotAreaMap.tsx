"use client";

import { useMemo } from "react";
import { HotAreaMapProps, HotAreaRegion } from "../types/quiz.schema";

// Component to render an interactive Hot Area Map for quiz questions
export function HotAreaMap({
  metadata,
  selectedIds,
  onSelect,
}: HotAreaMapProps) {
  // Parse metadata to extract regions
  const regions = useMemo((): HotAreaRegion[] => {
    // Safely parses JSON metadata
    try {
      return metadata ? JSON.parse(metadata) : [];
      // Returns empty array if no metadata
    } catch (e) {
      console.error("Failed to parse HotArea metadata", e);
      return [];
    }
    // Recomputes only if metadata changes
  }, [metadata]);

  // Handles case with no regions defined
  if (regions.length === 0) {
    return (
      <div className="p-8 border-2 border-dashed border-slate-700 rounded-xl text-center text-slate-500">
        Interactive map data unavailable.
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-inner">
      <svg viewBox="0 0 1000 562" className="w-full h-full touch-none">
        {regions.map((region) => {
          const isSelected = selectedIds.includes(region.id);
          return (
            <path
              key={region.id}
              d={region.path}
              onClick={() => onSelect(region.id)}
              className={`cursor-pointer transition-all duration-300 stroke-2
                ${
                  isSelected
                    ? "fill-blue-500/40 stroke-blue-400"
                    : "fill-transparent stroke-slate-600 hover:fill-slate-700/30 hover:stroke-slate-400"
                }`}
            />
          );
        })}
      </svg>

      <div className="absolute bottom-2 right-2 text-[10px] text-slate-500 font-mono">
        Interactive Hot Area
      </div>
    </div>
  );
}
