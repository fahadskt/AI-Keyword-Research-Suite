import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface AIResponse {
  keywords: string[];
  metrics: {
    searchVolume: number;
    difficulty: number;
    cpc: number;
    competition: number;
  };
}

export const generateKeywordsWithOpenAI = async (
  apiKey: string,
  niche: string
): Promise<AIResponse> => {
  const openai = new OpenAI({ apiKey });
  
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are a keyword research expert. Generate relevant keywords and their metrics based on the given niche."
      },
      {
        role: "user",
        content: `Generate a list of relevant keywords and their metrics for the niche: ${niche}. 
        Include search volume, difficulty (0-100), CPC, and competition (0-1) for each keyword.
        Format the response as JSON.`
      }
    ],
    response_format: { type: "json_object" }
  });

  return JSON.parse(response.choices[0].message.content || '{}');
};

export const generateKeywordsWithAnthropic = async (
  apiKey: string,
  niche: string
): Promise<AIResponse> => {
  const anthropic = new Anthropic({ apiKey });
  
  const response = await anthropic.messages.create({
    model: "claude-3-opus-20240229",
    max_tokens: 1024,
    system: "You are a keyword research expert. Generate relevant keywords and their metrics based on the given niche.",
    messages: [{
      role: "user",
      content: `Generate a list of relevant keywords and their metrics for the niche: ${niche}. 
      Include search volume, difficulty (0-100), CPC, and competition (0-1) for each keyword.
      Format the response as JSON.`
    }]
  });

  const content = response.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Anthropic API');
  }
  
  return JSON.parse(content.text);
};

export const generateKeywordsWithGemini = async (
  apiKey: string,
  niche: string
): Promise<AIResponse> => {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `Generate a list of relevant keywords and their metrics for the niche: ${niche}. 
    Include search volume, difficulty (0-100), CPC, and competition (0-1) for each keyword.
    Format the response as JSON.`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  
  return JSON.parse(response.text());
};
