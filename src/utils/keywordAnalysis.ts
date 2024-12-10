import { KeywordMetrics } from '../types';

export const analyzeKeyword = (keyword: string): KeywordMetrics => {
  // Mock analysis - in a real app, this would call SEO APIs
  return {
    searchVolume: Math.floor(Math.random() * 10000),
    difficulty: Math.floor(Math.random() * 100),
    cpc: (Math.random() * 5).toFixed(2),
    competition: Math.random().toFixed(2),
  };
};

export const calculateClusterMetrics = (keywords: string[]): KeywordMetrics => {
  const metrics = keywords.map(analyzeKeyword);
  return {
    searchVolume: Math.floor(metrics.reduce((acc, m) => acc + m.searchVolume, 0) / metrics.length),
    difficulty: Math.floor(metrics.reduce((acc, m) => acc + Number(m.difficulty), 0) / metrics.length),
    cpc: (metrics.reduce((acc, m) => acc + Number(m.cpc), 0) / metrics.length).toFixed(2),
    competition: (metrics.reduce((acc, m) => acc + Number(m.competition), 0) / metrics.length).toFixed(2),
  };
};