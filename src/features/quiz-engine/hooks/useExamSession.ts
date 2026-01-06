"use client";

import { useState, useCallback, useMemo, use, useEffect } from "react";
import { getStandardExam, getEndlessQuestions } from "../data";
import { ExamMode, ExamState, QuestionType } from "../types/quiz.schema";

// Custom hook to manage exam session state and logic
export function useExamSession(mode: ExamMode, seed?: string) {
  const STORAGE_KEY = `az900_session_${mode}`;

  // Initial data fetch based on exam mode
  const initialData = use(
    mode === "endless" ? getEndlessQuestions(10) : getStandardExam(seed)
  );

  // Exam state management
  const [state, setState] = useState<ExamState>(() => {
    if (typeof window !== "undefined" && mode !== "endless") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    }
    return {
      questions: initialData.questions,
      currentQuestionIndex: 0,
      userAnswers: {},
      isFinished: false,
      timeLeft: mode === "timed" ? 3600 : null,
    };
  });

  // Persist state to localStorage on changes
  useEffect(() => {
    if (mode !== "endless") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, mode, STORAGE_KEY]);

  // Timer effect for timed exams
  useEffect(() => {
    if (mode !== "timed" || state.isFinished || (state.timeLeft ?? 0) <= 0)
      return;
    const id = setInterval(() => {
      setState((p) => ({ ...p, timeLeft: Math.max(0, (p.timeLeft ?? 0) - 1) }));
    }, 1000);
    return () => clearInterval(id);
  }, [mode, state.isFinished, state.timeLeft]);

  const selectAnswer = useCallback((questionId: string, answerId: string) => {
    setState((prev) => {
      const q = prev.questions.find((x) => x.id === questionId);
      if (!q) return prev;

      const current = prev.userAnswers[questionId] || [];
      const newAnswers =
        q.type === QuestionType.MultipleResponse
          ? current.includes(answerId)
            ? current.filter((id) => id !== answerId)
            : [...current, answerId]
          : [answerId];

      return {
        ...prev,
        userAnswers: { ...prev.userAnswers, [questionId]: newAnswers },
      };
    });
  }, []);

  const nextQuestion = useCallback(() => {
    setState((p) => ({
      ...p,
      currentQuestionIndex: p.currentQuestionIndex + 1,
    }));
  }, []);

  const finish = useCallback(() => {
    setState((p) => ({ ...p, isFinished: true }));
    localStorage.removeItem(STORAGE_KEY);
  }, [STORAGE_KEY]);

  const score = useMemo(() => {
    const correctCount = state.questions.filter((q) => {
      const user = state.userAnswers[q.id] || [];
      const correct = q.answers.filter((a) => a.isCorrect).map((a) => a.id);
      return (
        user.length === correct.length &&
        user.every((id) => correct.includes(id))
      );
    }).length;
    return state.questions.length
      ? (correctCount / state.questions.length) * 100
      : 0;
  }, [state.questions, state.userAnswers]);

  return {
    ...state,
    currentQuestion: state.questions[state.currentQuestionIndex],
    selectAnswer,
    nextQuestion,
    finish,
    score,
  };
}
