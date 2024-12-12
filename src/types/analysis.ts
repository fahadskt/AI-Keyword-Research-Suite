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

export interface LocalSEOAnalysis {
  localKeywords: {
    term: string;
    volume: number;
    competition: 'Low' | 'Medium' | 'High';
    relevance: number;
  }[];
  geoTargeting: {
    primaryLocations: string[];
    secondaryLocations: string[];
    serviceAreas: string[];
  };
  localCompetitors: {
    name: string;
    location: string;
    strengths: string[];
    weaknesses: string[];
  }[];
  recommendations: {
    gmb: string[]; // Google My Business recommendations
    citations: string[]; // Local citation recommendations
    content: string[]; // Local content recommendations
    technical: string[]; // Technical SEO recommendations
  };
}

export interface AnalysisResult {
  competitor?: CompetitorAnalysis;
  content?: ContentStrategy;
  market?: MarketTrends;
  local?: LocalSEOAnalysis;
  timestamp: number;
}

export interface AnalysisError {
  type: 'competitor' | 'content' | 'market' | 'local';
  message: string;
  details?: string;
  timestamp: number;
}

export interface AnalysisStatus {
  isLoading: boolean;
  error: AnalysisError | null;
  lastUpdated: number | null;
}

export const isValidAnalysisResponse = (response: any): boolean => {
  try {
    // Basic structure validation
    if (!response || typeof response !== 'object') return false;

    // Check for required properties based on type
    if ('topCompetitors' in response) {
      return Array.isArray(response.topCompetitors) && 
             'competitiveLandscape' in response;
    }

    if ('recommendedTopics' in response) {
      return Array.isArray(response.recommendedTopics) && 
             'contentCalendar' in response;
    }

    if ('emergingTopics' in response) {
      return Array.isArray(response.emergingTopics) && 
             'seasonalOpportunities' in response;
    }

    if ('localKeywords' in response) {
      return Array.isArray(response.localKeywords) && 
             'geoTargeting' in response;
    }

    return false;
  } catch {
    return false;
  }
}; 