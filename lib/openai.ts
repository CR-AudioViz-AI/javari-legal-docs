import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

export async function convertLegalToPlain(legalText: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: `You are a legal document translator. Convert complex legal jargon into clear, plain English that anyone can understand. 
          
Rules:
1. Maintain the legal meaning and intent
2. Use simple, everyday language
3. Break down complex concepts into digestible parts
4. Explain legal terms when first mentioned
5. Keep the structure organized with clear sections
6. Preserve all important details and obligations
7. Use bullet points for lists when appropriate
8. Avoid legal jargon unless absolutely necessary, and explain it when used

Format the output in a clean, readable way with proper headings and spacing.`
        },
        {
          role: 'user',
          content: `Please convert this legal document to plain English:\n\n${legalText}`
        }
      ],
      temperature: 0.3,
      max_tokens: 4000,
    })

    return response.choices[0]?.message?.content || 'Conversion failed'
  } catch (error) {
    console.error('OpenAI conversion error:', error)
    return 'Conversion failed due to an error'
  }
}

export async function convertPlainToLegal(plainText: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: `You are a legal document drafter. Convert plain English into proper legal language with appropriate terminology and structure.
          
Rules:
1. Use appropriate legal terminology
2. Maintain formal legal structure
3. Include necessary legal clauses and provisions
4. Ensure precision and clarity
5. Follow standard legal document formatting
6. Include appropriate legal disclaimers
7. Use proper section numbering
8. Maintain professional legal tone

Format the output as a professional legal document with proper structure.`
        },
        {
          role: 'user',
          content: `Please convert this plain English text into legal language:\n\n${plainText}`
        }
      ],
      temperature: 0.3,
      max_tokens: 4000,
    })

    return response.choices[0]?.message?.content || 'Conversion failed'
  } catch (error) {
    console.error('OpenAI conversion error:', error)
    return 'Conversion failed due to an error'
  }
}

export async function extractKeyTerms(legalText: string): Promise<{
  obligations: string[]
  deadlines: string[]
  parties: string[]
  payments: string[]
  penalties: string[]
}> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'Extract key terms from legal documents and return them in JSON format.'
        },
        {
          role: 'user',
          content: `Extract the following from this legal document and return as JSON:
- obligations: Array of key obligations and responsibilities
- deadlines: Array of important dates and deadlines
- parties: Array of parties involved
- payments: Array of payment terms and amounts
- penalties: Array of penalties or consequences

Document:\n${legalText}

Return only valid JSON with these exact keys.`
        }
      ],
      temperature: 0.2,
      max_tokens: 1500,
      response_format: { type: 'json_object' }
    })

    const content = response.choices[0]?.message?.content || '{}'
    return JSON.parse(content)
  } catch (error) {
    console.error('OpenAI extraction error:', error)
    return {
      obligations: [],
      deadlines: [],
      parties: [],
      payments: [],
      penalties: []
    }
  }
}

export async function generateSummary(legalText: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'Generate a concise executive summary of legal documents in plain English.'
        },
        {
          role: 'user',
          content: `Provide a brief executive summary (3-5 paragraphs) of this legal document:\n\n${legalText}`
        }
      ],
      temperature: 0.3,
      max_tokens: 1000,
    })

    return response.choices[0]?.message?.content || 'Summary generation failed'
  } catch (error) {
    console.error('OpenAI summary error:', error)
    return 'Summary generation failed due to an error'
  }
}
