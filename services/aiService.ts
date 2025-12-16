import { GoogleGenAI, Type } from "@google/genai";
import { AssignmentData, SyllabusItem } from "../types";
import { INITIAL_DATA } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `You are an expert educational content creator in Hebrew. 
Your goal is to generate a comprehensive, interactive HTML "Guide Chapter" (JSON structure) based on a user-provided topic.
The output must be valid JSON matching the specific schema provided.
The content must be in Hebrew, clear, practical, and engaging (Guide style, not strict academic course style).
Ensure logical consistency between the Case Study, the Questions, and the Action Plan.
CRITICAL: Include 4-6 "Flashcards" for key concepts related to the topic.`;

export const generateSyllabus = async (guideTopic: string): Promise<{ syllabus: SyllabusItem[], englishTitle: string }> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Create a table of contents for a comprehensive Guide named: "${guideTopic}". 
      The guide should have 5 progressive chapters.
      Return a JSON object containing:
      1. 'englishTitle': A concise English translation of the guide topic (for folders).
      2. 'syllabus': The array of chapters.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            englishTitle: { type: Type.STRING, description: "English translation of guide title" },
            syllabus: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING, description: "Chapter Title" },
                  topic: { type: Type.STRING, description: "Specific sub-topic" },
                  lessonNumber: { type: Type.INTEGER, description: "Chapter Number" },
                  description: { type: Type.STRING, description: "Short summary in Hebrew" }
                }
              }
            }
          }
        }
      }
    });

    if (response.text) {
      const result = JSON.parse(response.text);
      return {
          syllabus: result.syllabus as SyllabusItem[],
          englishTitle: result.englishTitle || "Guide"
      };
    }
    return { syllabus: [], englishTitle: "Guide" };
  } catch (error) {
    console.error("Syllabus Generation Error:", error);
    return { syllabus: [], englishTitle: "Error-Guide" };
  }
};

interface GenerationContext {
  courseName?: string;
  lessonNumber?: number;
  totalLessons?: number;
  previousTopic?: string;
  nextTopic?: string;
}

export const generateAssignmentFromTopic = async (topic: string, context?: GenerationContext): Promise<AssignmentData> => {
  // Construct a context-aware prompt
  let contextPrompt = `Create a full educational guide chapter about: "${topic}".`;
  
  if (context) {
    contextPrompt = `
      Guide Name: "${context.courseName || 'General Guide'}".
      Current Chapter: #${context.lessonNumber || 1} of ${context.totalLessons || 5}.
      Current Topic: "${topic}".
      
      DIDACTIC CONTEXT:
      ${context.previousTopic ? `- Previous Chapter: "${context.previousTopic}". Reference this connectivity.` : '- This is the first chapter.'}
      ${context.nextTopic ? `- Next Chapter: "${context.nextTopic}". Tease this upcoming content.` : '- This is the final chapter.'}
    `;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contextPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            courseName: { type: Type.STRING, description: "Name of the Guide" },
            lecturerName: { type: Type.STRING, description: "Author Name or 'LearningHub'" },
            semester: { type: Type.STRING, description: "e.g. 'Edition 2025'" },
            title: { type: Type.STRING, description: "Chapter Title" },
            timeEstimate: { type: Type.STRING },
            dueDate: { type: Type.STRING, description: "Usually 'Self-paced' or similar for guides" },
            weight: { type: Type.STRING, description: "Importance level" },
            topic: { type: Type.STRING },
            contextDescription: { type: Type.STRING },
            prerequisite: { type: Type.STRING },
            lessonNumber: { type: Type.INTEGER },
            totalLessons: { type: Type.INTEGER },
            nextLessonTeaser: { type: Type.STRING },
            
            // New: Flashcards
            flashcards: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  term: { type: Type.STRING },
                  definition: { type: Type.STRING }
                }
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
                      properties: {
                        id: { type: Type.STRING },
                        text: { type: Type.STRING },
                        isCorrect: { type: Type.BOOLEAN }
                      }
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
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING },
                  value: { type: Type.NUMBER }
                }
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
            themeColorSecondary: { type: Type.STRING }
          }
        }
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text) as AssignmentData;
      return {
          ...data,
          lessonNumber: context?.lessonNumber || data.lessonNumber,
          totalLessons: context?.totalLessons || data.totalLessons,
          questions: data.questions.map((q, i) => ({
              ...q, 
              id: `q${i}`,
              options: q.options.map((o, j) => ({...o, id: `q${i}_o${j}`}))
          })),
          flashcards: data.flashcards || [] // Ensure it exists
      };
    }
    throw new Error("Empty response");
  } catch (error) {
    console.error("AI Generation Error:", error);
    return { ...INITIAL_DATA, title: `Error generating: ${topic}` };
  }
};