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

  try {
    const result = await model.generateContent({
      contents: [{ 
        role: "user", 
        parts: [{ 
          text: `Generate a list of keywords with metrics. Return ONLY a JSON object with this structure:

{
  "mainKeywords": [
    {
      "keyword": "example",
      "volume": 1000,
      "competition": "Low",
      "difficulty": 30,
      "intent": "informational",
      "cpc": 1.5,
      "serpFeatures": ["featured_snippet"],
      "trend": [100,110,120],
      "seasonality": "stable"
    }
  ],
  "lowCompetitionKeywords": [
    {
      "keyword": "example low comp",
      "volume": 500,
      "competition": "Low",
      "difficulty": 20,
      "intent": "informational",
      "cpc": 0.8,
      "serpFeatures": ["featured_snippet"],
      "trend": [50,60,70],
      "seasonality": "stable"
    }
  ],
  "longTailKeywords": [
    {
      "keyword": "example long tail",
      "volume": 200,
      "competition": "Low",
      "difficulty": 15,
      "intent": "informational",
      "cpc": 0.5,
      "serpFeatures": ["featured_snippet"],
      "trend": [20,25,30],
      "seasonality": "stable"
    }
  ],
  "relatedKeywords": [
    {
      "keyword": "example related",
      "volume": 800,
      "competition": "Medium",
      "difficulty": 40,
      "intent": "informational",
      "cpc": 1.2,
      "serpFeatures": ["featured_snippet"],
      "trend": [80,85,90],
      "seasonality": "stable"
    }
  ]
}

Topic: ${prompt}

RULES:
1. Return ONLY the JSON object above
2. No markdown formatting
3. No explanations or additional text
4. Use double quotes for strings
5. No trailing commas
6. No spaces in arrays
7. Keep property names exactly as shown
8. Numbers must be numbers, not strings`
        }]
      }],
      generationConfig: {
        temperature: 0.2,
        topK: 10,
        topP: 0.7,
        maxOutputTokens: 4000,
      },
    });

    const text = result.response.text();
    
    const cleanJSON = (input: string): string => {
      try {
        let cleaned = input.replace(/^[^{]*/, '').replace(/[^}]*$/, '');
        
        cleaned = cleaned.replace(/```[^`]*```/g, '');
        
        cleaned = cleaned
          .replace(/[\u201C\u201D]/g, '"')
          .replace(/[\r\n\t]/g, '')
          .replace(/,\s*([\]}])/g, '$1')
          .replace(/([{,])\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":')
          .replace(/:\s*'([^']*)'/g, ':"$1"')
          .replace(/,(\s*[}\]])/g, '$1')
          .replace(/\s+/g, ' ')
          .trim();

        if (!cleaned.startsWith('{') || !cleaned.endsWith('}')) {
          throw new Error('Invalid JSON structure');
        }

        return cleaned;
      } catch (error) {
        console.error('JSON cleaning error:', error);
        throw error;
      }
    };

    try {
      const cleanedJSON = cleanJSON(text);
      console.log('Cleaned JSON:', cleanedJSON);
      
      const parsed = JSON.parse(cleanedJSON);
      
      const requiredCategories = ['mainKeywords', 'lowCompetitionKeywords', 'longTailKeywords', 'relatedKeywords'];
      const missingCategories = requiredCategories.filter(cat => !Array.isArray(parsed[cat]));
      
      if (missingCategories.length > 0) {
        throw new Error(`Missing categories: ${missingCategories.join(', ')}`);
      }
      
      const requiredFields = ['keyword', 'volume', 'competition', 'difficulty', 'intent', 'cpc', 'serpFeatures', 'trend', 'seasonality'];
      
      for (const category of requiredCategories) {
        for (const item of parsed[category]) {
          const missingFields = requiredFields.filter(field => !(field in item));
          if (missingFields.length > 0) {
            throw new Error(`Missing fields in ${category}: ${missingFields.join(', ')}`);
          }
        }
      }

      return extractKeywords(parsed);
    } catch (parseError) {
      console.error('Gemini response parsing error:', parseError);
      console.error('Raw response:', text);
      return [];
    }
  } catch (error) {
    console.error('Gemini API error:', error);
    return [];
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
  
  // Helper function to safely extract keywords from each category
  const extractFromCategory = (category: any[]) => {
    if (Array.isArray(category)) {
      return category.map(k => k.keyword || '').filter(k => k);
    }
    return [];
  };

  // Extract keywords from each category
  if (result.mainKeywords) {
    allKeywords.push(...extractFromCategory(result.mainKeywords));
  }
  if (result.lowCompetitionKeywords) {
    allKeywords.push(...extractFromCategory(result.lowCompetitionKeywords));
  }
  if (result.longTailKeywords) {
    allKeywords.push(...extractFromCategory(result.longTailKeywords));
  }
  if (result.relatedKeywords) {
    allKeywords.push(...extractFromCategory(result.relatedKeywords));
  }

  return [...new Set(allKeywords)].filter(Boolean);
}