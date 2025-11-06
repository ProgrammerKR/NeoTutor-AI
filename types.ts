// FIX: Removed erroneous self-import of EducationalContent.
export interface KeyConcept {
  concept: string;
  explanation: string;
}

export interface Flashcard {
  term: string;
  definition: string;
}

export interface QuizItem {
  question: string;
  type: 'MCQ' | 'T/F';
  options?: string[];
  answer: string;
}

export interface EducationalContent {
  summary: string;
  keyConcepts: KeyConcept[];
  flashcards: Flashcard[];
  quiz: QuizItem[];
}

export interface HistoryItem {
  id: string;
  sourceName: string;
  originalText: string; // Added to provide context for follow-up chats
  content: EducationalContent;
  createdAt: string; // ISO Date String
}

export type DashboardView = 'summary' | 'concepts' | 'flashcards' | 'quiz' | 'chat';

export interface SharePayload {
  sourceName: string;
  view: DashboardView;
  data: EducationalContent['summary'] | EducationalContent['keyConcepts'] | EducationalContent['flashcards'] | EducationalContent['quiz'];
}