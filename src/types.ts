export interface SentimentAnalysisResult {
  sentiment: "Pozitif" | "Nötr" | "Negatif";
  score: number; // -1.0 to 1.0
  emotions: {
    joy: number;      // percentage/fraction 0-1
    sadness: number;  // 0-1
    anger: number;    // 0-1
    fear: number;     // 0-1
    surprise: number; // 0-1
  };
  intensity: "Çok Düşük" | "Düşük" | "Orta" | "Yüksek" | "Çok Yüksek";
  summary: string;
  keyPhrases: string[];
  suggestedResponse: string;
  topics: string[];
  detectedLanguage: string;
  transcription: string; // added back to conform to schema and datasets
  timestamp: string;
  textSnippet: string;
  type: "Metin" | "Ses" | "Dosya";
}

export interface DashboardStats {
  totalAnalyzed: number;
  averageScore: number;
  sentimentCounts: {
    positive: number;
    neutral: number;
    negative: number;
  };
  emotionAverages: {
    joy: number;
    sadness: number;
    anger: number;
    fear: number;
    surprise: number;
  };
  topicCounts: Record<string, number>;
}
