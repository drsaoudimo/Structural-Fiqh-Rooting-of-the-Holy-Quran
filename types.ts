export type ModelId = 'gemini-3-flash-preview';

export interface ThemeWeight {
  theme: string;
  weight: number; // 0.0 to 1.0
  englishLabel?: string;
}

export interface AnalysisResult {
  originalText: string;
  decomposition: string[]; // Words or roots
  themes: ThemeWeight[];
  equation: string; // The "V = ..." string
  deduction: string; // The textual conclusion
  religiousArticle: string; // Fiqh style article
  dominantTheme: string;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  result: AnalysisResult;
}

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}