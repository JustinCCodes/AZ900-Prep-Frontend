"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { getStandardExam, getEndlessQuestions } from "../data";
import { ExamMode, ExamState, QuestionType } from "../types/quiz.schema";

// Custom hook to manage exam session state and logic
export function useExamSession(mode: ExamMode) {
  const STORAGE_KEY = `az900_session_${mode}`;

  // State Initialization: Now can initialize from localStorage for non-endless modes
  const [state, setState] = useState<ExamState>(() => {
    if (typeof window !== "undefined" && mode !== "endless") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    }
    return {
      questions: [], // Initially empty, to be filled after fetch
      currentQuestionIndex: 0, // Start at the first question
      userAnswers: {}, // No answers selected initially
      isFinished: false, // Exam not finished at start
      timeLeft: mode === "timed" ? 3600 : null, // 1 hour for timed exams
    };
  });

  // Loading and Error States
  const [isLoading, setIsLoading] = useState(state.questions.length === 0);
  const [error, setError] = useState<string | null>(null);

  // Data Fetching Effect
  useEffect(() => {
    if (state.questions.length > 0) return;

    // To avoid setting state on unmounted component
    let isMounted = true;
    // Async function to load exam data
    const load = async () => {
      try {
        // Fetches exam based on mode
        const response =
          mode === "endless"
            ? await getEndlessQuestions(10)
            : await getStandardExam();

        // Updates state if component is still mounted
        if (isMounted) {
          setState((prev) => ({ ...prev, questions: response.questions }));
          setIsLoading(false);
        }
        // Catches and sets error state
      } catch (err) {
        if (isMounted) setError(err instanceof Error ? err.message : "Error");
      }
    };

    // Initiates data
    load();
    // Cleanup function to set isMounted to false
    return () => {
      isMounted = false;
    };
    // Dependencies include mode and question length to refetch if mode changes
  }, [mode, state.questions.length]);

  // Persist state to localStorage on changes (except for endless mode)
  useEffect(() => {
    // Saves state to localStorage for non-endless modes
    if (mode !== "endless" && state.questions.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
    // Dependencies include state and mode
  }, [state, mode, STORAGE_KEY]);

  // Timer Effect for Timed Exams
  useEffect(() => {
    // Only runs for timed mode and if exam is not finished
    if (mode !== "timed" || state.isFinished || state.timeLeft === 0) return;
    // Sets interval to decrement timeLeft every second
    const id = setInterval(() => {
      setState((p) => ({ ...p, timeLeft: (p.timeLeft ?? 0) - 1 }));
    }, 1000);
    // Cleanup interval on unmount or when dependencies change
    return () => clearInterval(id);
    // Dependencies include mode, isFinished, and timeLeft
  }, [mode, state.isFinished, state.timeLeft]);

  // Handler to select an answer for a question
  const selectAnswer = useCallback((questionId: string, answerId: string) => {
    setState((prev) => {
      // Finds the question to determine its type
      const q = prev.questions.find((x) => x.id === questionId);
      // If question not found, return previous state
      if (!q) return prev;

      // Determines new answers based on question type
      const current = prev.userAnswers[questionId] || [];

      // For MultipleResponse, toggle the answer; for others, set single answer
      const newAnswers =
        q.type === QuestionType.MultipleResponse // Checks question type
          ? current.includes(answerId) // Toggles answer selection
            ? current.filter((id) => id !== answerId) // Deselects answer
            : [...current, answerId] // Selects answer
          : [answerId]; // Single answer selection

      // Returns updated state with new answers
      return {
        ...prev, // Spreads previous state
        userAnswers: { ...prev.userAnswers, [questionId]: newAnswers }, // Updates user answers
      };
    });
    // Dependencies include none as setState is stable
  }, []);

  // Calculates score based on correct answers
  const score = useMemo(() => {
    // Counts correct answers
    const correctCount = state.questions.filter((q) => {
      // Retrieves user's answers for the question
      const user = state.userAnswers[q.id] || [];
      // Retrieves correct answers for the question
      const correct = q.answers.filter((a) => a.isCorrect).map((a) => a.id);
      // Compares user's answers with correct answers
      return (
        user.length === correct.length && // Checks length match
        user.every((id) => correct.includes(id)) // Checks all answers match
      );
      // Filters questions to only those answered correctly
    }).length;
    // Returns score as a percentage
    return state.questions.length
      ? (correctCount / state.questions.length) * 100 // Calculates percentage
      : 0; // Avoids division by zero
    // Dependencies include questions and userAnswers
  }, [state.questions, state.userAnswers]);

  // Returns state and handlers from hook
  return {
    ...state, // Spreads exam state
    currentQuestion: state.questions[state.currentQuestionIndex], // Current question
    isLoading, // Loading state
    error, // Error state
    selectAnswer, // Answer selection handler
    score, // Calculated score
    // Handler to move to next question
    nextQuestion: () =>
      setState((p) => ({
        ...p, // Spreads previous state
        currentQuestionIndex: p.currentQuestionIndex + 1, // Increments question index
      })),
    // Handler to finish the exam
    finish: () => {
      setState((p) => ({ ...p, isFinished: true })); // Sets isFinished to true
      localStorage.removeItem(STORAGE_KEY); // Clears saved state from localStorage
    },
  };
}
