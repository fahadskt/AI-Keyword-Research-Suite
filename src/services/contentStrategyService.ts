import { ContentStrategy } from '../types/analysis';
import { ModelType } from '../context/ApiKeyContext';
import { generateAIResponse } from './aiService';

const CONTENT_STRATEGY_PROMPT = `Generate a comprehensive content strategy.
Return the strategy in this exact JSON structure:
{
  "recommendedTopics": [
    {
      "topic": string,
      "type": string,
      "estimatedImpact": number,
      "targetKeywords": string[],
      "outline": string[],
      "recommendedAngle": string
    }
  ],
  "contentCalendar": [
    {
      "month": string,
      "topics": string[],
      "goals": string[]
    }
  ],
  "contentTypes": [
    {
      "type": string,
      "effectiveness": number,
      "recommendedFrequency": string,
      "bestPractices": string[]
    }
  ]
}`;

export async function generateContentStrategy(
  niche: string,
  keywords: string[],
  apiKey: string,
  model: ModelType
): Promise<ContentStrategy> {
  try {
    const response = await generateAIResponse(
      `${CONTENT_STRATEGY_PROMPT}\n\nNiche: ${niche}\nTarget Keywords: ${keywords.join(', ')}`,
      apiKey,
      model
    );
    return transformContentStrategy(response);
  } catch (error) {
    console.error('Error generating content strategy:', error);
    throw new Error('Failed to generate content strategy. Please try again.');
  }
}

function transformContentStrategy(response: any): ContentStrategy {
  // Add validation and transformation logic
  return response;
} 