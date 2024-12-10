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
  Focus on different search intents, variations, and related terms.
  Topic: ${niche}
  
  Provide the response as a JSON array of strings.`;

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
        content: "You are a keyword research expert. Generate relevant keywords for the given topic."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    response_format: { type: "json_object" }
  });

  return JSON.parse(response.choices[0].message.content || '[]').keywords;
}

async function generateWithGemini(prompt: string, apiKey: string): Promise<string[]> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }]}],
  });

  return JSON.parse(result.response.text()).keywords;
}

async function generateWithAnthropic(prompt: string, apiKey: string): Promise<string[]> {
  const anthropic = new Anthropic({ apiKey });

  const response = await anthropic.messages.create({
    model: "claude-3-opus-20240229",
    max_tokens: 1000,
    system: "You are a keyword research expert. Generate relevant keywords for the given topic.",
    messages: [
      {
        role: "user",
        content: prompt
      }
    ]
  });

  const content = response.content[0].type === 'text' ? response.content[0].text : '';
  return JSON.parse(content).keywords;
}