import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Anthropic from '@anthropic-ai/sdk';
import { ModelType } from '../context/ApiKeyContext';

export async function generateKeywordsFromNiche(
  niche: string,
  apiKey: string,
  model: ModelType
): Promise<string[]> {
  const prompt = `Generate a list of relevant keywords for the following niche or topic.
  Return ONLY a JSON object in this exact format:
  {
    "keywords": string[]
  }
  
  Topic: ${niche}`;

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
  
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are a keyword research expert. Generate relevant keywords for the given topic. Respond with a JSON object containing a 'keywords' array."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    response_format: { type: "json_object" }
  });

  try {
    const parsed = JSON.parse(response.choices[0].message.content || '{"keywords": []}');
    return parsed.keywords || [];
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