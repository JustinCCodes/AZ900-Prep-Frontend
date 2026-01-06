"use client";

import { useEffect, useRef } from "react";
import { QuestionType, QuestionCardProps } from "../types/quiz.schema";
import { HotAreaMap } from "./HotAreaMap";
import { useOrganicScroll } from "@/shared/components/hooks";

// Component to render a question card with answers and explanation
export function QuestionCard({
  question, // Question data
  selectedAnswers, // Currently selected answer IDs
  onSelect, // Callback when an answer is selected
  showExplanation = false, // Whether to show explanation section
}: // Default to false
QuestionCardProps) {
  // Helper to check if an answer is selected
  const isSelected = (id: string) => selectedAnswers.includes(id);
  // Ref for the card element
  const cardRef = useRef<HTMLDivElement>(null);
  // Organic scroll hook
  const { organicScroll } = useOrganicScroll();

  // Effect to handle scrolling when explanation visibility changes
  useEffect(() => {
    // Delay to allow for animation completion
    const timer = setTimeout(() => {
      if (showExplanation && cardRef.current) {
        // Get card position
        const rect = cardRef.current.getBoundingClientRect();
        // Calculate bottom position with scroll offset
        const cardBottom = rect.bottom + window.scrollY;

        // Calculate target scroll position
        const target = cardBottom - window.innerHeight + 160;

        // Scroll if card bottom is out of view
        if (cardBottom > window.innerHeight + window.scrollY - 160) {
          organicScroll(target, 900);
        }
        // Scroll to top of card if explanation is shown
      } else if (!showExplanation) {
        organicScroll(0, 700);
      }
      // Delay of 400ms
    }, 400);

    // Cleanup timeout on unmount or dependency change
    return () => clearTimeout(timer);
  }, [showExplanation, organicScroll]);

  return (
    <div
      ref={cardRef}
      className="w-full max-w-3xl mx-auto bg-obsidian/60 backdrop-blur-xl rounded-3xl p-8 border border-mesh/40 shadow-2xl transition-all duration-500 flex flex-col min-h-125 relative"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <span className="px-3 py-1 text-[10px] font-bold tracking-widest uppercase bg-blue-500/10 text-blue-400 rounded-md border border-blue-500/20">
          {question.category}
        </span>
        <span className="text-slate-600 text-[10px] font-mono uppercase">
          {QuestionType[question.type]}
        </span>
      </div>

      {/* Question & Answers */}
      <div className="grow">
        <h2 className="text-xl md:text-2xl font-bold text-[#ededed] mb-10 leading-relaxed">
          {question.text}
        </h2>

        <div className="space-y-3">
          {question.type === QuestionType.HotArea ? (
            <HotAreaMap
              metadata={question.metadata}
              selectedIds={selectedAnswers}
              onSelect={onSelect}
            />
          ) : (
            question.answers.map((answer) => (
              <button
                key={answer.id}
                onClick={() => onSelect(answer.id)}
                className={`w-full text-left p-5 rounded-xl border transition-all duration-300 flex items-start group
                  ${
                    isSelected(answer.id)
                      ? "border-blue-500/60 bg-blue-500/5 shadow-[0_0_25px_rgba(59,130,246,0.1)]"
                      : "border-mesh hover:border-slate-500 bg-mesh/10 hover:bg-mesh/20"
                  }`}
              >
                {/* Radio/Checkbox */}
                <div
                  className={`mt-1 shrink-0 w-5 h-5 mr-4 flex items-center justify-center border transition-all
                  ${
                    question.type === QuestionType.MultipleResponse
                      ? "rounded"
                      : "rounded-full"
                  }
                  ${
                    isSelected(answer.id)
                      ? "bg-blue-600 border-blue-600"
                      : "border-slate-700 group-hover:border-blue-400"
                  }
                `}
                >
                  {isSelected(answer.id) && (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={4}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>

                {/* Answer Text */}
                <span
                  className={`text-base leading-relaxed transition-colors
                  ${
                    isSelected(answer.id)
                      ? "text-white font-medium"
                      : "text-slate-400 group-hover:text-slate-200"
                  }
                `}
                >
                  {answer.text}
                </span>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Animated Explanation Layer */}
      <div
        className={`grid transition-all duration-700 ease-in-out ${
          showExplanation && question.explanation
            ? "grid-rows-[1fr] opacity-100 pt-8"
            : "grid-rows-[0fr] opacity-0 pt-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="p-6 bg-blue-500/5 border border-blue-500/20 rounded-2xl">
            <p className="text-slate-400 text-sm leading-relaxed italic">
              <span className="text-blue-400 font-bold not-italic block mb-1 uppercase tracking-tighter">
                System Intelligence:
              </span>
              {question.explanation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
