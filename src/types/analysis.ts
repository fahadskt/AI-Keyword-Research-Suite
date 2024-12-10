export interface CompetitorAnalysis {
  topCompetitors: {
    domain: string;
    strengths: string[];
    weaknesses: string[];
    contentGaps: string[];
    rankingKeywords: string[];
    marketShare: number;
  }[];
  competitiveLandscape: {
    difficultyLevel: 'Low' | 'Medium' | 'High';
    entryBarriers: string[];
    opportunities: string[];
    threats: string[];
  };
}

export interface ContentStrategy {
  recommendedTopics: {
    topic: string;
    type: string;
    estimatedImpact: number;
    targetKeywords: string[];
    outline: string[];
    recommendedAngle: string;
  }[];
  contentCalendar: {
    month: string;
    focus: string;
    topics: string[];
    goals: string[];
  }[];
  contentTypes: {
    type: string;
    effectiveness: number;
    recommendedFrequency: string;
    bestPractices: string[];
  }[];
}

export interface MarketTrends {
  emergingTopics: {
    topic: string;
    growthRate: number;
    predictedPeak: string;
    relevance: number;
  }[];
  seasonalOpportunities: {
    season: string;
    keywords: string[];
    peakMonths: string[];
    recommendedPreparation: string;
  }[];
  industryShifts: {
    trend: string;
    impact: number;
    actionItems: string[];
    timeframe: string;
  }[];
} 