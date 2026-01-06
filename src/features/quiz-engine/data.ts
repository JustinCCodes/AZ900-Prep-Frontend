"use cache";

import { apiRequest } from "@/shared/lib";
import { ExamResponse } from "./types/quiz.schema";
import { cacheLife } from "next/dist/server/use-cache/cache-life";

// Fetches the standard exam data from the API
export async function getStandardExam() {
  // Sets cache life to hours for standard exam
  cacheLife("hours");
  // Makes API request to fetch standard exam
  return apiRequest<ExamResponse>("/exams/standard");
}

// Fetches endless questions with specified page size from the API
export async function getEndlessQuestions(pageSize: number = 10) {
  // Sets cache life to none for endless questions
  return apiRequest<ExamResponse>(`/exams/endless?pageSize=${pageSize}`, {
    cache: "no-store",
  });
}
