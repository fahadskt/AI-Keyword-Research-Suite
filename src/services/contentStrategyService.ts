import { ContentTopic, ContentCalendarItem, ContentInsight } from '../types/contentStrategy';
import { KeywordCategory } from '../types';

const API_ENDPOINTS = {
  GENERATE_TOPICS: '/api/content/generate-topics',
  ANALYZE_CONTENT: '/api/content/analyze',
  CALENDAR: '/api/content/calendar',
  INSIGHTS: '/api/content/insights',
};

export const contentStrategyService = {
  async generateTopics(keywords: KeywordCategory[]): Promise<ContentTopic[]> {
    try {
      const response = await fetch(API_ENDPOINTS.GENERATE_TOPICS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keywords }),
      });

      if (!response.ok) throw new Error('Failed to generate topics');
      return response.json();
    } catch (error) {
      console.error('Error generating topics:', error);
      throw error;
    }
  },

  async analyzeContent(content: string): Promise<{
    seoScore: number;
    readabilityScore: number;
    suggestions: string[];
  }> {
    try {
      const response = await fetch(API_ENDPOINTS.ANALYZE_CONTENT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) throw new Error('Failed to analyze content');
      return response.json();
    } catch (error) {
      console.error('Error analyzing content:', error);
      throw error;
    }
  },

  async getContentCalendar(): Promise<ContentCalendarItem[]> {
    try {
      const response = await fetch(API_ENDPOINTS.CALENDAR);
      if (!response.ok) throw new Error('Failed to fetch content calendar');
      return response.json();
    } catch (error) {
      console.error('Error fetching calendar:', error);
      throw error;
    }
  },

  async getContentInsights(): Promise<ContentInsight[]> {
    try {
      const response = await fetch(API_ENDPOINTS.INSIGHTS);
      if (!response.ok) throw new Error('Failed to fetch content insights');
      return response.json();
    } catch (error) {
      console.error('Error fetching insights:', error);
      throw error;
    }
  },

  async generateContentBrief(topic: ContentTopic): Promise<{
    title: string;
    outline: string[];
    keywords: string[];
    references: string[];
    guidelines: string[];
  }> {
    try {
      const response = await fetch('/api/ai/generate-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
      });

      if (!response.ok) throw new Error('Failed to generate content brief');
      return response.json();
    } catch (error) {
      console.error('Error generating brief:', error);
      throw error;
    }
  }
}; 