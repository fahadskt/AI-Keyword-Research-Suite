import { KeywordCluster, KeywordMetrics } from '../types';
import { generateKeywordsWithOpenAI, generateKeywordsWithAnthropic, generateKeywordsWithGemini } from './api';
import { ModelType } from '../context/ApiKeyContext';

const generateMockMetrics = (keyword: string): KeywordMetrics => ({
  keyword,
  searchVolume: Math.floor(Math.random() * 10000),
  difficulty: Math.floor(Math.random() * 100),
  cpc: (Math.random() * 5).toFixed(2),
  competition: (Math.random()).toFixed(2),
});

export const analyzeKeyword = async (
  keyword: string
): Promise<KeywordMetrics> => {
  return generateMockMetrics(keyword);
};

export const generateKeywordsFromNiche = async (
  niche: string, 
  apiKey: string, 
  model: ModelType
): Promise<string[]> => {
  try {
    let keywords: string[] = [];
    switch (model) {
      case 'chatgpt':
        keywords = await generateKeywordsWithOpenAI(apiKey, niche);
        break;
      case 'anthropic':
        keywords = await generateKeywordsWithAnthropic(apiKey, niche);
        break;
      case 'gemini':
        keywords = await generateKeywordsWithGemini(apiKey, niche);
        break;
      default:
        throw new Error('Invalid model selected');
    }
    
    return keywords || [];
  } catch (error) {
    console.error('Error generating keywords:', error);
    return [];
  }
};

export const clusterKeywords = async (
  keywords: string[],
  minGroupSize: number,
  maxGroupSize: number,
  _similarityThreshold: number
): Promise<KeywordCluster[]> => {
  const clusters: KeywordCluster[] = [];
  let currentCluster: string[] = [];

  for (const keyword of keywords) {
    if (currentCluster.length >= maxGroupSize) {
      const metrics = await analyzeKeyword(currentCluster[0]);
      clusters.push({
        name: `Cluster ${clusters.length + 1}`,
        keywords: [...currentCluster],
        metrics
      });
      currentCluster = [];
    }
    currentCluster.push(keyword);
  }

  if (currentCluster.length >= minGroupSize) {
    const metrics = await analyzeKeyword(currentCluster[0]);
    clusters.push({
      name: `Cluster ${clusters.length + 1}`,
      keywords: currentCluster,
      metrics
    });
  }

  return clusters;
};