import { KeywordCluster } from '../types';
import { calculateClusterMetrics } from './keywordAnalysis';

export const generateKeywordsFromNiche = async (niche: string, apiKey: string, model: string): Promise<string[]> => {
  // This would normally call the AI API
  // For demo purposes, returning mock data
  return [
    `${niche} tips`,
    `${niche} guide`,
    `${niche} tutorial`,
    `${niche} for beginners`,
    `best ${niche} practices`,
    `${niche} examples`,
    `how to ${niche}`,
    `${niche} strategies`,
  ];
};

export const clusterKeywords = (
  keywords: string[],
  minGroupSize: number,
  maxGroupSize: number,
  similarityThreshold: number
): KeywordCluster[] => {
  // Simple clustering implementation for demo
  const clusters: KeywordCluster[] = [];
  let currentCluster: string[] = [];

  keywords.forEach((keyword) => {
    if (currentCluster.length >= maxGroupSize) {
      clusters.push({
        name: `Cluster ${clusters.length + 1}`,
        keywords: [...currentCluster],
        metrics: calculateClusterMetrics(currentCluster),
      });
      currentCluster = [];
    }
    currentCluster.push(keyword);
  });

  if (currentCluster.length >= minGroupSize) {
    clusters.push({
      name: `Cluster ${clusters.length + 1}`,
      keywords: currentCluster,
      metrics: calculateClusterMetrics(currentCluster),
    });
  }

  return clusters;
};