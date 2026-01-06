import { apiRequest } from "@/shared/lib";
import { ExamResponse } from "./types/quiz.schema";

// Service object for quiz-related API calls
export const quizService = {
  getStandardExam: () => apiRequest<ExamResponse>("/exams/standard"),

  // Fetches endless random questions with optional limit
  getEndlessQuestions: (limit: number = 10) =>
    apiRequest<ExamResponse>(`/exams/endless?pageSize=${limit}`),
};
