import { LocalSEOAnalysis } from '../types/analysis';
import { ModelType } from '../context/ApiKeyContext';
import { generateAIResponse } from './aiService';

const LOCAL_SEO_PROMPT = `Analyze local SEO opportunities for this business.
Return the analysis in this exact JSON structure:
{
  "localKeywords": [
    {
      "term": string,
      "volume": number,
      "competition": string,
      "relevance": number
    }
  ],
  "geoTargeting": {
    "primaryLocations": string[],
    "secondaryLocations": string[],
    "serviceAreas": string[]
  },
  "localCompetitors": [
    {
      "name": string,
      "location": string,
      "strengths": string[],
      "weaknesses": string[]
    }
  ],
  "recommendations": {
    "gmb": string[],
    "citations": string[],
    "content": string[],
    "technical": string[]
  }
}`;

export async function analyzeLocalSEO(
  business: {
    name: string;
    address: string;
    type: string;
  },
  apiKey: string,
  model: ModelType
): Promise<LocalSEOAnalysis> {
  try {
    const response = await generateAIResponse(
      `${LOCAL_SEO_PROMPT}\n\nBusiness: ${JSON.stringify(business)}`,
      apiKey,
      model
    );
    return transformLocalSEOAnalysis(response);
  } catch (error) {
    console.error('Error analyzing local SEO:', error);
    throw new Error('Failed to analyze local SEO. Please try again.');
  }
}

function transformLocalSEOAnalysis(response: any): LocalSEOAnalysis {
  // Add validation and transformation logic
  return response;
} 