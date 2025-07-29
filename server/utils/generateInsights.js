const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateInsights = async (text) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `
You are a contract analysis assistant.

Analyze the following contract text and return ONLY a valid JSON object.

The JSON should have the following structure:
- riskyClauses: an array of objects each with:
  - type: One of "Auto-renewal", "Termination", "Indemnity", "Liability Limit", "Jurisdiction", or "Other"
  - text: The exact clause text
  - reason: Why it's considered risky
- summary: A concise summary of the contract
- suggestions: An array of suggestion strings

IMPORTANT: Do NOT include markdown formatting, code blocks, or extra commentary.
Just return raw JSON.

Contract Text:
"""
${text}
"""
`;

    console.log('Calling Gemini API...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const raw = response.text();

    // Clean the response to extract JSON from markdown code blocks
    let cleanedResponse = raw.trim();
    
    // Remove markdown code block formatting if present
    if (cleanedResponse.startsWith('```json')) {
      cleanedResponse = cleanedResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanedResponse.startsWith('```')) {
      cleanedResponse = cleanedResponse.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    // Try parsing the cleaned response as JSON
    let insights;
    try {
      insights = JSON.parse(cleanedResponse);
    } catch (err) {
      console.error('Error parsing Gemini JSON:', err);
      console.log('Raw response:\n', raw);
      console.log('Cleaned response:\n', cleanedResponse);
      
      // Fallback: return a basic structure
      return { 
        error: 'Failed to parse AI response.',
        riskyClauses: [],
        summary: 'Unable to analyze contract due to parsing error.',
        suggestions: [],
        riskScore: 0
      };
    }

    // Validate the structure and provide defaults if needed
    const validatedInsights = {
      riskyClauses: insights.riskyClauses || [],
      summary: insights.summary || 'No summary available.',
      suggestions: insights.suggestions || []
    };

    const riskScore = validatedInsights.riskyClauses.length;

    return {
      ...validatedInsights,
      riskScore,
    };
  } catch (error) {
    console.error('Gemini API Error:', error);
    return { 
      error: 'Error generating insights.',
      riskyClauses: [],
      summary: 'Unable to analyze contract due to API error.',
      suggestions: [],
      riskScore: 0
    };
  }
};

module.exports = generateInsights;

