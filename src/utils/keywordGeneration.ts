import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Anthropic from '@anthropic-ai/sdk';
import { ModelType } from '../context/ApiKeyContext';

const KEYWORD_PROMPT = `Analyze this topic and generate a comprehensive list of keywords in these categories:

1. Main Keywords (5-10)
2. Low Competition Keywords (5-10)
3. Long Tail Keywords (10-15)
4. Related Keywords (5-10)

For each keyword, provide:
- Search volume
- Competition level
- Difficulty score
- Search intent
- CPC
- SERP features
- Trend data
- Seasonality

Return the data as a JSON array with categories. Topic: `;

export async function generateKeywordsFromNiche(
  niche: string,
  apiKey: string,
  model: ModelType
): Promise<string[]> {
  const prompt = `${KEYWORD_PROMPT}${niche}`;

  switch (model) {
    case 'chatgpt':
      return generateWithOpenAI(prompt, apiKey);
    case 'gemini':
      return generateWithGemini(prompt, apiKey);
    case 'anthropic':
      return generateWithAnthropic(prompt, apiKey);
    default:
      throw new Error('Unsupported model');
  }
}

async function generateWithOpenAI(prompt: string, apiKey: string): Promise<string[]> {
  const openai = new OpenAI({ apiKey });
  
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert SEO and keyword research specialist. Generate comprehensive keyword lists with detailed metrics."
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

    const result = JSON.parse(response.choices[0].message.content || '{"keywords": []}');
    return extractKeywords(result);
  } catch (error) {
    console.error('Failed to parse OpenAI response:', error);
    return [];
  }
}

async function generateWithGemini(prompt: string, apiKey: string): Promise<string[]> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const result = await model.generateContent({
    contents: [{ 
      role: "user", 
      parts: [{ 
        text: `You are a keyword research expert. Generate a list of relevant keywords.
        IMPORTANT: Return ONLY a JSON object in this exact format, with no markdown formatting or additional text:
        {
          "keywords": ["keyword1", "keyword2", "keyword3"]
        }
        
        Topic: ${prompt}`
      }]
    }],
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 2048,
    },
  });

  const text = result.response.text();
  
  // Clean the response text
  const cleanedText = text.replace(/```(?:json|JSON)?\s*|\s*```/g, '').trim();
  
  try {
    // Try parsing the cleaned text directly
    const parsed = JSON.parse(cleanedText);
    return parsed.keywords || [];
  } catch (parseError) {
    console.error('Failed to parse cleaned response:', parseError);
    try {
      // Try finding any JSON-like structure in the text
      const jsonMatch = text.match(/\{[\s\S]*?\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }
      const parsed = JSON.parse(jsonMatch[0]);
      return parsed.keywords || [];
    } catch (error) {
      console.error('Failed to parse Gemini response:', error);
      return [];
    }
  }
}

async function generateWithAnthropic(prompt: string, apiKey: string): Promise<string[]> {
  const anthropic = new Anthropic({ apiKey });

  const response = await anthropic.messages.create({
    model: "claude-3-opus-20240229",
    max_tokens: 1000,
    system: "You are a keyword research expert. Generate relevant keywords for the given topic. Respond with a JSON object containing a 'keywords' array.",
    messages: [
      {
        role: "user",
        content: prompt
      }
    ]
  });

  const content = response.content[0].type === 'text' ? response.content[0].text : '';
  // Clean the response text by removing markdown code blocks and extracting JSON
  const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*?\}|\[[\s\S]*?\])\s*```/);
  const jsonStr = jsonMatch ? jsonMatch[1] : content;
  
  try {
    const parsed = JSON.parse(jsonStr);
    return parsed.keywords || [];
  } catch (error) {
    console.error('Failed to parse Anthropic response:', error);
    return [];
  }
}

function extractKeywords(result: any): string[] {
  const allKeywords: string[] = [];
  
  // Extract keywords from each category
  if (result.mainKeywords) {
    allKeywords.push(...result.mainKeywords.map((k: any) => k.keyword));
  }
  if (result.lowCompetitionKeywords) {
    allKeywords.push(...result.lowCompetitionKeywords.map((k: any) => k.keyword));
  }
  if (result.longTailKeywords) {
    allKeywords.push(...result.longTailKeywords.map((k: any) => k.keyword));
  }
  if (result.relatedKeywords) {
    allKeywords.push(...result.relatedKeywords.map((k: any) => k.keyword));
  }

  return allKeywords;
}