// src/routes/api/generate-lesson/+server.js
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
	try {
		// Get the form data from the request
		const inputData = await request.json();

		// Simulate phases with predetermined text and delays (for now, no actual delay in this simple version)
		const phases = [
			{
				name: 'Refining Objectives',
				content:
					'Phase 1: Refining Objectives - The AI is now refining the learning objectives to be more specific and measurable based on the input and context provided.'
			},
			{
				name: 'Generating Activities',
				content:
					'Phase 2: Generating Activities - Based on the refined objectives, the AI is now generating a set of engaging and practical activities for the lesson.'
			}
		];

		// For testing, just return the input data formatted as a lesson plan
		const mockLessonPlan = {
			topic: inputData.topic,
			grade: inputData.grade,
			objectives: inputData.objectives,
			generatedContent: 'This is where the AI-generated lesson plan will go'
		};

		// Return the phases and the mock lesson plan
		return json({
			phases: phases,
			finalLessonPlan: mockLessonPlan
		});
	} catch (error) {
		return new Response(JSON.stringify({ error: error.message }), {
			status: 500,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}
}
