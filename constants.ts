import { AssignmentData } from './types';

export const INITIAL_DATA: AssignmentData = {
  courseName: "מדריך: ניהול מערכות מידע",
  lecturerName: "LearningHub Team",
  semester: "עדכון 2025",
  title: "פרק 3: הטמעת מערכת CRM",
  timeEstimate: "30-40 דקות",
  dueDate: "ללא הגבלה",
  weight: "יישום מעשי",
  
  // New Context Data
  topic: "ניהול שינויים טכנולוגיים",
  contextDescription: "פרק זה במדריך מתבסס על היסודות שלמדנו בפרק הקודם בנושא 'התנגדויות לשינוי', ומהווה יישום מעשי של המודלים.",
  prerequisite: "קריאת פרק 2: מבוא למערכות CRM",
  lessonNumber: 3,
  totalLessons: 8,

  // Flashcards
  flashcards: [
    { term: "CRM", definition: "Customer Relationship Management - מערכת לניהול קשרי לקוחות ושיפור השירות." },
    { term: "Change Management", definition: "גישה מובנית להעברת יחידים וארגונים ממצב נוכחי למצב עתידי רצוי." },
    { term: "KPI", definition: "מדדי ביצוע מרכזיים המשמשים למדידת הצלחת ההטמעה." },
    { term: "Pilot", definition: "הפעלה ניסיונית של המערכת בקבוצה מצומצמת לפני הפצה רחבה." }
  ],

  welcomeTitle: "👋 ברוכים הבאים למדריך!",
  welcomeText: "בפרק זה תתנסו בתהליך מציאותי של הטמעת מערכת CRM בארגון בינוני. המטרה היא לגשר בין התיאוריה לפרקטיקה באמצעות סימולציה מעשית.",
  objectives: [
    "להבין את האתגרים בהטמעת כלי עבודה חדש",
    "לזהות גורמי הצלחה וכישלון בפרויקטים",
    "לנתח נתונים ולקבל החלטות מבוססות",
    "לפתח תכנית פעולה מעשית להטמעה"
  ],
  
  caseStudyTitle: "📋 מקרה בוחן: חברת טכנו-מכירות בע״מ",
  caseStudyContent: "<p><strong>חברת \"טכנו-מכירות בע״מ\"</strong> היא חברה המתמחה במכירת ציוד טכנולוגי. בחברה 120 עובדים.</p><p>כיום החברה משתמשת בקבצי אקסל מפוזרים. ההנהלה החליטה לעבור למערכת CRM מקצועית.</p><p><strong>אתגרים מרכזיים:</strong><br/>• מידע לא מסונכרן<br/>• עובדים חוששים מהשינוי<br/>• צורך בהדרכה מהירה</p>",
  
  questions: [
    {
      id: "q1",
      text: "מהו המניע העסקי המרכזי למעבר למערכת החדשה?",
      options: [
        { id: "q1a", text: "חיסכון בנייר", isCorrect: false },
        { id: "q1b", text: "לחץ טכנולוגי", isCorrect: false },
        { id: "q1c", text: "שיפור השירות וריכוז המידע", isCorrect: true },
        { id: "q1d", text: "דרישת הרגולטור", isCorrect: false }
      ]
    },
    {
      id: "q2",
      text: "מי צפוי להביע את ההתנגדות הגדולה ביותר?",
      options: [
        { id: "q2a", text: "מחלקת כספים", isCorrect: false },
        { id: "q2b", text: "אנשי המכירות הוותיקים", isCorrect: true },
        { id: "q2c", text: "עובדים חדשים", isCorrect: false },
        { id: "q2d", text: "הנהלה בכירה", isCorrect: false }
      ]
    }
  ],
  
  analysisTitle: "ניתוח מוכנות ארגונית",
  analysisDescription: "בוצע סקר מוכנות בקרב העובדים לקראת השינוי. להלן התוצאות:",
  chartTitle: "מדד מוכנות לשינוי (1-10)",
  chartData: [
    { label: "הנהלה", value: 9.0 },
    { label: "מכירות", value: 4.0 },
    { label: "IT", value: 8.0 },
    { label: "שירות", value: 6.0 }
  ],
  analysisQuestionText: "הסבר מדוע לדעתך קיימת פער במוכנות בין מחלקת ה-IT למחלקת המכירות:",
  analysisMinChars: 50,
  
  planTitle: "בניית תוכנית עבודה",
  planDescription: "סדר את שלבי ההטמעה בסדר הלוגי הנכון (גרור ושחרר):",
  planItems: [
    "🎓 הדרכות צוותיות",
    "🧪 הרצת פיילוט",
    "⭐ אפיון צרכים",
    "📢 קמפיין שיווק פנימי",
    "📦 מיגרציית נתונים",
    "🆘 עלייה לאוויר ותמיכה"
  ],
  planQuestionText: "נמק את הבחירה שלך בשלב הראשון בתוכנית:",
  planMinChars: 60,
  
  reflectionQuestionText: "מהי התובנה המרכזית שלך מפרק זה שתיקח לפרויקט הבא?",
  reflectionMinChars: 40,
  
  themeColorPrimary: "#667eea",
  themeColorSecondary: "#764ba2"
};