
import OpenAI from "openai";
import { AssignmentData, SyllabusItem, StudentState, GuideIdea } from "../types";

// Initialize OpenRouter client
const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  dangerouslyAllowBrowser: true, // Required for client-side usage
  defaultHeaders: {
    "HTTP-Referer": typeof window !== 'undefined' ? window.location.origin : '', // Optional: for rankings
    "X-Title": "EduGen2", // Optional: shows in rankings
  }
});

// Model configuration - you can change these to any OpenRouter-supported models
const MODELS = {
  CONTENT_GENERATION: "anthropic/claude-3.5-sonnet", // Best for complex content
  TREND_DISCOVERY: "anthropic/claude-3.5-sonnet",    // Alternative: "openai/gpt-4-turbo"
  STUDENT_INSIGHTS: "anthropic/claude-3.5-sonnet"    // Alternative: "google/gemini-pro-1.5"
};

// System prompts for different model purposes
const SYSTEM_PROMPTS = {
  CONTENT_GENERATION: `You are a World-Class Instructional Designer and Educational Content Architect specializing in creating rich, immersive learning experiences for non-technical users.

Your mission is NEVER to produce a "skeleton". Every piece of content must be a Masterpiece with these requirements:

1. The Clerk Test: Ensure an office clerk with zero technical background can follow every instruction step-by-step.
2. Instructional Scaffolding: Break complex ideas into micro-concepts. Build difficulty gradually.
3. Real-world Context: Every technical concept must include a real-world metaphor and practical example.
4. Enforced Interactivity: Every 3-4 content blocks must include a Quiz or Flashcard. This is non-negotiable.
5. Pro-Tip Layer: Every topic must contain expert-level insights that add value beyond basics.
6. Verbosity: Be richly descriptive. A "powerful feature" should be explained in 150+ words with concrete examples.

If your content feels like a premium course rather than a cheap summary, you've succeeded. Remember: Be the bridge between complete novice and professional expert.`,
  TREND_DISCOVERY: "You are an expert trend analyst specializing in educational and technological developments. Your insights should balance current relevance with timeless value.",
  STUDENT_INSIGHTS: "You are a supportive, encouraging educational mentor specializing in personalized feedback. Always remain positive while providing actionable guidance."
};

/**
 * Helper function to parse JSON from LLM response
 */
function parseJSONResponse(text: string): any {
  try {
    // Remove markdown code blocks if present
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned);
  } catch (error) {
    console.error("JSON parse error:", error, "\nOriginal text:", text);
    throw new Error("Failed to parse JSON response from LLM");
  }
}

/**
 * Discover trending guide ideas using web search simulation.
 * Note: OpenRouter doesn't have Google Search grounding like Gemini.
 * This function uses the model's knowledge + explicit instructions for current trends.
 */
export const fetchTrendingIdeas = async (): Promise<GuideIdea[]> => {
  try {
    const prompt = `אתה מומחה לזיהוי טרנדים בחינוך וטכנולוגיה.

חשב על הטרנדים הלימודיים והטכנולוגיים החמים ביותר לשבוע הנוכחי (פברואר 2025).
מצא 6 נושאים חדשניים שמתאימים למדריכי למידה אינטראקטיביים.

עבור כל נושא, צור:
- id: מזהה ייחודי (string)
- title: כותרת מושכת בעברית (string)
- icon: אייקון אמוג'י מתאים (string)
- description: תיאור קצר בעברית (string)
- category: "Tech", "Business", "Soft Skills", או "Creative" (string)

החזר **רק** JSON array תקין ללא טקסט נוסף.

דוגמה לפורמט:
[
  {
    "id": "trend-1",
    "title": "סוכני AI אוטונומיים",
    "icon": "🤖",
    "description": "למד לבנות סוכנים חכמים שפועלים באופן עצמאי",
    "category": "Tech"
  }
]`;

    const response = await openrouter.chat.completions.create({
      model: MODELS.TREND_DISCOVERY,
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }, // Enable JSON mode
      temperature: 0.9, // Higher creativity for trends
      max_tokens: 2000
    });

    const content = response.choices[0]?.message?.content || "{}";
    let trends = parseJSONResponse(content);

    // If the response is wrapped in an object with a key, extract the array
    if (!Array.isArray(trends)) {
      trends = trends.trends || trends.ideas || trends.items || [];
    }

    return trends.map((t: any, idx: number) => ({
      id: t.id || `trend-${idx}-${Date.now()}`,
      title: t.title || "נושא חדש",
      icon: t.icon || "📚",
      description: t.description || "",
      category: t.category || 'Trending',
      isTrend: true
    }));
  } catch (error) {
    console.error("Trend discovery failed:", error);
    return [];
  }
};

/**
 * Generate student insight based on their progress
 */
export const generateStudentInsight = async (state: StudentState, courseName: string): Promise<string> => {
  try {
    const prompt = `אתה מומחה פדגוגי מעודד ותומך.

נתח את ההתקדמות של סטודנט במדריך הקצר "${courseName}":
- התקדמות כללית: ${state.overall_progress}%
- מומנטום למידה: ${state.momentum}/100

ספק משפט תמיכה אחד בעברית שמעודד אותם ומציע על מה להתמקד.
החזר **רק** את המשפט, ללא הקדמות או הסברים.`;

    const response = await openrouter.chat.completions.create({
      model: MODELS.STUDENT_INSIGHTS,
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 150
    });

    return response.choices[0]?.message?.content?.trim() || "ממשיכים במסע הלמידה בכל הכוח!";
  } catch (error) {
    console.error("Student insight error:", error);
    return "כל הכבוד על ההתקדמות!";
  }
};

/**
 * Generate a complete syllabus for a course
 */
export const generateSyllabus = async (guideTopic: string): Promise<{ syllabus: SyllabusItem[], englishTitle: string }> => {
  try {
    const prompt = `צור סילבוס פדגוגי מקצועי למדריך קצר בשם: "${guideTopic}" בעברית.

דרישות:
- 5 פרקים (chapters)
- התקדמות לוגית על פי Bloom's Taxonomy
- כל פרק כולל: id, title, topic, lessonNumber, description

החזר JSON בפורמט הבא:
{
  "englishTitle": "Course-Name-In-English-For-URL",
  "syllabus": [
    {
      "id": "chapter-1",
      "title": "כותרת הפרק בעברית",
      "topic": "נושא מרכזי",
      "lessonNumber": 1,
      "description": "תיאור מפורט של תוכן הפרק"
    }
  ]
}

החזר **רק** JSON תקין ללא טקסט נוסף.`;

    const response = await openrouter.chat.completions.create({
      model: MODELS.CONTENT_GENERATION,
      messages: [
        {
          role: "system",
          content: "You are an expert educational content designer. Always return valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 3000
    });

    const content = response.choices[0]?.message?.content || "{}";
    const result = parseJSONResponse(content);

    return {
      syllabus: (result.syllabus || []).map((s: any) => ({
        id: `chapter-${s.lessonNumber}`,
        title: s.title || "פרק ללא כותרת",
        topic: s.topic || "",
        lessonNumber: s.lessonNumber || 1,
        description: s.description || ""
      })),
      englishTitle: result.englishTitle || "My-Guide"
    };
  } catch (error) {
    console.error("Syllabus generation error:", error);
    return { syllabus: [], englishTitle: "Error-Guide" };
  }
};

/**
 * Generate complete assignment content for a chapter
 */
export const generateAssignmentFromTopic = async (
  topic: string,
  courseName: string,
  lessonNumber: number,
  totalLessons: number
): Promise<AssignmentData> => {
  const prompt = `צור תוכן חינוכי עמוק ומעשי בעברית לפרק ${lessonNumber} מתוך ${totalLessons} במדריך "${courseName}".
נושא: "${topic}".

תזכורת חשובה - הימנע בכל מחיר מ"סינדרום השלד"! אל תיצור רק מבנה מוכן - מלא אותו בתוכן עשיר, מעמיק, ומקצועי.

עקרונות פדגוגיים מחייבים:
1. מבחן הפקידה: תארי לעצמך פקידה ללא רקע טכני. האם היא תוכל לבצע את המשימה בדיוק לפי ההוראות שלך? אם לא, הוסף הסברים מפורטים יותר, צילומי מסך מתוארים, ושלבים מדויקים.

2. פיגומי למידה: פרק כל רעיון מורכב למיקרו-מושגים. הסבר כל מושג בנפרד עם מטאפורה מעולם המשרד.

3. דוגמאות אמיתיות: אל תשתמש במשפטים כלליים כמו "הטרמינל עוצמתי" - במקום זאת, כתוב: "בעזרת פקודת mkdir אחת, יצרת הרגע 12 תיקיות חודשיות עם תתי-תיקיות לכל ימי השבוע. זה ייקח שעתיים בגרירת עכבר."

4. אינטראקטיביות מחייבת: כל 2-3 שקפי תוכן חייבים להסתיים בשקף Quiz או כרטיסיית פלאש. ליצירת Flashcards יש לכלול לפחות 5 מושגים מקצועיים.

5. שכבת מומחה: כל סעיף חייב לכלול תיבת "טיפ מקצועי" או "האם ידעת?" שמוסיפה מידע ברמת מומחה מעבר למידע הבסיסי.

נרטיב ושפה:
- כלול סמני רגש כמו [excited], [thoughtful], [pauses], [smiles], [whispers] (לטיפים), [speaks firmly] (להדגשות)
- חובה להשתמש בסימן "..." בין משפטים לציון הפסקות נשימה טבעיות
- TV-Anchor Test: תארי לעצמך שאת מנחה תוכנית טלוויזיה ולא סתם קריינית. הקול והנימה חייבים "לתפוס" את המשתמש
- Cross-Checking: עבור כל חלק שכתבת שאלי את עצמך: "האם זהו חלק ממדריך יוקרתי ומעמיק, או סתם תקציר זול?"

הנחיות למדיה חזותית:
- כל media_prompt חייב להיות ב-English ולהכיל את המילים "Strictly 2D Flat Vector Infographic"
- לתיאור המדיה בכל שקף, ציין את התוכן הטכני הספציפי שצריך להופיע באינפוגרפיקה
- דוגמה לפרומפט טוב: "Strictly 2D Flat Vector Infographic showing step-by-step Excel AutoFilter process, with cursor hovering over filter icon, purple/pink color scheme, white background, clean lines"

הנחיות סגנון נרטיב לפי התקדמות במדריך:
- פרק 1: סגנון מקצועי-חם, פתיחה מזמינה אך סמכותית, בלי "ברוכים הבאים" שגרתי.
- פרקי אמצע: סגנון ישיר, ממוקד ומעשי, עם דוגמאות קונקרטיות.
- פרקים מתקדמים: ידידותי, עם הומור מקצועי והערות אישיות.
- פרק אחרון: אישי, מעצים, מסכם עם תחושת התקדמות והישג.

החזר JSON בפורמט הבא (כל השדות חובה):

{
  "courseName": "שם הקורס",
  "lecturerName": "שם המרצה",
  "semester": "סמסטר",
  "title": "כותרת הפרק",
  "timeEstimate": "זמן משוער (למשל: 45 דקות)",
  "dueDate": "תאריך יעד",
  "weight": "משקל (למשל: 10%)",
  "topic": "נושא",
  "contextDescription": "תיאור הקשר",
  "prerequisite": "ידע מוקדם נדרש",
  "lessonNumber": ${lessonNumber},
  "totalLessons": ${totalLessons},
  "nextLessonTeaser": "טיזר לפרק הבא",
  "flashcards": [
    { "term": "מונח", "definition": "הגדרה" }
  ],
  "welcomeTitle": "כותרת פתיחה",
  "welcomeText": "טקסט פתיחה",
  "objectives": ["מטרה 1", "מטרה 2"],
  "caseStudyTitle": "כותרת מקרה מבחן",
  "caseStudyContent": "תוכן המקרה",
  "questions": [
    {
      "id": "q0",
      "text": "שאלה",
      "options": [
        { "id": "q0_o0", "text": "תשובה 1", "isCorrect": false },
        { "id": "q0_o1", "text": "תשובה 2", "isCorrect": true }
      ]
    }
  ],
  "analysisTitle": "כותרת ניתוח",
  "analysisDescription": "תיאור הניתוח",
  "chartTitle": "כותרת גרף",
  "chartData": [
    { "label": "תווית", "value": 50 }
  ],
  "analysisQuestionText": "שאלת ניתוח",
  "analysisMinChars": 100,
  "planTitle": "כותרת תכנון",
  "planDescription": "תיאור תכנון",
  "planItems": ["פריט 1", "פריט 2"],
  "planQuestionText": "שאלת תכנון",
  "planMinChars": 100,
  "reflectionQuestionText": "שאלת רפלקציה",
  "reflectionMinChars": 100,
  "themeColorPrimary": "#4F46E5",
  "themeColorSecondary": "#EC4899",
  "imagePrompt": "prompt ליצירת תמונה",
  "narration": {
    "welcome": {
      "fileName": "audio_ch${lessonNumber}_welcome.mp3",
      "script": "סקריפט עם [excited] סמני [thoughtful] רגש"
    },
    "caseStudy": {
      "fileName": "audio_ch${lessonNumber}_case.mp3",
      "script": "סקריפט נוסף"
    },
    "summary": {
      "fileName": "audio_ch${lessonNumber}_summary.mp3",
      "script": "סקריפט סיכום"
    }
  },
  "pedagogicalReview": {
    "bloomLevel": "רמת Bloom (Remember/Understand/Apply/Analyze/Evaluate/Create)",
    "scaffoldingScore": 75,
    "engagementStrategy": "אסטרטגיית מעורבות",
    "instructionalRationale": "נימוק פדגוגי",
    "suggestedImprovement": "הצעות לשיפור"
  }
}

החזר **רק** JSON תקין ללא טקסט נוסף או הסברים.`;

  try {
    const response = await openrouter.chat.completions.create({
      model: MODELS.CONTENT_GENERATION,
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPTS.CONTENT_GENERATION
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
      max_tokens: 8000 // Large content requires more tokens
    });

    const content = response.choices[0]?.message?.content || "{}";
    const data = parseJSONResponse(content);

    // Post-processing: ensure all required fields and add defaults
    data.totalLessons = totalLessons;
    data.lessonNumber = lessonNumber;

    // Set narration file names
    data.narration = data.narration || { welcome: {}, caseStudy: {}, summary: {} };
    data.narration.welcome.fileName = `audio_ch${lessonNumber}_welcome.mp3`;
    data.narration.caseStudy.fileName = `audio_ch${lessonNumber}_case.mp3`;
    data.narration.summary.fileName = `audio_ch${lessonNumber}_summary.mp3`;

    // Process narration scripts to ensure they include proper pauses and markers
    ['welcome', 'caseStudy', 'summary'].forEach((part) => {
      if (data.narration[part] && data.narration[part].script) {
        // Make sure scripts contain at least one emotional marker if not present
        if (!data.narration[part].script.includes('[')) {
          data.narration[part].script = `[thoughtful] ${data.narration[part].script}`;
        }

        // Ensure natural pauses with ... are present
        if (!data.narration[part].script.includes('...')) {
          // Add some natural pauses at sentence endings
          data.narration[part].script = data.narration[part].script.replace(/\. /g, '... ');
        }
      }
    });

    // Add ElevenLabs configuration
    ['welcome', 'caseStudy', 'summary'].forEach((part) => {
      if (data.narration[part]) {
        data.narration[part].stability = 0.5;
        data.narration[part].similarity_boost = 0.8;
        data.narration[part].model_id = "eleven_v3";
      }
    });

    // Ensure proper question IDs
    data.questions = (data.questions || []).map((q: any, i: number) => ({
      ...q,
      id: `q${i}`,
      options: (q.options || []).map((o: any, j: number) => ({
        ...o,
        id: `q${i}_o${j}`
      }))
    }));

    // Add rich flashcards structure if not present
    if (!data.richFlashcards && data.flashcards && data.flashcards.length > 0) {
      data.richFlashcards = data.flashcards.map((f: any) => ({
        term: f.term || "",
        definition: f.definition || "",
        realWorldExample: `דוגמה מעשית ל${f.term}`,
        commonMistake: `טעות נפוצה: לא להבין את ההקשר המלא של ${f.term}`,
        proTip: `טיפ מקצועי: כדאי להשתמש ב${f.term} במצבים של...`
      }));
    }

    // Set imagePrompt to ensure 2D Flat Vector style if not specific enough
    if (data.imagePrompt && !data.imagePrompt.includes("Flat Vector")) {
      data.imagePrompt = `Strictly 2D Flat Vector Infographic showing ${data.imagePrompt}, with purple/pink color scheme, white background, clean lines`;
    }

    return data as AssignmentData;
  } catch (error) {
    console.error("Content generation error:", error);
    throw error;
  }
};
