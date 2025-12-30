import { GoogleGenerativeAI } from '@google/generative-ai';
import { GOOGLE_API_KEY } from '$env/static/private';

const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);

/**
 * Generates content using the Gemini API.
 * 
 * @param {string} prompt - The prompt to send to the model.
 * @param {number} maxTokens - Maximum number of tokens to generate.
 * @param {string} [modelName='gemini-3-flash-preview'] - The model to use.
 * @returns {Promise<string>} The generated content.
 */
export async function generateContent(prompt, maxTokens, modelName = 'gemini-3-flash-preview') {
    if (!GOOGLE_API_KEY) {
        throw new Error('GOOGLE_API_KEY is not set in environment variables.');
    }

    try {
        const model = genAI.getGenerativeModel({ 
            model: modelName,
            generationConfig: {
                maxOutputTokens: maxTokens,
                temperature: 0.7,
            }
        });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        return text;
    } catch (error) {
        console.error('Gemini API Error:', error);
        throw error;
    }
}
