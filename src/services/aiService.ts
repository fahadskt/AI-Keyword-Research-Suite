import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Anthropic from '@anthropic-ai/sdk';
import { ModelType } from '../context/ApiKeyContext';
import { KeywordCategory } from '../types';

const PROMPTS = {
  KEYWORD_GENERATION: `Analyze the following topic and generate relevant keywords with their metrics.
  Return the data in the following JSON format:
  {
    "categories": [
      {
        "name": "string",
        "keywords": [
          {
            "term": "string",
            "volume": number,
            "competition": "Low" | "Medium" | "High",
            "difficulty": number,
            "opportunity": number,
            "cpc": number,
            "intent": "Informational" | "Commercial" | "Transactional" | "Navigational",
            "serpFeatures": string[],
            "trend": number[],
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

  Topic:`,

  CONTENT_SUGGESTIONS: `Based on these keywords, suggest content ideas.
  Return the data in JSON format.
  Keywords:`,
};

export async function generateKeywordInsights(
  topic: string,
  apiKey: string,
  model: ModelType
): Promise<KeywordCategory[]> {
  switch (model) {
    case 'chatgpt':
      return generateWithOpenAI(topic, apiKey);
    case 'gemini':
      return generateWithGemini(topic, apiKey);
    case 'anthropic':
      return generateWithAnthropic(topic, apiKey);
    default:
      throw new Error('Unsupported model');
  }
}

async function generateWithOpenAI(topic: string, apiKey: string): Promise<KeywordCategory[]> {
  const openai = new OpenAI({ apiKey });
  
  const prompt = `Generate a keyword analysis for: ${topic}

  IMPORTANT: Return ONLY a JSON object in exactly this format, with no additional text or explanation.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a SEO and keyword research expert. Always respond with valid JSON only."
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

    const content = response.choices[0].message.content || '{}';
    const parsed = JSON.parse(content);
    
    if (!parsed.categories) {
      throw new Error('Invalid response structure');
    }
    
    return transformAIResponseToCategories(parsed);
  } catch (error) {
    console.error('OpenAI API error:', error);
    return [{
      name: 'General',
      keywords: [],
      summary: {
        totalVolume: 0,
        avgDifficulty: 0,
        avgCpc: 0,
        topIntent: 'Informational',
        growthRate: 0
      }
    }];
  }
}

async function generateWithGemini(prompt: string, apiKey: string): Promise<KeywordCategory[]> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  try {
    const result = await model.generateContent({
      contents: [{ 
        role: "user", 
        parts: [{ 
          text: `As an SEO and keyword research expert, analyze the topic "${prompt}" and generate keyword data.
          
          Generate a focused set of keywords with realistic metrics. Keep the response concise but comprehensive.
          
          Return a JSON object with this structure:
          {
            "categories": [
              {
                "name": string,
                "keywords": [
                  {
                    "term": string,
                    "volume": number,
                    "competition": "Low" | "Medium" | "High",
                    "difficulty": number (1-100),
                    "opportunity": number (1-100),
                    "cpc": number,
                    "intent": string,
                    "serpFeatures": string[],
                    "trend": number[],
                    "seasonality": string
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

          Rules:
          1. Generate exactly 3 categories with 3-5 keywords each
          2. Keep responses focused and concise
          3. Use realistic values
          4. Return valid JSON only
          5. No explanations or additional text`
        }]
      }],
      generationConfig: {
        temperature: 0.3,
        topK: 20,
        topP: 0.8,
        maxOutputTokens: 4000, // Reduced to avoid truncation
      },
    });

    const text = result.response.text();
    
    // Clean and validate the response
    const cleanJSON = (input: string): string => {
      try {
        // Remove any non-JSON content
        let cleaned = input.replace(/^[^{]*/, '').replace(/[^}]*$/, '');
        
        // Remove markdown and code blocks
        cleaned = cleaned.replace(/```[^`]*```/g, '');
        
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

        // Ensure the JSON is complete
        if (!cleaned.endsWith('}')) {
          throw new Error('Incomplete JSON response');
        }

        // Basic structure validation
        const parsed = JSON.parse(cleaned);
        if (!parsed.categories || !Array.isArray(parsed.categories)) {
          throw new Error('Invalid response structure');
        }

        return cleaned;
      } catch (error) {
        console.error('JSON cleaning error:', error);
        throw error;
      }
    };

    try {
      const cleanedJSON = cleanJSON(text);
      return transformAIResponseToCategories(JSON.parse(cleanedJSON));
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', parseError);
      console.error('Raw response:', text);
      throw new Error('Invalid response format from Gemini');
    }
  } catch (error: any) {
    // API error handling remains the same
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
    
    console.error('Gemini API error:', error);
    throw new Error('Failed to generate keywords with Gemini. Please try another model or check your API key.');
  }
}

async function generateWithAnthropic(topic: string, apiKey: string): Promise<KeywordCategory[]> {
  const anthropic = new Anthropic({ apiKey });

  const response = await anthropic.messages.create({
    model: "claude-3-opus-20240229",
    max_tokens: 4000,
    system: "You are a SEO and keyword research expert. Return ONLY a JSON object with no additional text or formatting.",
    messages: [
      {
        role: "user",
        content: `${PROMPTS.KEYWORD_GENERATION} ${topic}`
      }
    ]
  });

  const content = response.content[0].type === 'text' ? response.content[0].text : '';
  
  try {
    // First try to parse the content directly
    try {
      return transformAIResponseToCategories(JSON.parse(content));
    } catch {
      // If direct parsing fails, try to extract JSON from markdown
      const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*?\}|\[[\s\S]*?\])\s*```/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }
      return transformAIResponseToCategories(JSON.parse(jsonMatch[1]));
    }
  } catch (error) {
    console.error('Failed to parse Anthropic response:', error);
    // Return a default category with empty data
    return [{
      name: 'General',
      keywords: [],
      summary: {
        totalVolume: 0,
        avgDifficulty: 0,
        avgCpc: 0,
        topIntent: 'Informational',
        growthRate: 0
      }
    }];
  }
}

function transformAIResponseToCategories(aiResponse: any): KeywordCategory[] {
  try {
    return (aiResponse.categories || []).map((category: any) => ({
      name: category.name || 'Unnamed Category',
      keywords: (category.keywords || []).map((kw: any) => ({
        keyword: kw.term || '',
        volume: Number(kw.volume) || 0,
        competition: kw.competition || 'Medium',
        difficulty: Number(kw.difficulty) || 0,
        opportunity: Number(kw.opportunity) || 0,
        cpc: Number(kw.cpc) || 0,
        intent: kw.intent || 'Informational',
        serp_features: Array.isArray(kw.serpFeatures) ? kw.serpFeatures : [],
        trend: Array.isArray(kw.trend) ? kw.trend : Array(12).fill(0),
        seasonality: kw.seasonality || 'Stable',
        ranking_difficulty: kw.rankingDifficulty || {
          score: 0,
          factors: {
            competition: 0,
            content_depth: 0,
            authority_needed: 0,
          }
        },
        competitors: Array.isArray(kw.competitors) ? kw.competitors : [],
        contentGap: kw.contentGap || {
          missingTopics: [],
          contentSuggestions: []
        },
        searchIntent: kw.searchIntent || {
          primary: 'Informational',
          secondary: [],
          userQuestions: []
        },
        performance: kw.performance || {
          clickThroughRate: 0,
          impressionsPerMonth: 0,
          averagePosition: 0
        },
        localMetrics: kw.localMetrics || null
      })),
      summary: {
        totalVolume: Number(category.summary?.totalVolume) || 0,
        avgDifficulty: Number(category.summary?.avgDifficulty) || 0,
        avgCpc: Number(category.summary?.avgCpc) || 0,
        topIntent: category.summary?.topIntent || 'Informational',
        growthRate: Number(category.summary?.growthRate) || 0
      }
    }));
  } catch (error) {
    console.error('Error transforming AI response:', error);
    return [{
      name: 'General',
      keywords: [],
      summary: {
        totalVolume: 0,
        avgDifficulty: 0,
        avgCpc: 0,
        topIntent: 'Informational',
        growthRate: 0
      }
    }];
  }
} 