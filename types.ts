
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

export interface NarrationPart {
  fileName: string;
  script: string;
  stability?: number;
  similarity_boost?: number;
  model_id?: string;
}

export interface NarrationData {
  welcome: NarrationPart;
  caseStudy: NarrationPart;
  summary: NarrationPart;
}

export interface PedagogicalReview {
  bloomLevel: 'Remember' | 'Understand' | 'Apply' | 'Analyze' | 'Evaluate' | 'Create';
  scaffoldingScore: number; // 1-100
  engagementStrategy: string;
  instructionalRationale: string;
  suggestedImprovement: string;
}

export interface SyllabusItem {
  id: string;
  title: string;
  topic: string;
  lessonNumber: number;
  description: string;
  generatedData?: AssignmentData;
  isDeployed?: boolean;
}

export interface AssignmentData {
  courseName: string;
  lecturerName: string;
  semester: string;
  title: string;
  timeEstimate: string;
  dueDate: string;
  weight: string;
  submissionUrl?: string;
  topic: string;
  contextDescription: string;
  prerequisite: string;
  lessonNumber: number;
  totalLessons: number;
  nextLessonTeaser?: string;
  flashcards: Flashcard[];
  welcomeTitle: string;
  welcomeText: string;
  objectives: string[];
  caseStudyTitle: string;
  caseStudyContent: string;
  questions: Question[];
  analysisTitle: string;
  analysisDescription: string;
  chartTitle: string;
  chartData: ChartDataPoint[];
  analysisQuestionText: string;
  analysisMinChars: number;
  planTitle: string;
  planDescription: string;
  planItems: string[];
  planQuestionText: string;
  planMinChars: number;
  reflectionQuestionText: string;
  reflectionMinChars: number;
  themeColorPrimary: string;
  themeColorSecondary: string;
  narration: NarrationData;
  imagePrompt: string;
  pedagogicalReview: PedagogicalReview;
}

export type Competencies = { [key: string]: number };

export interface StudentState {
  completed_items: string[];
  competencies: Competencies;
  overall_progress: number;
  momentum: number;
  last_active: string;
  ai_insight?: string;
}

export interface CPanelSettings {
  domain: string;
  apiToken: string;
  username: string;
  port: string;
  remotePath: string;
}

export interface GuideIdea {
  id: string;
  title: string;
  icon: string;
  description: string;
  category: 'Tech' | 'Business' | 'Soft Skills' | 'Creative' | 'Trending';
  isTrend?: boolean;
}
