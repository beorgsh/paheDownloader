
import { GoogleGenAI, Type } from "@google/genai";
import { GeminiAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeAnime = async (title: string): Promise<GeminiAnalysis> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze the anime titled "${title}". Provide a short summary, 3 reasons why someone should watch it, and an expert rating out of 10.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING, description: 'A 2-sentence summary of the plot.' },
          whyWatch: { type: Type.STRING, description: 'Bullet points of why to watch.' },
          rating: { type: Type.STRING, description: 'Numerical rating like 8.5/10.' }
        },
        required: ["summary", "whyWatch", "rating"]
      }
    }
  });

  const text = response.text || "{}";
  return JSON.parse(text);
};
