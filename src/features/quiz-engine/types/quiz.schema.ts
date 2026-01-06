// Enumeration for different question types in quiz engine
export enum QuestionType {
  MultipleChoice = 0, // Single correct answer
  MultipleResponse = 1, // Multiple correct answers
  HotArea = 2, // Select specific areas on an image
  YesNo = 3, // Yes or No question
}

// Interface representing an answer option for a question
export interface Answer {
  id: string; // Unique identifier for the answer
  text: string; // Text content of the answer
  isCorrect: boolean; // Indicates if the answer is correct
}

// Interface representing a quiz question
export interface Question {
  id: string; // Unique identifier for the question
  text: string; // Text content of the question
  category: string; // Category or domain of the question
  type: QuestionType; // Type of question
  imageUrl?: string; // Optional URL for an associated image
  explanation?: string; // Explanation or additional information about question
  metadata?: string; // Additional metadata related to question
  answers: Answer[]; // List of possible answers for question
}

// Interface representing the response structure for an exam
export interface ExamResponse {
  questions: Question[]; // Array of questions included in the exam
}
