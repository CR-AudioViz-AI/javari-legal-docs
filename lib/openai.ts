import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ConversionResult {
  convertedText: string;
  keyTerms: Array<{ term: string; explanation: string }>;
  criticalPoints: string[];
  questions: string[];
  tokensUsed: number;
}

export interface VerificationResult {
  score: number;
  thoroughness: string;
  missingElements: string[];
  suggestions: string[];
  tokensUsed: number;
}

export async function convertLegalToPlain(legalText: string): Promise<ConversionResult> {
  const prompt = `You are a professional legal translator. Convert the following legal document into plain English that anyone can understand. Maintain all important details and obligations.

CRITICAL INSTRUCTIONS:
1. Use simple, everyday language
2. Break down complex legal terms
3. Explain what each clause actually means in practice
4. Preserve all dates, names, amounts, and obligations
5. Keep the same structure but make it readable
6. Identify key terms and provide explanations
7. Highlight critical points
8. Generate clarifying questions if anything is ambiguous

Legal Document:
${legalText}

Respond in JSON format:
{
  "convertedText": "plain English version here",
  "keyTerms": [{"term": "legal term", "explanation": "what it means"}],
  "criticalPoints": ["important obligation 1", "important obligation 2"],
  "questions": ["clarifying question 1", "clarifying question 2"]
}`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
    max_tokens: 4000,
  });

  const content = response.choices[0].message.content || '{}';
  const result = JSON.parse(content);
  
  return {
    ...result,
    tokensUsed: response.usage?.total_tokens || 0,
  };
}

export async function convertPlainToLegal(plainText: string): Promise<ConversionResult> {
  const prompt = `You are a professional legal document drafter. Convert the following plain English text into proper legal language and format.

CRITICAL INSTRUCTIONS:
1. Use appropriate legal terminology
2. Structure with proper legal formatting (numbered clauses, sections)
3. Include necessary legal boilerplate
4. Ensure all terms are precisely defined
5. Add standard legal protections and disclaimers
6. Make it enforceable and professionally drafted
7. Identify key legal terms used
8. Note critical obligations

Plain Text:
${plainText}

Respond in JSON format:
{
  "convertedText": "legal document version here",
  "keyTerms": [{"term": "legal term", "explanation": "what it means"}],
  "criticalPoints": ["important clause 1", "important clause 2"],
  "questions": ["question if clarification needed 1", "question 2"]
}`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
    max_tokens: 4000,
  });

  const content = response.choices[0].message.content || '{}';
  const result = JSON.parse(content);
  
  return {
    ...result,
    tokensUsed: response.usage?.total_tokens || 0,
  };
}

export async function verifyThoroughness(documentText: string, conversionType: string): Promise<VerificationResult> {
  const prompt = `You are a legal document verification expert. Analyze the following ${conversionType} document for thoroughness and completeness.

Check for:
1. All parties clearly identified
2. Dates and deadlines specified
3. Payment terms clear
4. Obligations defined
5. Termination clauses
6. Dispute resolution
7. Governing law
8. Signatures section

Document:
${documentText}

Respond in JSON format with a score from 0-100:
{
  "score": 85,
  "thoroughness": "description of completeness",
  "missingElements": ["element 1", "element 2"],
  "suggestions": ["suggestion 1", "suggestion 2"]
}`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.2,
    max_tokens: 1000,
  });

  const content = response.choices[0].message.content || '{}';
  const result = JSON.parse(content);
  
  return {
    ...result,
    tokensUsed: response.usage?.total_tokens || 0,
  };
}

export { openai };
