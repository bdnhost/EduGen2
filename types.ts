export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  text: string;
  options: QuestionOption[];
}

export interface ChartDataPoint {
  label: string;
  value: number; // 1-10 scale
}

export interface Flashcard {
  term: string;
  definition: string;
}

export interface SyllabusItem {
  id: string;
  title: string;
  topic: string;
  lessonNumber: number;
  description: string;
  generatedData?: AssignmentData; // Store the full generated content here
}

export interface AssignmentData {
  // Meta
  courseName: string; // "Guide Name" conceptually
  lecturerName: string; // "Author" conceptually
  semester: string; // "Version/Date"
  title: string;
  timeEstimate: string;
  dueDate: string;
  weight: string;
  
  // Context
  topic: string;
  contextDescription: string;
  prerequisite: string;
  lessonNumber: number; // "Chapter Number"
  totalLessons: number;
  nextLessonTeaser?: string;
  
  // New: Flashcards (Concepts)
  flashcards: Flashcard[];

  // Intro
  welcomeTitle: string;
  welcomeText: string;
  objectives: string[];
  
  // Section 1: Case Study
  caseStudyTitle: string;
  caseStudyContent: string;
  questions: Question[];
  
  // Section 2: Analysis
  analysisTitle: string;
  analysisDescription: string;
  chartTitle: string;
  chartData: ChartDataPoint[];
  analysisQuestionText: string;
  analysisMinChars: number;
  
  // Section 3: Sort/Plan
  planTitle: string;
  planDescription: string;
  planItems: string[];
  planQuestionText: string;
  planMinChars: number;
  
  // Section 4: File & Reflection
  reflectionQuestionText: string;
  reflectionMinChars: number;
  
  // Style
  themeColorPrimary: string;
  themeColorSecondary: string;
}