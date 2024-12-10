import { KeywordCluster, KeywordMetrics } from '../types';
import { generateKeywordsWithOpenAI, generateKeywordsWithAnthropic, generateKeywordsWithGemini } from './api';
import { ModelType } from '../context/ApiKeyContext';

export const analyzeKeyword = async (
  keyword: string, 
  apiKey: string,
  model: ModelType
): Promise<KeywordMetrics> => {
  try {
    let response;
    switch (model) {
      case 'chatgpt':
        response = await generateKeywordsWithOpenAI(apiKey, keyword);
        break;
      case 'anthropic':
        response = await generateKeywordsWithAnthropic(apiKey, keyword);
        break;
      case 'gemini':
        response = await generateKeywordsWithGemini(apiKey, keyword);
        break;
      default:
        throw new Error('Invalid model selected');
    }
    
    return {
      keyword,
      searchVolume: response.metrics.searchVolume,
      difficulty: response.metrics.difficulty,
      cpc: response.metrics.cpc.toString(),
      competition: response.metrics.competition.toString(),
    };
  } catch (error) {
    console.error('Error analyzing keyword:', error);
    throw error;
  }
};

export const generateKeywordsFromNiche = async (
  niche: string, 
  apiKey: string, 
  model: ModelType
): Promise<string[]> => {
  try {
    let response;
    switch (model) {
      case 'chatgpt':
        response = await generateKeywordsWithOpenAI(apiKey, niche);
        break;
      case 'anthropic':
        response = await generateKeywordsWithAnthropic(apiKey, niche);
        break;
      case 'gemini':
        response = await generateKeywordsWithGemini(apiKey, niche);
        break;
      default:
        throw new Error('Invalid model selected');
    }
    
    return response.keywords;
  } catch (error) {
    console.error('Error generating keywords:', error);
    throw error;
  }
};

export const clusterKeywords = async (
  keywords: string[],
  minGroupSize: number,
  maxGroupSize: number,
  _similarityThreshold: number,
  apiKey: string,
  model: ModelType
): Promise<KeywordCluster[]> => {
  const clusters: KeywordCluster[] = [];
  let currentCluster: string[] = [];

  for (const keyword of keywords) {
    if (currentCluster.length >= maxGroupSize) {
      const metrics = await analyzeKeyword(currentCluster[0], apiKey, model);
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
    const metrics = await analyzeKeyword(currentCluster[0], apiKey, model);
    clusters.push({
      name: `Cluster ${clusters.length + 1}`,
      keywords: currentCluster,
      metrics
    });
  }

  return clusters;
};