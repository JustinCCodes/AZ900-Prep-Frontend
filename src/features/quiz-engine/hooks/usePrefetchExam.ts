"use client";

import { useEffect, useState } from "react";
import { getStandardExam } from "../data";
import { ExamMode } from "../types/quiz.schema";

export function usePrefetchExam(mode: ExamMode) {
  // Generates a unique seed for the session
  const [sessionSeed] = useState(() => Math.random().toString(36).substring(7));

  // Effect to prefetch exam data on mount
  useEffect(() => {
    // Skip prefetching for endless mode
    if (mode === "endless") return;

    // Async function to prefetch exam
    const warmup = async () => {
      console.log(
        `[Rank: Principal] Warming up fresh ${mode} session [Seed: ${sessionSeed}]`
      );
      // Prefetch exam data
      try {
        await getStandardExam(sessionSeed);
        // Catches and logs any errors
      } catch (err) {
        console.error("Prefetch failed", err);
      }
    };

    // Initiates prefetching
    warmup();
  }, [mode, sessionSeed]); // Dependencies: mode and sessionSeed

  return { sessionSeed }; // Returns the generated session seed
}
