import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';

const cleanJsonResponse = (text: string): string => {
  // Remove markdown code block markers, JSON prefix, and any surrounding whitespace
  const cleaned = text
    .replace(/```[a-z]*|```/g, '') // Remove code block markers
    .replace(/^JSON\s*/, '') // Remove "JSON" prefix
    .replace(/^\s*\{/, '{') // Ensure clean object start
    .trim();
  
  // For debugging
  console.log('Cleaned JSON:', cleaned);
  return cleaned;
};

export const generateKeywordsWithOpenAI = async (
  apiKey: string,
  niche: string
): Promise<string[]> => {
  try {
    const openai = new OpenAI({ apiKey });
  
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a keyword research expert. Generate a list of relevant keywords based on the given niche. Return only a JSON array of strings."
        },
        {
          role: "user",
          content: `Generate a list of relevant keywords for the niche: ${niche}. Include questions people might ask about this topic.`
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || '{"keywords":[]}');
    return result.keywords || [];
  } catch (error) {
    console.error('Error generating keywords with OpenAI:', error);
    return [];
  }
};

export const generateKeywordsWithAnthropic = async (
  apiKey: string,
  niche: string
): Promise<string[]> => {
  try {
    const anthropic = new Anthropic({ apiKey });
  
    const response = await anthropic.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 1024,
      system: "You are a keyword research expert. Generate a list of relevant keywords based on the given niche. Return only a JSON array of strings.",
      messages: [{
        role: "user",
        content: `Generate a list of relevant keywords for the niche: ${niche}. Include questions people might ask about this topic.`
      }]
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Anthropic API');
    }
  
    const cleanedJson = cleanJsonResponse(content.text);
    try {
      const result = JSON.parse(cleanedJson);
      return result.keywords || [];
    } catch (parseError) {
      console.error('Failed to parse Anthropic response:', cleanedJson);
      console.error('Parse error:', parseError);
      return [];
    }
  } catch (error) {
    console.error('Error generating keywords with Anthropic:', error);
    return [];
  }
};

export const generateKeywordsWithGemini = async (
  apiKey: string,
  niche: string
): Promise<string[]> => {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Generate a list of relevant keywords for the niche: ${niche}. 
      Include questions people might ask about this topic.
      Return a JSON object in this exact format without any explanation or prefix:
      {
        "keywords": ["keyword1", "keyword2", ...]
      }`;

    const result = await model.generateContent(prompt);
    const response = result.response;
  
    // For debugging
    console.log('Raw Gemini response:', response.text());
    
    const cleanedJson = cleanJsonResponse(response.text());
    try {
      const parsed = JSON.parse(cleanedJson);
      return parsed.keywords || [];
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', cleanedJson);
      console.error('Parse error:', parseError);
      return [];
    }
  } catch (error) {
    console.error('Error generating keywords with Gemini:', error);
    return [];
  }
};
