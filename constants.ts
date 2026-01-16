
import { AssignmentData, GuideIdea } from './types';

export const GUIDE_IDEAS: GuideIdea[] = [
  // --- Tech & AI ---
  { id: 't1', title: 'סוכני AI (AI Agents)', icon: '🤖', category: 'Tech', description: 'איך לבנות צוות סוכנים אוטונומיים לייעול העסק.' },
  { id: 't2', title: 'אבטחת מידע ב-Cloud 2025', icon: '☁️', category: 'Tech', description: 'הגנה על נכסים דיגיטליים בסביבות Azure ו-AWS.' },
  { id: 't3', title: 'פיתוח Fullstack עם Cursor', icon: '💻', category: 'Tech', description: 'בניית אפליקציות במהירות שיא בעזרת עורך הקוד מבוסס ה-AI.' },
  { id: 't4', title: 'מבוא למחשוב קוונטי', icon: '⚛️', category: 'Tech', description: 'מושגי יסוד בעולם המחשוב של העתיד.' },
  { id: 't5', title: 'אופטימיזציה של Prompt Engineering', icon: '🧠', category: 'Tech', description: 'טכניקות מתקדמות להפקת המקסימום ממודלי שפה.' },
  { id: 't6', title: 'ניהול נתונים ב-SQL & AI', icon: '💾', category: 'Tech', description: 'שילוב שאילתות חכמות עם ניתוח נתונים אוטומטי.' },
  
  // --- Business & Strategy ---
  { id: 'b1', title: 'אסטרטגיית Go-to-Market', icon: '📈', category: 'Business', description: 'איך להשיק מוצר חדש בשוק תחרותי.' },
  { id: 'b2', title: 'ניהול פיננסי לסטארט-אפים', icon: '💸', category: 'Business', description: 'תכנון תזרים מזומנים, גיוס הון וניהול תקציב.' },
  { id: 'b3', title: 'שיווק משפיענים מבוסס דאטה', icon: '📱', category: 'Business', description: 'בחירת משפיענים ומדידת ROI בצורה מדעית.' },
  { id: 'b4', title: 'מכירות B2B בעידן הדיגיטלי', icon: '🤝', category: 'Business', description: 'סגירת עסקאות גדולות באמצעות LinkedIn וכלים חכמים.' },
  { id: 'b5', title: 'כלכלה מעגלית וקיימות בעסקים', icon: '🌍', category: 'Business', description: 'מעבר למודלים עסקיים ירוקים ורווחיים.' },
  
  // --- Soft Skills & Personal Growth ---
  { id: 's1', title: 'חוסן מנטלי במצבי לחץ', icon: '🧘', category: 'Soft Skills', description: 'כלים פסיכולוגיים לשמירה על יציבות בעולם משתנה.' },
  { id: 's2', title: 'ניהול זמן בשיטת ה-Quadrant', icon: '⏱️', category: 'Soft Skills', description: 'תעדוף משימות חכם למניעת שחיקה.' },
  { id: 's3', title: 'תקשורת בין-אישית בצוותים מבוזרים', icon: '🌐', category: 'Soft Skills', description: 'איך לבנות אמון כשעובדים מרחוק.' },
  { id: 's4', title: 'מנהיגות משרתת (Servant Leadership)', icon: '👑', category: 'Soft Skills', description: 'גישה ניהולית ששמה את העובד במרכז.' },
  { id: 's5', title: 'חשיבה ביקורתית בעידן ה-Fake News', icon: '🔍', category: 'Soft Skills', description: 'ניתוח מקורות מידע וקבלת החלטות מושכלת.' },

  // --- Creative & Design ---
  { id: 'c1', title: 'עיצוב חווית משתמש (UX) ב-VR', icon: '👓', category: 'Creative', description: 'תכנון ממשקים לעולמות המציאות המדומה.' },
  { id: 'c2', title: 'כתיבה יוצרת עם שותף AI', icon: '✍️', category: 'Creative', description: 'שילוב דמיון אנושי עם יכולות הניסוח של המכונה.' },
  { id: 'c3', title: 'צילום ועריכה בסמארטפון', icon: '📸', category: 'Creative', description: 'הפקת סרטונים מקצועיים ללא ציוד יקר.' },
  { id: 'c4', title: 'מיתוג אישי ב-Threads ו-X', icon: '🐦', category: 'Creative', description: 'בניית קהילה ונוכחות דיגיטלית משפיעה.' },
  { id: 'c5', title: 'עיצוב בר-קיימא (Eco-Design)', icon: '🌱', category: 'Creative', description: 'שימוש בחומרים ותהליכים ידידותיים לסביבה בעיצוב מוצר.' }
];

export const INITIAL_DATA: AssignmentData = {
  courseName: "מדריך: מיומנויות העתיד 2025",
  lecturerName: "EduGen Expert Team",
  semester: "סמסטר א' 2025",
  title: "מבוא למערכות אוטונומיות",
  timeEstimate: "45 דקות",
  dueDate: "גמיש",
  weight: "פרק יסוד",
  topic: "בינה מלאכותית יוצרת",
  contextDescription: "פרק זה סוקר את המעבר מ-AI סטטי למערכות הפועלות באופן עצמאי.",
  prerequisite: "היכרות בסיסית עם ChatGPT",
  lessonNumber: 1,
  totalLessons: 5,
  flashcards: [
    { term: "Agentic AI", definition: "מערכת בינה מלאכותית המסוגלת לבצע משימות מורכבות באופן עצמאי ללא התערבות אנושית רציפה." },
    { term: "Reasoning", definition: "יכולת המודל 'לחשוב' בשלבים לפני מתן תשובה סופית." }
  ],
  welcomeTitle: "ברוכים הבאים לעתיד 🚀",
  welcomeText: "היום נלמד איך המכונות מתחילות לקבל החלטות עבורנו.",
  objectives: ["הבנת מושג ה-Agency", "ניתוח מקרי בוחן של אוטומציה", "התנסות ראשונית בתכנון סוכן"],
  caseStudyTitle: "המקרה של חברת לוגיסטיק-בוט",
  caseStudyContent: "<p>חברת לוגיסטיקה הטמיעה סוכן AI לניהול מחסן. מה קרה כשהסוכן זיהה מחסור במלאי?</p>",
  questions: [
    {
      id: "q1",
      text: "מהו היתרון המרכזי של סוכן אוטונומי על פני בוט רגיל?",
      options: [
        { id: "o1", text: "יכולת קבלת החלטות עצמאית", isCorrect: true },
        { id: "o2", text: "מהירות תגובה בלבד", isCorrect: false }
      ]
    }
  ],
  analysisTitle: "ניתוח יעילות",
  analysisDescription: "גרף המציג את הירידה בטעויות אנוש לאחר הטמעת הסוכן.",
  chartTitle: "אחוז טעויות לאורך זמן",
  chartData: [{ label: "לפני", value: 8 }, { label: "אחרי", value: 1.5 }],
  analysisQuestionText: "הסבר את הגורם לירידה בטעויות:",
  analysisMinChars: 30,
  planTitle: "תכנון סוכן ראשון",
  planDescription: "סדר את שלבי התכנון:",
  planItems: ["הגדרת מטרה", "בחירת מודל", "בדיקת בטיחות"],
  planQuestionText: "למה בטיחות היא השלב הקריטי ביותר?",
  planMinChars: 40,
  reflectionQuestionText: "איך סוכן AI יכול לעזור לך בעבודה היומיומית?",
  reflectionMinChars: 20,
  themeColorPrimary: "#4f46e5",
  themeColorSecondary: "#818cf8",
  imagePrompt: "A futuristic office where robots and humans collaborate, minimalist blue aesthetic.",
  narration: {
    welcome: { fileName: "audio_ch1_welcome.mp3", script: "שלום לכם. בפרק הזה נצלול לעומק עולם הסוכנים האוטונומיים." },
    caseStudy: { fileName: "audio_ch1_case.mp3", script: "בואו ננתח את המקרה של לוגיסטיק-בוט." },
    summary: { fileName: "audio_ch1_summary.mp3", script: "עבודה מצוינת. סיימתם את המבוא." }
  },
  pedagogicalReview: {
    bloomLevel: 'Analyze',
    scaffoldingScore: 92,
    engagementStrategy: "Active problem solving via case study",
    instructionalRationale: "Moving from theory to practical analysis using real-world logistics examples.",
    suggestedImprovement: "Add more branching scenarios to the case study."
  }
};
