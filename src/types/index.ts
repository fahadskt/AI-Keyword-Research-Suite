export interface KeywordData {
  keyword: string;
  volume: number;
  competition: 'Low' | 'Medium' | 'High';
  difficulty: number;
  intent: string;
  cpc: number;
  serpFeatures: string[];
  trend: number[];
  seasonality: string;
}

export interface KeywordCategory {
  name: string;
  keywords: KeywordData[];
  summary: {
    totalVolume: number;
    avgDifficulty: number;
    avgCpc: number;
    topIntent: string;
    growthRate: number;
  };
}

export interface KeywordAnalysisResult {
  mainKeywords: KeywordData[];
  lowCompetitionKeywords: KeywordData[];
  longTailKeywords: KeywordData[];
  relatedKeywords: KeywordData[];
}