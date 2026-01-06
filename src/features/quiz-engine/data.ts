"use cache";

import { apiRequest } from "@/shared/lib";
import { ExamResponse } from "./types/quiz.schema";
import { cacheLife } from "next/dist/server/use-cache/cache-life";

// Fetches the standard exam data from the API
export async function getStandardExam(seed?: string) {
  cacheLife("hours"); // Cache for 1 hour
  const url = seed ? `/exams/standard?seed=${seed}` : "/exams/standard"; // Constructs URL with optional seed
  return apiRequest<ExamResponse>(url); // Makes API request and returns response
}

// Fetches endless questions with specified page size from the API
export async function getEndlessQuestions(pageSize: number = 10) {
  // Sets cache life to none for endless questions
  return apiRequest<ExamResponse>(`/exams/endless?pageSize=${pageSize}`, {
    cache: "no-store",
  });
}
