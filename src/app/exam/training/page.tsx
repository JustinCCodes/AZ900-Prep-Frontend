"use client";

import { useState } from "react";
import { QuestionCard, QuestionType } from "@/features/quiz-engine";

// Mock question data for training mode
const MOCK_QUESTION = {
  id: "test-1",
  text: "Which Azure service is best suited for executing code in a serverless environment without managing infrastructure?",
  category: "Azure Compute Services",
  type: QuestionType.MultipleChoice,
  explanation:
    "Azure Functions is the correct answer. It is a serverless solution that allows you to write less code, maintain less infrastructure, and save on costs.",
  answers: [
    { id: "a", text: "Azure Virtual Machines", isCorrect: false },
    { id: "b", text: "Azure Functions", isCorrect: true },
    { id: "c", text: "Azure App Service", isCorrect: false },
    { id: "d", text: "Azure SQL Database", isCorrect: false },
  ],
};

// Training page component rendering a sample question
export default function TrainingPage() {
  // State for selected answers and explanation visibility
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);

  // Handler for selecting an answer
  const handleSelect = (id: string) => {
    setSelectedAnswers([id]);
  };

  return (
    <div className="min-h-screen w-full flex flex-col relative bg-obsidian">
      <header className="sticky top-0 z-40 w-full py-8 text-center bg-obsidian/80 backdrop-blur-md border-b border-mesh/20">
        <h1 className="text-3xl font-black text-white uppercase tracking-tighter">
          Optic <span className="text-blue-500 font-mono">Test</span>
        </h1>
      </header>

      <main className="grow px-6 pt-10 pb-48">
        <div className="max-w-4xl mx-auto">
          <QuestionCard
            question={MOCK_QUESTION}
            selectedAnswers={selectedAnswers}
            onSelect={(id) => setSelectedAnswers([id])}
            showExplanation={showExplanation}
          />
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 w-full p-8 bg-linear-to-t from-obsidian via-obsidian/90 to-transparent flex justify-center gap-4 z-50">
        <button
          onClick={() => setShowExplanation(!showExplanation)}
          className="px-8 py-3 bg-mesh/40 border border-mesh hover:border-blue-500/50 text-slate-400 hover:text-white transition-all rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] backdrop-blur-sm"
        >
          {showExplanation ? "Hide Explanation" : "Query Intelligence"}
        </button>
        <button
          onClick={() => setSelectedAnswers([])}
          className="px-8 py-3 bg-mesh/40 border border-mesh hover:border-red-500/50 text-slate-400 hover:text-white transition-all rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] backdrop-blur-sm"
        >
          Reset Session
        </button>
      </footer>
    </div>
  );
}
