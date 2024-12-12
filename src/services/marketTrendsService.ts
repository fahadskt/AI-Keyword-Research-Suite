import { MarketTrends } from '../types/analysis';
import { ModelType } from '../context/ApiKeyContext';
import { generateAIResponse } from './aiService';

const MARKET_TRENDS_PROMPT = `Analyze market trends and provide insights.
Return the analysis in this exact JSON structure:
{
  "emergingTopics": [
    {
      "topic": string,
      "growthRate": number,
      "predictedPeak": string,
      "relevance": number
    }
  ],
  "seasonalOpportunities": [
    {
      "season": string,
      "keywords": string[],
      "peakMonths": string[],
      "recommendedPreparation": string
    }
  ],
  "industryShifts": [
    {
      "trend": string,
      "impact": number,
      "actionItems": string[],
      "timeframe": string
    }
  ]
}`;

export async function analyzeMarketTrends(
  industry: string,
  timeframe: string,
  apiKey: string,
  model: ModelType
): Promise<MarketTrends> {
  try {
    const response = await generateAIResponse(
      `${MARKET_TRENDS_PROMPT}\n\nIndustry: ${industry}\nTimeframe: ${timeframe}`,
      apiKey,
      model
    );
    return transformMarketTrends(response);
  } catch (error) {
    console.error('Error analyzing market trends:', error);
    throw new Error('Failed to analyze market trends. Please try again.');
  }
}

function transformMarketTrends(response: any): MarketTrends {
  // Add validation and transformation logic
  return response;
} 