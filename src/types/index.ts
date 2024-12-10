export interface KeywordCluster {
  name: string;
  keywords: string[];
  metrics?: KeywordMetrics;
}

export interface GeneratedResults {
  keywords: string[];
  clusters: KeywordCluster[];
  overview: KeywordOverview;
}

export interface KeywordMetrics {
  keyword: string;
  searchVolume: number;
  difficulty: number;
  cpc: string;
  competition: string;
  trend?: number[];
  relatedCategories?: string[];
}

export interface KeywordOverview {
  totalKeywords: number;
  avgDifficulty: number;
  categories: string[];
  volumeDistribution: {
    high: number;
    medium: number;
    low: number;
  };
}

export interface KeywordAnalysis {
  keyword: string;
  metrics: KeywordMetrics;
  variations: KeywordVariation[];
  relatedTopics: string[];
}

export interface KeywordVariation {
  keyword: string;
  searchVolume: number;
  difficulty: number;
  competition: string;
  cpc: string;
}

export type CompetitionLevel = 'High' | 'Medium' | 'Low';

export interface SearchMetrics {
  keyword: string;
  searchVolume: number;
  difficulty: number;
  competition: CompetitionLevel;
  cpc: string;
  trend: number[];
}

export interface KeywordCategory {
  name: string;
  keywords: KeywordMetric[];
  summary: {
    totalVolume: number;
    avgDifficulty: number;
    avgCpc: number;
    topIntent: string;
    growthRate: number;
  };
}

export interface KeywordMetric {
  keyword: string;
  volume: number;
  competition: 'Low' | 'Medium' | 'High';
  difficulty: number;
  opportunity: number;
  cpc: number;
  intent: 'Informational' | 'Commercial' | 'Transactional' | 'Navigational';
  serp_features: string[];
  trend: number[];
  seasonality: 'Stable' | 'Seasonal' | 'Trending';
  ranking_difficulty: {
    score: number;
    factors: {
      competition: number;
      content_depth: number;
      authority_needed: number;
    };
  };
}