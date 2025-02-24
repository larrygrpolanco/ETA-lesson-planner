// src/routes/api/generate-lesson/+server.js
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
	try {
		// Get the form data from the request
		const inputData = await request.json();

		// For testing, just return the input data formatted as a lesson plan
		// Later, this will make the call to Anthropic's API
		const mockLessonPlan = {
			topic: inputData.topic,
			grade: inputData.grade,
			objectives: inputData.objectives,
			// Add more formatted data as needed
			generatedContent: 'This is where the AI-generated lesson plan will go'
		};

		// Return the mock lesson plan
		return json(mockLessonPlan);
	} catch (error) {
		return new Response(JSON.stringify({ error: error.message }), {
			status: 500,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}
}
