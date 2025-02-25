// src/routes/api/generate-lesson/+server.js

/**
 * @file Handles the API endpoint for generating lesson plan phases using Anthropic's API.
 * This server-side code is responsible for receiving lesson details from the frontend,
 * constructing prompts for Anthropic's models based on the requested phase (e.g., refining objectives,
 * generating activities), sending these prompts to the Anthropic API, and returning the generated content.
 * It uses environment variables to securely access the Anthropic API key.
 */

import { json } from '@sveltejs/kit'; // Utility for creating JSON responses in SvelteKit
import Anthropic from '@anthropic-ai/sdk'; // Anthropic SDK for interacting with the Anthropic API
import { ANTHROPIC_API_KEY } from '$env/static/private'; // Securely import API key from environment variables

// Initialize the Anthropic client with the API key.
// This is done outside the POST function for efficiency, as it only needs to be initialized once.
const anthropic = new Anthropic({
	apiKey: ANTHROPIC_API_KEY
});

/**
 * POST endpoint for /api/generate-lesson
 * Handles requests to generate different phases of a lesson plan.
 *
 * @param {Object} event - SvelteKit event object containing request details.
 * @returns {Response} JSON response containing the generated content for the requested phase, or an error.
 */
export async function POST({ request }) {
	try {
		// Parse the request body as JSON. This should contain the lesson details from the form.
		const formData = await request.json();

		// Extract the 'phase' header from the request. This indicates which phase of the lesson plan to generate.
		const phaseName = request.headers.get('phase');

		// Check if the 'phase' header is present. If not, return a 400 error.
		if (!phaseName) {
			return json({ error: 'Phase header is missing' }, { status: 400 });
		}

		let prompt = ''; // Variable to hold the prompt for the Anthropic API
		let model = 'claude-3-5-sonnet-20241022'; // Default Anthropic model (Sonnet - balanced speed and quality)
		let max_tokens = 200; // Default maximum tokens for the response (adjust per phase as needed)

		// Construct the prompt and adjust model parameters based on the requested phase.
		switch (phaseName) {
			case 'Refining Objectives':
				prompt = `Refine the following learning objectives for a lesson plan. Grade Level: ${formData.grade}, Topic: ${formData.topic}, Objectives: ${formData.objectives}.  Make them more specific, measurable, achievable, relevant, and time-bound (SMART). Return only the refined objectives This is a test return random.`;
				max_tokens = 300; // Increased tokens for potentially longer refined objectives
				break;
			case 'Generating Activities':
				prompt = `Generate a list of engaging and varied activities for a lesson plan on ${formData.topic} for Grade ${formData.grade}. Class duration is ${formData.classDuration}. Co-teaching model is ${formData.coTeachingModel}. Learning objectives are: ${formData.objectives}. Consider the classroom context: ${formData.classDescription}.  Provide activities suitable for this context and objectives. This is a test return random activities in mark down.`;
				max_tokens = 500; // Increased tokens for generating multiple activities
				break;
			case 'Preparing Components':
				prompt = `Based on the lesson topic: ${formData.topic}, grade level: ${formData.grade}, and learning objectives: ${formData.objectives}, suggest necessary components for the lesson plan. Components could include materials, assessments, differentiation strategies, etc. This is a test return random.`;
				max_tokens = 400;
				break;
			case 'Creating Final Plan':
				prompt = `Create a complete lesson plan based on the following details:
                Topic: ${formData.topic}
                Grade Level: Grade ${formData.grade}
                Class Duration: ${formData.classDuration}
                Co-teaching Model: ${formData.coTeachingModel}
                Learning Objectives: ${formData.objectives}
                Classroom Context: ${formData.classDescription}

                This is a test return random in markdown with a joke at the end`;
				max_tokens = 1024; // Significantly increased tokens for the final, detailed lesson plan
				model = 'claude-3-opus-20240229'; // Opus model for higher quality final plan generation
				break;
			default:
				// If the phase name is not recognized, return a 400 error.
				return json({ error: 'Invalid phase name' }, { status: 400 });
		}

		// Send the prompt to the Anthropic API using the configured model and parameters.
		const msg = await anthropic.messages.create({
			model: model,
			max_tokens: max_tokens,
			messages: [{ role: 'user', content: prompt }]
		});

		// Extract the generated content from the Anthropic API response.
		let content = msg.content[0].text;

		// Return the generated content in a JSON response, including the phase name for frontend processing.
		return json({
			phase: {
				name: phaseName,
				content: content // The generated content for this phase
			}
		});
	} catch (error) {
		// Handle any errors that occur during the API call or processing.
		console.error('Error calling Anthropic API:', error); // Log the error to the server console for debugging
		return json(
			{ error: 'Failed to generate lesson plan phase', details: error.message }, // Return a 500 error with a user-friendly message and error details
			{ status: 500 }
		);
	}
}
