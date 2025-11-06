
import { GoogleGenAI, Type } from "@google/genai";
import { EducationalContent } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const educationalContentSchema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: "A concise summary of the entire document, capturing the main ideas and arguments."
    },
    keyConcepts: {
      type: Type.ARRAY,
      description: "A list of the most important concepts, terms, or ideas from the text.",
      items: {
        type: Type.OBJECT,
        properties: {
          concept: {
            type: Type.STRING,
            description: "The name of the key concept."
          },
          explanation: {
            type: Type.STRING,
            description: "A brief, clear explanation of the concept."
          }
        },
        required: ["concept", "explanation"]
      }
    },
    flashcards: {
      type: Type.ARRAY,
      description: "A set of flashcards for studying, with a term and a definition.",
      items: {
        type: Type.OBJECT,
        properties: {
          term: {
            type: Type.STRING,
            description: "The term or question for the front of the flashcard."
          },
          definition: {
            type: Type.STRING,
            description: "The definition or answer for the back of the flashcard."
          }
        },
        required: ["term", "definition"]
      }
    },
    quiz: {
      type: Type.ARRAY,
      description: "A short quiz to test understanding of the material.",
      items: {
        type: Type.OBJECT,
        properties: {
          question: {
            type: Type.STRING,
            description: "The quiz question."
          },
          type: {
            type: Type.STRING,
            enum: ["MCQ", "T/F"],
            description: "The type of question: Multiple Choice (MCQ) or True/False (T/F)."
          },
          options: {
            type: Type.ARRAY,
            description: "An array of possible answers for MCQ questions. Should be empty for T/F questions.",
            items: { type: Type.STRING }
          },
          answer: {
            type: Type.STRING,
            description: "The correct answer to the question."
          }
        },
        required: ["question", "type", "answer"]
      }
    }
  },
  required: ["summary", "keyConcepts", "flashcards", "quiz"]
};

export const generateEducationalContent = async (text: string): Promise<EducationalContent> => {
  try {
    const prompt = `Based on the following text, please generate a comprehensive educational module. The output must be a single JSON object. The text is: \n\n---\n\n${text.substring(0, 30000)}\n\n---\n\nPlease generate the following content based on the text provided:
1.  **Summary**: A concise summary.
2.  **Key Concepts**: A list of at least 5 key concepts with brief explanations.
3.  **Flashcards**: At least 5 flashcards with a term and a definition.
4.  **Quiz**: A quiz with 5 questions, including a mix of Multiple Choice (MCQ) and True/False (T/F) types. For MCQs, provide 4 options.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: educationalContentSchema,
        temperature: 0.7,
      }
    });
    
    const jsonText = response.text.trim();
    const parsedJson = JSON.parse(jsonText);
    
    // Basic validation
    if (!parsedJson.summary || !parsedJson.keyConcepts || !parsedJson.flashcards || !parsedJson.quiz) {
      throw new Error("Generated content is missing required fields.");
    }
    
    return parsedJson as EducationalContent;

  } catch (error) {
    console.error("Error generating content with Gemini API:", error);
    throw new Error("Failed to generate educational content. The AI model may be overloaded or the content could not be processed. Please try again.");
  }
};
