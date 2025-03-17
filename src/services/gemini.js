/**
 * Gemini API service for generating AI responses
 */

const GEMINI_API_KEY = 'AIzaSyD8rsHKgYjf6IMJ95qTXltpEyllE4iuwKk';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// System prompt for database agent role
const SYSTEM_PROMPT = `You are a specialized database agent that helps users create SQL queries. 
Your primary role is to convert natural language requests into precise SQL queries.

Guidelines:
- Focus exclusively on generating SQL queries based on user requests
- When database schema information is provided, use it to create accurate queries
- Use standard SQL syntax that works with PostgreSQL
- Include helpful comments in the SQL to explain complex parts
- Do not engage in general conversation or provide explanations
- Your response must ONLY contain the SQL query, nothing else
- No introductory text, no explanations after the query
- If the user's request is ambiguous or illogical, create the most reasonable SQL query possible
- Always return a valid SQL query, even if you have to make assumptions

Example:
User: "Show me all customers who made a purchase last month"
Response:
-- Query to find customers with purchases in the previous month
SELECT DISTINCT c.customer_id, c.first_name, c.last_name
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
WHERE o.order_date >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
  AND o.order_date < DATE_TRUNC('month', CURRENT_DATE)
ORDER BY c.last_name, c.first_name;`;

/**
 * Generates a response from Gemini API
 * @param {string} prompt - The user's prompt
 * @param {Array} context - Optional context information (e.g., database schema)
 * @returns {Promise<string>} The generated response
 */
export const generateGeminiResponse = async (prompt, context = []) => {
  try {
    // Prepare the request payload with system prompt
    const payload = {
      contents: [{
        parts: [
          { text: SYSTEM_PROMPT },
          { text: prompt }
        ]
      }]
    };
    
    // If there's context, add it to the prompt
    if (context && context.length > 0) {
      const contextInfo = `Database Schema Information:\n${JSON.stringify(context, null, 2)}`;
      payload.contents[0].parts.push({ text: contextInfo });
    }
    
    // Make the API request
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini API error: ${errorData.error?.message || 'Unknown error'}`);
    }
    
    const data = await response.json();
    
    // Extract the generated text from the response
    if (data.candidates && data.candidates.length > 0 && 
        data.candidates[0].content && 
        data.candidates[0].content.parts && 
        data.candidates[0].content.parts.length > 0) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error('No response generated from Gemini API');
    }
  } catch (error) {
    console.error('Failed to generate Gemini response:', error);
    throw error;
  }
}; 