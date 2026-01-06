import { apiRequest } from "@/shared/lib";
import { ExamResponse } from "./types/quiz.schema";

// Service object to interact with quiz-related API endpoints
export const quizService = {
  // Fetches standard exam with caching
  getStandardExam: async () =>
    apiRequest<ExamResponse>("/exams/standard", {
      next: { revalidate: 3600 }, // Cache the weighted exam for 1 hour
    }),

  // Fetches endless questions without caching
  getEndlessQuestions: (pageSize: number = 10) =>
    apiRequest<ExamResponse>(`/exams/endless?pageSize=${pageSize}`, {
      cache: "no-store", // Endless mode must always be fresh
    }),
};
