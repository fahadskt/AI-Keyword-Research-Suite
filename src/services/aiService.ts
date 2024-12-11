import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Anthropic from '@anthropic-ai/sdk';
import { ModelType } from '../context/ApiKeyContext';
import { KeywordCategory } from '../types';

const KEYWORD_PROMPT = `Analyze this topic and generate a comprehensive list of keywords with realistic metrics.

Return a JSON object with this structure:
{
  "categories": [
    {
      "name": string (category name),
      "keywords": [
        {
          "term": string (keyword),
          "volume": number (monthly search volume),
          "competition": "Low" | "Medium" | "High",
          "difficulty": number (1-100),
          "opportunity": number (1-100),
          "cpc": number (cost per click),
          "intent": "Informational" | "Commercial" | "Transactional" | "Navigational",
          "serpFeatures": string[] (SERP features),
          "trend": number[] (12 months of trend data),
          "seasonality": "Stable" | "Seasonal" | "Trending"
        }
      ],
      "summary": {
        "totalVolume": number,
        "avgDifficulty": number,
        "avgCpc": number,
        "topIntent": string,
        "growthRate": number
      }
    }
  ]
}

Categories to include:
1. Main Keywords (primary terms)
2. Long-tail Keywords (specific phrases)
3. Related Terms (associated concepts)

Rules:
1. Generate 3-5 keywords per category
2. Use realistic search volumes and metrics
3. Ensure trend data shows 12 months of realistic patterns
4. Include relevant SERP features for each keyword
5. Calculate accurate summary metrics
6. Return valid JSON only`;

export async function generateKeywordInsights(
  topic: string,
  apiKey: string,
  model: ModelType
): Promise<KeywordCategory[]> {
  try {
    switch (model) {
      case 'chatgpt':
        return await generateWithOpenAI(topic, apiKey);
      case 'gemini':
        return await generateWithGemini(topic, apiKey);
      case 'anthropic':
        return await generateWithAnthropic(topic, apiKey);
      default:
        throw new Error('Unsupported model');
    }
  } catch (error: any) {
    console.error(`Error generating keywords with ${model}:`, error);
    throw error;
  }
}

async function generateWithOpenAI(topic: string, apiKey: string): Promise<KeywordCategory[]> {
  const openai = new OpenAI({ apiKey });
  
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert SEO analyst. Generate comprehensive keyword data with realistic metrics."
        },
        {
          role: "user",
          content: `${KEYWORD_PROMPT}\n\nTopic: ${topic}`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 4000,
    });

    const content = response.choices[0].message.content || '{}';
    const parsed = JSON.parse(content);
    
    if (!parsed.categories || !Array.isArray(parsed.categories)) {
      throw new Error('Invalid response structure from OpenAI');
    }
    
    return transformAIResponseToCategories(parsed);
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to generate keywords with OpenAI. Please try again or use a different model.');
  }
}

async function generateWithGemini(topic: string, apiKey: string): Promise<KeywordCategory[]> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  try {
    const result = await model.generateContent({
      contents: [{ 
        role: "user", 
        parts: [{ text: `${KEYWORD_PROMPT}\n\nTopic: ${topic}` }]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 4000,
      },
    });

    const text = result.response.text();
    const cleanedJSON = cleanAndValidateJSON(text);
    return transformAIResponseToCategories(JSON.parse(cleanedJSON));
  } catch (error: any) {
    handleGeminiError(error);
  }
}

async function generateWithAnthropic(topic: string, apiKey: string): Promise<KeywordCategory[]> {
  const anthropic = new Anthropic({ apiKey });

  try {
    const response = await anthropic.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 4000,
      system: "You are an expert SEO analyst. Generate comprehensive keyword data with realistic metrics.",
      messages: [
        {
          role: "user",
          content: `${KEYWORD_PROMPT}\n\nTopic: ${topic}`
        }
      ]
    });

    const content = response.content[0].type === 'text' ? response.content[0].text : '';
    const cleanedJSON = cleanAndValidateJSON(content);
    return transformAIResponseToCategories(JSON.parse(cleanedJSON));
  } catch (error) {
    console.error('Anthropic API error:', error);
    throw new Error('Failed to generate keywords with Claude. Please try again or use a different model.');
  }
}

function cleanAndValidateJSON(input: string): string {
  try {
    // Remove any non-JSON content
    let cleaned = input.replace(/^[^{]*/, '').replace(/[^}]*$/, '');
    
    // Remove markdown and code blocks
    cleaned = cleaned.replace(/```(?:json)?\s*|\s*```/g, '');
    
    // Fix common JSON issues
    cleaned = cleaned
      .replace(/[\u201C\u201D]/g, '"') // Fix smart quotes
      .replace(/[\r\n\t]/g, ' ') // Replace newlines with spaces
      .replace(/,\s*([\]}])/g, '$1') // Remove trailing commas
      .replace(/([{,])\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":') // Fix unquoted property names
      .replace(/:\s*'([^']*)'/g, ':"$1"') // Fix single quotes
      .replace(/,(\s*[}\]])/g, '$1') // Remove trailing commas
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();

    // Validate JSON structure
    const parsed = JSON.parse(cleaned);
    if (!parsed.categories || !Array.isArray(parsed.categories)) {
      throw new Error('Invalid response structure');
    }

    return cleaned;
  } catch (error) {
    console.error('JSON cleaning error:', error);
    throw error;
  }
}

function handleGeminiError(error: any): never {
  if (error.message?.includes('SERVICE_DISABLED')) {
    throw new Error(
      'Google Generative AI API is not enabled. Please enable it in your Google Cloud Console and try again.'
    );
  } else if (error.message?.includes('PERMISSION_DENIED')) {
    throw new Error(
      'Invalid API key or insufficient permissions for Google Generative AI.'
    );
  } else if (error.message?.includes('QUOTA_EXCEEDED')) {
    throw new Error(
      'API quota exceeded for Google Generative AI. Please try again later.'
    );
  }
  
  throw new Error('Failed to generate keywords with Gemini. Please try another model or check your API key.');
}

function transformAIResponseToCategories(response: any): KeywordCategory[] {
  try {
    return response.categories.map((category: any) => ({
      name: category.name,
      keywords: category.keywords.map((kw: any) => ({
        keyword: kw.term,
        volume: Number(kw.volume),
        competition: kw.competition,
        difficulty: Number(kw.difficulty),
        opportunity: Number(kw.opportunity),
        cpc: Number(kw.cpc),
        intent: kw.intent,
        serpFeatures: Array.isArray(kw.serpFeatures) ? kw.serpFeatures : [],
        trend: Array.isArray(kw.trend) ? kw.trend : Array(12).fill(0),
        seasonality: kw.seasonality || 'Stable'
      })),
      summary: {
        totalVolume: Number(category.summary.totalVolume),
        avgDifficulty: Number(category.summary.avgDifficulty),
        avgCpc: Number(category.summary.avgCpc),
        topIntent: category.summary.topIntent,
        growthRate: Number(category.summary.growthRate)
      }
    }));
  } catch (error) {
    console.error('Error transforming AI response:', error);
    throw new Error('Failed to process AI response data');
  }
} 