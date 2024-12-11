export interface CompetitorMetric {
  domain: string;
  metrics: {
    domainAuthority: number;
    trafficValue: number;
    organicKeywords: number;
    backlinks: number;
    growth: number;
  };
  topKeywords: Array<{
    keyword: string;
    position: number;
    volume: number;
    difficulty: number;
  }>;
}

export interface MarketShareData {
  domain: string;
  share: number;
  change: number;
}

export interface ContentGap {
  topic: string;
  difficulty: number;
  opportunity: number;
  competitors: Array<{
    domain: string;
    position: number;
    contentLength: number;
  }>;
  suggestedKeywords: string[];
  estimatedTraffic: number;
}

export interface CompetitorAnalysisState {
  competitors: CompetitorMetric[];
  marketShare: MarketShareData[];
  contentGaps: ContentGap[];
  isLoading: boolean;
  error: string | null;
} 