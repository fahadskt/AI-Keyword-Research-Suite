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