// verify_gemini.js
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

if (!GOOGLE_API_KEY) {
  console.error('Error: GOOGLE_API_KEY is not set in .env');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);

async function verify() {
  console.log('Verifying Gemini API connectivity...');
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });
    const result = await model.generateContent('Say hello and confirm you are gemini-3-flash-preview');
    const response = await result.response;
    console.log('Success! Gemini response:', response.text());
  } catch (error) {
    console.error('Gemini API Error:', error.message);
    process.exit(1);
  }
}

verify();
