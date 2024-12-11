import { CompetitorMetric, MarketShareData, ContentGap } from '../types/competitor';

const API_ENDPOINTS = {
  COMPETITOR_METRICS: '/api/competitors/metrics',
  MARKET_SHARE: '/api/competitors/market-share',
  CONTENT_GAPS: '/api/competitors/content-gaps',
};

export const competitorService = {
  async getCompetitorMetrics(domain: string): Promise<CompetitorMetric[]> {
    try {
      const response = await fetch(`${API_ENDPOINTS.COMPETITOR_METRICS}?domain=${domain}`);
      if (!response.ok) throw new Error('Failed to fetch competitor metrics');
      return response.json();
    } catch (error) {
      console.error('Error fetching competitor metrics:', error);
      throw error;
    }
  },

  async getMarketShare(domain: string): Promise<MarketShareData[]> {
    try {
      const response = await fetch(`${API_ENDPOINTS.MARKET_SHARE}?domain=${domain}`);
      if (!response.ok) throw new Error('Failed to fetch market share data');
      return response.json();
    } catch (error) {
      console.error('Error fetching market share:', error);
      throw error;
    }
  },

  async getContentGaps(domain: string): Promise<ContentGap[]> {
    try {
      const response = await fetch(`${API_ENDPOINTS.CONTENT_GAPS}?domain=${domain}`);
      if (!response.ok) throw new Error('Failed to fetch content gaps');
      return response.json();
    } catch (error) {
      console.error('Error fetching content gaps:', error);
      throw error;
    }
  },

  // AI-powered analysis
  async analyzeCompetitor(domain: string): Promise<{
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  }> {
    try {
      const [metrics, marketShare, contentGaps] = await Promise.all([
        this.getCompetitorMetrics(domain),
        this.getMarketShare(domain),
        this.getContentGaps(domain),
      ]);

      // Use AI to analyze the data
      const analysis = await fetch('/api/ai/analyze-competitor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metrics, marketShare, contentGaps }),
      });

      return analysis.json();
    } catch (error) {
      console.error('Error analyzing competitor:', error);
      throw error;
    }
  }
}; 