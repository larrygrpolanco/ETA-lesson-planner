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

		// Log formData for debugging
		console.log('formData received:', formData);

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
				prompt = `You are an expert English Teaching Assistant (ETA) in Taiwan, participating in a multi-step lesson planning workflow. Your task is to refine learning objectives and provide supporting context for later planning phases. Review the following input data:

                INPUT OBJECTIVES:
                ${formData.objectives}

                LESSON CONTEXT:
                Topic: ${formData.topic}
                Grade Level: ${formData.grade}
                Class Duration: ${formData.duration}
                Co-teaching Model: ${formData.coteachingModel}
                ${formData.description ? `Additional Description: ${formData.description}` : ''}

                Your response should have two parts:

                PART 1: REFINED OBJECTIVES (2-3 total)
                Create 2-3 focused, achievable objectives based on the INPUT OBJECTIVES that are:
                - Specific and measurable using clear action verbs
                - Grade-appropriate and achievable in the given time
                - Written to allow for differentiation
                - Structured as: "Students will be able to [action verb] [specific skill/knowledge] [conditions] [criteria]"

                PART 2: PLANNING CONSIDERATIONS
                Provide key information for subsequent planning phases about:
                a) Differentiation Opportunities
                - How these objectives can be modified for different proficiency levels
                - Suggested scaffolding approaches

                b) Co-teaching Integration
                - How these objectives work with the chosen co-teaching model (${formData.coteachingModel})
                - Potential role distribution between ETA and LET

                c) Cultural Elements
                - Cultural learning opportunities within these objectives
                - Cross-cultural communication considerations

                d) Assessment Approaches
                - Ways to measure student achievement of these objectives
                - Both formal and informal assessment suggestions`;
				max_tokens = 800; // Increased token limit for the detailed response
				break;
			case 'Generating Activities':
				prompt = `As an expert English Teaching Assistant in Taiwan, your task is to transform the lesson objectives into a structured sequence of classroom activities.

                LESSON DETAILS:
                - Topic: ${formData.topic}
                - Grade Level: ${formData.grade}
                - Class Duration: ${formData.classDuration} minutes
                - Co-Teaching Model: ${formData.coTeachingModel}
                - Objectives: ${formData.refinedObjectives}
                - Classroom Context: ${formData.classDescription || 'Standard classroom environment'}

                Create a detailed lesson procedure that:
                1. Builds progressively toward the lesson objectives
                2. Maintains clear connections between activities
                3. Includes informal assessment opportunities throughout
                4. Allows flexibility for teacher adaptation
                5. Keeps activities simple and broadly applicable

                Please structure your response using this format:

                ### Time Distribution Overview
                Total Class Time: ${formData.classDuration} minutes
                - Warm-up: [X] minutes
                - Introduction: [X] minutes
                - Activities: [X] minutes
                - Assessment: [X] minutes
                - Closure: [X] minutes

                ### I. Warm-up ([X] min)
                Objective Connection: [Brief statement connecting to objectives]
                Steps:
                1. [Clear action step]
                2. [Clear action step]
                3. [Clear action step]

                ### II. Introduction ([X] min)
                Objective Connection: [Brief statement connecting to objectives]
                Steps:
                1. [Clear action step]
                2. [Clear action step]
                3. [Clear action step]

                ### III. Main Activities ([X] min)
                Objective Connection: [Brief statement connecting to objectives]
                Steps:
                1. [Clear action step]
                2. [Clear action step]
                3. [Clear action step]

                Differentiation Note:
                [Brief suggestion for adapting to different ability levels]

                ### IV. Assessment ([X] min)
                Success Criteria:
                - [Criterion 1]
                - [Criterion 2]

                Steps:
                1. [Clear action step]
                2. [Clear action step]
                3. [Clear action step]

                ### V. Closure ([X] min)
                Steps:
                1. [Clear action step]
                2. [Clear action step]

                ### VI. Optional Extensions
                [1-3 extension activities if time permits]`;

				max_tokens = 1200; // Increased for comprehensive lesson plan activities
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

		// Log prompt before sending to LLM
		console.log(`Phase: ${phaseName} - Prompt being sent to LLM:`, prompt);

		// Send the prompt to the Anthropic API using the configured model and parameters.
		const msg = await anthropic.messages.create({
			model: model,
			max_tokens: max_tokens,
			messages: [{ role: 'user', content: prompt }]
		});

		// Extract the generated content from the Anthropic API response.
		let content = msg.content[0].text;

		// Log LLM output
		console.log(`Phase: ${phaseName} - LLM Output:`, content);

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
