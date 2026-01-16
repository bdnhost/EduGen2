
import { GoogleGenAI, Type } from "@google/genai";
import { AssignmentData, SyllabusItem, StudentState, GuideIdea } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Discover trending guide ideas using Google Search grounding.
 * This function specifically looks for the "Next Big Things" in education and technology.
 */
export const fetchTrendingIdeas = async (): Promise<GuideIdea[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `חפש את הטרנדים הלימודיים והטכנולוגיים החמים ביותר לשבוע הנוכחי (פברואר 2025). 
      מצא 6 נושאים חדשניים שמתאימים למדריכי למידה אינטראקטיביים. 
      עבור כל נושא, צור: כותרת מושכת, תיאור קצר בעברית, ואייקון אמוג'י מתאים.
      החזר מערך JSON בלבד.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              icon: { type: Type.STRING },
              description: { type: Type.STRING },
              category: { type: Type.STRING }
            },
            required: ["id", "title", "icon", "description"]
          }
        }
      },
    });

    const trends = JSON.parse(response.text || "[]");
    return trends.map((t: any, idx: number) => ({
      ...t,
      id: `trend-${idx}-${Date.now()}`,
      category: 'Trending',
      isTrend: true
    }));
  } catch (error) {
    console.error("Trend discovery failed:", error);
    return [];
  }
};

export const generateStudentInsight = async (state: StudentState, courseName: string): Promise<string> => {
  try {
    const prompt = `
      As an expert pedagogical AI, analyze the following student's progress in the course "${courseName}":
      - Progress: ${state.overall_progress}%
      - Momentum: ${state.momentum}/100
      
      Provide a 1-sentence supportive insight in Hebrew that encourages them and suggests what to focus on. 
    `;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    
    return response.text?.trim() || "ממשיכים במסע הלמידה בכל הכוח!";
  } catch (error) {
    return "כל הכבוד על ההתקדמות!";
  }
};

export const generateSyllabus = async (guideTopic: string): Promise<{ syllabus: SyllabusItem[], englishTitle: string }> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Create a professional pedagogical syllabus for a course named: "${guideTopic}" in Hebrew. 
      Ensure a logical progression of skills using Bloom's Taxonomy. 5 chapters. 
      Return JSON with 'englishTitle' (sanitized for URL) and 'syllabus' array.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            englishTitle: { type: Type.STRING },
            syllabus: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  topic: { type: Type.STRING },
                  lessonNumber: { type: Type.INTEGER },
                  description: { type: Type.STRING }
                },
                required: ["id", "title", "topic", "lessonNumber", "description"]
              }
            }
          }
        }
      }
    });
    const result = JSON.parse(response.text || "{}");
    return {
      syllabus: (result.syllabus || []).map((s: any) => ({ ...s, id: `chapter-${s.lessonNumber}` })),
      englishTitle: result.englishTitle || "My-Guide"
    };
  } catch (error) {
    console.error("Syllabus error:", error);
    return { syllabus: [], englishTitle: "Error-Guide" };
  }
};

export const generateAssignmentFromTopic = async (topic: string, courseName: string, lessonNumber: number, totalLessons: number): Promise<AssignmentData> => {
  const prompt = `
    Create an interactive educational HTML assignment in HEBREW for Chapter ${lessonNumber} of "${courseName}".
    Topic: "${topic}".
    Total chapters: ${totalLessons}.
    
    REQUIREMENTS:
    - Language: Hebrew only.
    - Style: Professional, encouraging.
    - Pedagogical: Use Bloom's Taxonomy, Scaffolding.
    - Narration: Include emotional cues like [excited], [thoughtful].
    
    Return valid JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            courseName: { type: Type.STRING },
            lecturerName: { type: Type.STRING },
            semester: { type: Type.STRING },
            title: { type: Type.STRING },
            timeEstimate: { type: Type.STRING },
            dueDate: { type: Type.STRING },
            weight: { type: Type.STRING },
            topic: { type: Type.STRING },
            contextDescription: { type: Type.STRING },
            prerequisite: { type: Type.STRING },
            lessonNumber: { type: Type.INTEGER },
            totalLessons: { type: Type.INTEGER },
            nextLessonTeaser: { type: Type.STRING },
            flashcards: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT, properties: { term: { type: Type.STRING }, definition: { type: Type.STRING } }
              }
            },
            welcomeTitle: { type: Type.STRING },
            welcomeText: { type: Type.STRING },
            objectives: { type: Type.ARRAY, items: { type: Type.STRING } },
            caseStudyTitle: { type: Type.STRING },
            caseStudyContent: { type: Type.STRING },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  text: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: { id: { type: Type.STRING }, text: { type: Type.STRING }, isCorrect: { type: Type.BOOLEAN } }
                    }
                  }
                }
              }
            },
            analysisTitle: { type: Type.STRING },
            analysisDescription: { type: Type.STRING },
            chartTitle: { type: Type.STRING },
            chartData: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT, properties: { label: { type: Type.STRING }, value: { type: Type.NUMBER } }
              }
            },
            analysisQuestionText: { type: Type.STRING },
            analysisMinChars: { type: Type.INTEGER },
            planTitle: { type: Type.STRING },
            planDescription: { type: Type.STRING },
            planItems: { type: Type.ARRAY, items: { type: Type.STRING } },
            planQuestionText: { type: Type.STRING },
            planMinChars: { type: Type.INTEGER },
            reflectionQuestionText: { type: Type.STRING },
            reflectionMinChars: { type: Type.INTEGER },
            themeColorPrimary: { type: Type.STRING },
            themeColorSecondary: { type: Type.STRING },
            imagePrompt: { type: Type.STRING },
            narration: {
              type: Type.OBJECT,
              properties: {
                welcome: { type: Type.OBJECT, properties: { fileName: { type: Type.STRING }, script: { type: Type.STRING } } },
                caseStudy: { type: Type.OBJECT, properties: { fileName: { type: Type.STRING }, script: { type: Type.STRING } } },
                summary: { type: Type.OBJECT, properties: { fileName: { type: Type.STRING }, script: { type: Type.STRING } } }
              }
            },
            pedagogicalReview: {
              type: Type.OBJECT,
              properties: {
                bloomLevel: { type: Type.STRING },
                scaffoldingScore: { type: Type.NUMBER },
                engagementStrategy: { type: Type.STRING },
                instructionalRationale: { type: Type.STRING },
                suggestedImprovement: { type: Type.STRING }
              }
            }
          }
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    data.totalLessons = totalLessons;
    data.lessonNumber = lessonNumber;
    data.narration.welcome.fileName = `audio_ch${lessonNumber}_welcome.mp3`;
    data.narration.caseStudy.fileName = `audio_ch${lessonNumber}_case.mp3`;
    data.narration.summary.fileName = `audio_ch${lessonNumber}_summary.mp3`;
    
    ['welcome', 'caseStudy', 'summary'].forEach((part) => {
      data.narration[part].stability = 0.5;
      data.narration[part].similarity_boost = 0.8;
      data.narration[part].model_id = "eleven_v3";
    });

    data.questions = data.questions.map((q: any, i: number) => ({
        ...q,
        id: `q${i}`,
        options: q.options.map((o: any, j: number) => ({ ...o, id: `q${i}_o${j}` }))
    }));
    return data;
  } catch (error) {
    console.error("Content generation error:", error);
    throw error;
  }
};
