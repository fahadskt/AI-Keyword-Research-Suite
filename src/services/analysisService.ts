import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Anthropic from '@anthropic-ai/sdk';
import { ModelType } from '../context/ApiKeyContext';
import { KeywordCategory } from '../types';
import { CompetitorAnalysis, ContentStrategy, MarketTrends } from '../types/analysis';

export async function analyzeKeywordOpportunities(
  categories: KeywordCategory[],
  apiKey: string,
  model: ModelType
): Promise<{
  competitorAnalysis: CompetitorAnalysis;
  contentStrategy: ContentStrategy;
  marketTrends: MarketTrends;
}> {
  const prompt = `Analyze these keywords and provide comprehensive insights:
  ${JSON.stringify(categories, null, 2)}

  Return a detailed analysis in this JSON format:
  {
    "competitorAnalysis": {
      "topCompetitors": [
        {
          "domain": string,
          "strengths": string[],
          "weaknesses": string[],
          "contentGaps": string[],
          "rankingKeywords": string[],
          "marketShare": number
        }
      ],
      "competitiveLandscape": {
        "difficultyLevel": "Low" | "Medium" | "High",
        "entryBarriers": string[],
        "opportunities": string[],
        "threats": string[]
      }
    },
    "contentStrategy": {
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
          "focus": string,
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
    },
    "marketTrends": {
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
    }
  }`;

  switch (model) {
    case 'chatgpt':
      return analyzeWithOpenAI(prompt, apiKey);
    case 'gemini':
      return analyzeWithGemini(prompt, apiKey);
    case 'anthropic':
      return analyzeWithAnthropic(prompt, apiKey);
    default:
      throw new Error('Unsupported model');
  }
}

async function analyzeWithOpenAI(prompt: string, apiKey: string): Promise<{
  competitorAnalysis: CompetitorAnalysis;
  contentStrategy: ContentStrategy;
  marketTrends: MarketTrends;
}> {
  const openai = new OpenAI({ apiKey });
  
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert SEO and market analysis AI. Provide detailed analysis in JSON format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 4000,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    return result;
  } catch (error) {
    console.error('OpenAI analysis error:', error);
    return getDefaultAnalysis();
  }
}

async function analyzeWithGemini(prompt: string, apiKey: string): Promise<{
  competitorAnalysis: CompetitorAnalysis;
  contentStrategy: ContentStrategy;
  marketTrends: MarketTrends;
}> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  try {
    const result = await model.generateContent({
      contents: [{ 
        role: "user", 
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      },
    });

    const text = result.response.text();
    let cleanedText = text
      .replace(/```(?:json|JSON)?\s*|\s*```/g, '')
      .replace(/[\u201C\u201D]/g, '"')
      .replace(/[\r\n\t]/g, '')
      .trim();

    cleanedText = cleanedText.substring(
      cleanedText.indexOf('{'),
      cleanedText.lastIndexOf('}') + 1
    );

    return JSON.parse(cleanedText);
  } catch (error) {
    console.error('Gemini analysis error:', error);
    return getDefaultAnalysis();
  }
}

async function analyzeWithAnthropic(prompt: string, apiKey: string): Promise<{
  competitorAnalysis: CompetitorAnalysis;
  contentStrategy: ContentStrategy;
  marketTrends: MarketTrends;
}> {
  const anthropic = new Anthropic({ apiKey });

  try {
    const response = await anthropic.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 4000,
      system: "You are an expert SEO and market analysis AI. Provide detailed analysis in JSON format.",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ]
    });

    const content = response.content[0].type === 'text' ? response.content[0].text : '';
    const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
    const jsonStr = jsonMatch ? jsonMatch[1] : content;
    
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error('Anthropic analysis error:', error);
    return getDefaultAnalysis();
  }
}

function getDefaultAnalysis(): {
  competitorAnalysis: CompetitorAnalysis;
  contentStrategy: ContentStrategy;
  marketTrends: MarketTrends;
} {
  return {
    competitorAnalysis: {
      topCompetitors: [],
      competitiveLandscape: {
        difficultyLevel: 'Medium',
        entryBarriers: [],
        opportunities: [],
        threats: []
      }
    },
    contentStrategy: {
      recommendedTopics: [],
      contentCalendar: [],
      contentTypes: []
    },
    marketTrends: {
      emergingTopics: [],
      seasonalOpportunities: [],
      industryShifts: []
    }
  };
}