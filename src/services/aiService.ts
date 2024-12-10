import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Anthropic from '@anthropic-ai/sdk';
import { ModelType } from '../context/ApiKeyContext';
import { KeywordCategory } from '../types';

const PROMPTS = {
  KEYWORD_GENERATION: `Analyze the following topic and generate relevant keywords. For each keyword, provide:
  - Monthly search volume estimate
  - Competition level
  - Difficulty score
  - User intent
  - Related topics
  Format the response as structured data.
  Topic:`,

  CONTENT_SUGGESTIONS: `Based on these keywords, suggest content ideas with:
  - Content type
  - Title
  - Target audience
  - Estimated impact
  Format as structured data.
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
  
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are a SEO and keyword research expert. Provide detailed keyword analysis with realistic metrics."
      },
      {
        role: "user",
        content: `${PROMPTS.KEYWORD_GENERATION} ${topic}`
      }
    ],
    response_format: { type: "json_object" }
  });

  const result = JSON.parse(response.choices[0].message.content || '{}');
  return transformAIResponseToCategories(result);
}

async function generateWithGemini(topic: string, apiKey: string): Promise<KeywordCategory[]> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: `${PROMPTS.KEYWORD_GENERATION} ${topic}` }]}],
  });

  const response = result.response;
  const text = response.text();
  return transformAIResponseToCategories(JSON.parse(text));
}

async function generateWithAnthropic(topic: string, apiKey: string): Promise<KeywordCategory[]> {
  const anthropic = new Anthropic({ apiKey });

  const response = await anthropic.messages.create({
    model: "claude-3-opus-20240229",
    max_tokens: 4000,
    system: "You are a SEO and keyword research expert. Provide detailed keyword analysis with realistic metrics.",
    messages: [
      {
        role: "user",
        content: `${PROMPTS.KEYWORD_GENERATION} ${topic}`
      }
    ]
  });

  const content = response.content[0].type === 'text' ? response.content[0].text : '';
  const result = JSON.parse(content);
  return transformAIResponseToCategories(result);
}

function transformAIResponseToCategories(aiResponse: any): KeywordCategory[] {
  // Transform the AI response into the expected KeywordCategory format
  // This will need to be adapted based on the actual response structure
  return aiResponse.categories.map((category: any) => ({
    name: category.name,
    keywords: category.keywords.map((kw: any) => ({
      keyword: kw.term,
      volume: kw.volume,
      competition: kw.competition,
      difficulty: kw.difficulty,
      opportunity: kw.opportunity,
      cpc: kw.cpc,
      intent: kw.intent,
      serp_features: kw.serpFeatures,
      trend: kw.trend,
      seasonality: kw.seasonality,
      ranking_difficulty: kw.rankingDifficulty,
      competitors: kw.competitors,
      contentGap: kw.contentGap,
      searchIntent: kw.searchIntent,
      performance: kw.performance,
      localMetrics: kw.localMetrics
    })),
    summary: {
      totalVolume: category.summary.totalVolume,
      avgDifficulty: category.summary.avgDifficulty,
      avgCpc: category.summary.avgCpc,
      topIntent: category.summary.topIntent,
      growthRate: category.summary.growthRate
    }
  }));
} 