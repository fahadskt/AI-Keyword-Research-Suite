import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Anthropic from '@anthropic-ai/sdk';
import { ModelType } from '../context/ApiKeyContext';
import { KeywordCategory } from '../types';
import { CompetitorAnalysis, ContentStrategy, MarketTrends } from '../types/analysis';

// Create a function to generate the analysis prompt
function createAnalysisPrompt(categories: KeywordCategory[]): string {
  return `Analyze these keywords and provide a comprehensive SEO and content strategy analysis.
  Return a detailed JSON response with the following structure:

  {
    "competitorAnalysis": {
      "topCompetitors": [
        {
          "domain": "example.com",
          "strengths": ["Strong brand authority", "High-quality content"],
          "weaknesses": ["Poor mobile optimization", "Slow load times"],
          "contentGaps": ["Missing beginner tutorials", "No video content"],
          "rankingKeywords": ["main keyword", "secondary keyword"],
          "marketShare": 25
        }
      ],
      "competitiveLandscape": {
        "difficultyLevel": "Medium",
        "entryBarriers": ["High content quality requirements", "Strong existing brands"],
        "opportunities": ["Underserved mobile market", "Video content gap"],
        "threats": ["Increasing ad costs", "New competitors"]
      }
    },
    "contentStrategy": {
      "recommendedTopics": [
        {
          "topic": "Beginner's Guide to SEO",
          "type": "Long-form Guide",
          "estimatedImpact": 85,
          "targetKeywords": ["seo basics", "seo for beginners"],
          "outline": [
            "What is SEO?",
            "Key ranking factors",
            "On-page optimization"
          ],
          "recommendedAngle": "Focus on practical examples and case studies"
        }
      ],
      "contentCalendar": [
        {
          "month": "January 2024",
          "focus": "SEO Fundamentals",
          "topics": ["Keyword Research", "On-page SEO"],
          "goals": ["Increase organic traffic by 20%", "Generate 50 backlinks"]
        }
      ],
      "contentTypes": [
        {
          "type": "How-to Guides",
          "effectiveness": 85,
          "recommendedFrequency": "2 per week",
          "bestPractices": [
            "Include step-by-step instructions",
            "Add visual aids"
          ]
        }
      ]
    },
    "marketTrends": {
      "emergingTopics": [
        {
          "topic": "AI in SEO",
          "growthRate": 150,
          "predictedPeak": "Q4 2024",
          "relevance": 90
        }
      ],
      "seasonalOpportunities": [
        {
          "season": "Holiday Season",
          "keywords": ["christmas seo", "holiday marketing"],
          "peakMonths": ["November", "December"],
          "recommendedPreparation": "Start content creation 3 months ahead"
        }
      ],
      "industryShifts": [
        {
          "trend": "Mobile-first Indexing",
          "impact": 85,
          "actionItems": [
            "Optimize for mobile devices",
            "Improve page speed"
          ],
          "timeframe": "Next 6 months"
        }
      ]
    }
  }

  Analyze the following keywords and categories to provide actionable insights:
  ${JSON.stringify(categories, null, 2)}

  Important:
  1. Provide realistic metrics and data
  2. Include specific, actionable recommendations
  3. Base insights on current SEO trends and best practices
  4. Consider search intent and user behavior
  5. Include competitive analysis based on the niche
  6. Provide detailed content strategy recommendations`;
}

export async function analyzeKeywordOpportunities(
  categories: KeywordCategory[],
  apiKey: string,
  model: ModelType
): Promise<{
  competitorAnalysis: CompetitorAnalysis;
  contentStrategy: ContentStrategy;
  marketTrends: MarketTrends;
}> {
  const analysisPrompt = createAnalysisPrompt(categories);

  switch (model) {
    case 'chatgpt':
      return analyzeWithOpenAI(analysisPrompt, apiKey);
    case 'gemini':
      return analyzeWithGemini(analysisPrompt, apiKey);
    case 'anthropic':
      return analyzeWithAnthropic(analysisPrompt, apiKey);
    default:
      throw new Error('Unsupported model');
  }
}

async function analyzeWithOpenAI(prompt: string, apiKey: string) {
  const openai = new OpenAI({ apiKey });
  
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert SEO analyst and content strategist. Provide detailed, actionable insights based on data analysis."
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
    validateAnalysisResponse(result);
    return result;
  } catch (error) {
    console.error('OpenAI analysis error:', error);
    return getDefaultAnalysis();
  }
}

function validateAnalysisResponse(response: any) {
  const requiredSections = ['competitorAnalysis', 'contentStrategy', 'marketTrends'];
  const missingFields = requiredSections.filter(field => !response[field]);
  
  if (missingFields.length > 0) {
    console.error('Missing required fields in analysis:', missingFields);
    throw new Error('Incomplete analysis response');
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