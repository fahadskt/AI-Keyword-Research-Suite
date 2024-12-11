export interface TrendData {
  date: string;
  volume: number;
  competition: number;
  cpc: number;
  difficulty: number;
}

export interface EmergingTopic {
  topic: string;
  growthRate: number;
  searchVolume: number;
  competition: 'Low' | 'Medium' | 'High';
  predictedPeak: string;
  relatedKeywords: string[];
  sentiment: 'Positive' | 'Neutral' | 'Negative';
}

export interface SeasonalTrend {
  season: string;
  months: string[];
  keywords: Array<{
    keyword: string;
    peakVolume: number;
    offSeasonVolume: number;
  }>;
  yearOverYearGrowth: number;
  recommendations: string[];
}

export interface IndustryInsight {
  trend: string;
  impact: number;
  timeframe: string;
  description: string;
  actionItems: string[];
  sources: string[];
}

export interface MarketTrendsState {
  trends: TrendData[];
  emergingTopics: EmergingTopic[];
  seasonalTrends: SeasonalTrend[];
  industryInsights: IndustryInsight[];
  isLoading: boolean;
  error: string | null;
} 