export interface KeywordCluster {
  name: string;
  keywords: string[];
  metrics?: KeywordMetrics;
}

export interface GeneratedResults {
  keywords: string[];
  clusters: KeywordCluster[];
}

export interface KeywordMetrics {
  searchVolume: number;
  difficulty: number;
  cpc: string;
  competition: string;
}