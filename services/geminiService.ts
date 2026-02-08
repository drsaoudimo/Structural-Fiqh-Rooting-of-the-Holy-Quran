import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult, ModelId } from "../types";

// In-memory cache to store analysis results
// Key format: "modelId:textHash" (using simple string length+slice for 'hash' or full text if short)
const analysisCache = new Map<string, AnalysisResult>();

// Define the response schema for strict JSON output
const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    decomposition: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Breakdown of the verse into key roots or words in Arabic"
    },
    themes: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          theme: { type: Type.STRING, description: "Theme name in Arabic (e.g., الرحمة)" },
          weight: { type: Type.NUMBER, description: "Weight of the theme from 0.0 to 1.0" },
          englishLabel: { type: Type.STRING, description: "English label for internal logic" }
        },
        required: ["theme", "weight"]
      },
      description: "List of themes present in the text with their calculated semantic weights"
    },
    equation: {
      type: Type.STRING,
      description: "The mathematical representation (e.g., V = 0.8*Iman + 0.2*Sabr)"
    },
    deduction: {
      type: Type.STRING,
      description: "A logical deduction based on the weights and relationships in Arabic"
    },
    religiousArticle: {
      type: Type.STRING,
      description: "A profound article written in traditional Islamic jurisprudential (Fiqh) and rhetorical style explaining the deduction and the mathematical balance found."
    },
    dominantTheme: {
      type: Type.STRING,
      description: "The theme with the highest accumulated weight in Arabic"
    }
  },
  required: ["decomposition", "themes", "equation", "deduction", "religiousArticle", "dominantTheme"]
};

export const analyzeText = async (text: string, modelId: ModelId = 'gemini-3-flash-preview'): Promise<AnalysisResult> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing.");
  }

  // 1. Check Cache
  // Create a somewhat unique key. For very long texts, using the full text as key is fine in JS Map.
  const cacheKey = `${modelId}:${text.trim()}`;
  if (analysisCache.has(cacheKey)) {
    console.log("Serving from cache");
    return analysisCache.get(cacheKey)!;
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    Act as the 'Quranomics Engine' (محرك قرآنوميكا). Your task is to analyze the provided Quranic text using a mathematical and structural approach, then synthesize the findings into a deep religious insight.
    
    Input Text: "${text}"

    Perform the following operations:
    1. **Decomposition**: Break the text down into key concepts or roots (in Arabic).
    2. **Theme Weighting**: Identify the major themes (e.g., Tawheed, Rahma, Sabr). Assign a weight (0.0 to 1.0) to each theme.
    3. **Equation Formulation**: Create a mathematical string representing the verse (V). Use Arabic theme names in the equation if possible or Latin script. Format: "V = 0.8 * Theme1 + ...".
    4. **Deduction**: Provide a logical conclusion derived *only* from the calculated weights (in Arabic).
    5. **Religious Article**: Write a sophisticated paragraph in **classical Arabic religious/Fiqh style (لغة فقهية جزلة ورصينة)**. It should discuss the "Divine Balance" (الميزان الإلهي) revealed by the weights and equation, connecting the mathematical findings to spiritual meanings. Start with phrases like "ومما يظهر في ميزان هذه الآيات..." or "وباستقراء البنية الدلالية للنص...".

    Return the result in strict JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.4,
      },
    });

    const resultText = response.text;
    if (!resultText) throw new Error("No response from AI");

    const parsed = JSON.parse(resultText);
    
    const result: AnalysisResult = {
      originalText: text,
      ...parsed
    };

    // 2. Save to Cache
    analysisCache.set(cacheKey, result);

    return result;

  } catch (error) {
    console.error("Quranomics Analysis Error:", error);
    throw error;
  }
};