export interface ContentTopic {
  id: string;
  title: string;
  type: 'blog' | 'guide' | 'video' | 'infographic';
  targetKeywords: Array<{
    keyword: string;
    volume: number;
    difficulty: number;
  }>;
  outline: string[];
  estimatedImpact: number;
  status: 'planned' | 'in-progress' | 'published';
  dueDate?: string;
}

export interface ContentCalendarItem {
  id: string;
  month: string;
  topics: ContentTopic[];
  goals: {
    traffic: number;
    conversions: number;
    rankings: number;
  };
  performance?: {
    actualTraffic: number;
    actualConversions: number;
    actualRankings: number;
  };
}

export interface ContentInsight {
  type: 'opportunity' | 'warning' | 'success';
  message: string;
  metric: string;
  change: number;
  recommendation: string;
}

export interface ContentStrategyState {
  topics: ContentTopic[];
  calendar: ContentCalendarItem[];
  insights: ContentInsight[];
  isLoading: boolean;
  error: string | null;
} 