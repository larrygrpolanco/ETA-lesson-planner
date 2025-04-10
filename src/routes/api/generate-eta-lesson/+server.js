// src/routes/api/generate-eta-lesson/+server.js

/**
 * @file Handles the API endpoint for generating lesson plan phases using either Anthropic or DeepSeek APIs.
 * This server-side code receives lesson details, constructs prompts based on the requested phase,
 * sends these prompts to the selected LLM API, and returns the generated content.
 * Supports switching between providers via the LLM_PROVIDER environment variable.
 */

import { json } from '@sveltejs/kit';
import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai'; // Import OpenAI SDK for DeepSeek compatibility
import {
	ANTHROPIC_API_KEY,
	DEEPSEEK_API_KEY,
	LLM_PROVIDER // Read the provider choice from env
} from '$env/static/private';

// --- Constants ---
const DEEPSEEK_BASE_URL = 'https://api.deepseek.com/v1'; // Use v1 for OpenAI compatibility
const DEEPSEEK_CHAT_MODEL = 'deepseek-chat';
// Add other DeepSeek models if needed, e.g., const DEEPSEEK_REASONER_MODEL = 'deepseek-reasoner';

/**
 * POST endpoint for /api/generate-eta-lesson
 * Handles requests to generate different phases of a lesson plan using the configured LLM provider.
 *
 * @param {Object} event - SvelteKit event object containing request details.
 * @returns {Response} JSON response containing the generated content for the requested phase, or an error.
 */
export async function POST({ request }) {
	try {
		// Parse the request body as JSON
		const formData = await request.json();
		console.log('ETA formData received:', formData);

		// Extract the 'phase' header from the request
		const phaseName = request.headers.get('phase');
		if (!phaseName) {
			return json({ error: 'Phase header is missing' }, { status: 400 });
		}

		// --- Determine Provider ---
		const provider = (LLM_PROVIDER || 'anthropic').toLowerCase(); // Default to anthropic if not set

		let prompt = '';
		let model = ''; // Model will be set based on provider and phase
		let max_tokens = 200; // Default token limit

		// --- Get Form Data ---
		const topic = formData.topic || '';
		const grade = formData.grade || '';
		const duration = formData.classDuration || '';
		const coteachingModel = formData.coTeachingModel || '';
		const description = formData.classDescription || '';
		const objectives = formData.objectives || '';

		// Extract previous phase outputs if they exist
		let refinedObjectives = '';
		let activities = '';
		let components = '';

		if (formData.phases && Array.isArray(formData.phases)) {
			const objectivesPhase = formData.phases.find((p) => p.key === 'objectives');
			refinedObjectives = objectivesPhase?.content || '';
			const activitiesPhase = formData.phases.find((p) => p.key === 'activities');
			activities = activitiesPhase?.content || '';
			const componentsPhase = formData.phases.find((p) => p.key === 'components');
			components = componentsPhase?.content || '';
		}

		// --- Construct Prompt and Select Model based on Phase ---
		let anthropicModel = ''; // Temporary variable for Anthropic model selection
		let deepseekModel = DEEPSEEK_CHAT_MODEL; // Default DeepSeek model

		switch (phaseName) {
			case 'Refining Objectives':
				prompt = `As an expert English Teaching Assistant in Taiwan, you are part of a multi-step lesson planning workflow. Your role in Phase 1 is to refine raw learning objectives and provide supporting context for later phases. Improve on, but do not disregard important details in the INPUT OBJECTIVES. This is what the teacher wants to work on.

                INPUT OBJECTIVES:
                ${objectives}

                LESSON CONTEXT:
                Topic: ${topic}
                Grade Level: ${grade}
                Class Duration: ${duration}
                Co-teaching Model: ${coteachingModel}
                ${description ? `Additional Description: ${description}` : ''}

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
                - How these objectives work with the chosen co-teaching model (${coteachingModel})
                - Potential role distribution between ETA and LET

                c) Cultural Elements
                - Cultural learning opportunities within these objectives
                - Cross-cultural communication considerations

                d) Assessment Approaches
                - Ways to measure student achievement of these objectives
                - Both formal and informal assessment suggestions

                Remember: Your output will be used by subsequent phases to generate detailed lesson activities and assessments. Keep your language clear and your suggestions specific.`;

				anthropicModel = 'claude-3-haiku-20240307'; // Use Haiku for faster phases if desired
				// deepseekModel remains DEEPSEEK_CHAT_MODEL
				max_tokens = 1000;
				break;

			case 'Generating Activities':
				prompt = `As an expert English Teaching Assistant in Taiwan, you are working on Phase 2 of the lesson planning workflow. Your role is to transform the refined objectives and planning considerations from Phase 1 into a structured sequence of classroom activities.

                PHASE 1 OUTPUT:
                ${refinedObjectives ? refinedObjectives : 'No refined objectives provided'}

                LESSON CONTEXT:
                Topic: ${topic}
                Grade Level: ${grade}
                Class Duration: ${duration}
                Co-teaching Model: ${coteachingModel}
                ${description ? `Additional Description: ${description}` : ''}

                Create a detailed lesson procedure that:
                1. Builds progressively toward the lesson objectives
                2. Maintains clear connections between activities
                3. Includes informal assessment opportunities throughout
                4. Allows flexibility for teacher adaptation
                5. Keeps activities simple and broadly applicable

                Please include a timing overview:
                Time Distribution Overview
                Total Class Time: ${duration} minutes
                - Warm-up: [X] minutes
                - Introduction: [X] minutes
                - Activities: [X] minutes
                - Assessment: [X] minutes
                - Closure: [X] minutes
                - Optional Extensions [X] minutes

                Guidelines for Writing Activity Steps:
                1. Write each step as a clear action
                2. Start with the teacher action, then describe student response
                3. Keep instructions simple and direct
                4. Include approximate timing for each major step
                5. Note key transitions between activities
                6. Highlight opportunities for student interaction
                7. Include brief suggestions for informal assessment`;

				anthropicModel = 'claude-3-haiku-20240307'; // Use Haiku
				// deepseekModel remains DEEPSEEK_CHAT_MODEL
				max_tokens = 2000;
				break;

			case 'Preparing Components':
				prompt = `As an expert English Teaching Assistant in Taiwan, you are working on Phase 3 of the lesson planning workflow. Your role is to identify essential materials and create reflection questions that align with ELTP Professional Standards.

                Previous Phase Outputs:
                Objectives: ${refinedObjectives ? refinedObjectives : 'No refined objectives provided'}
                Activities: ${activities ? activities : 'No activities provided'}

                LESSON CONTEXT:
                Topic: ${topic}
                Grade Level: ${grade}
                Class Duration: ${duration}
                Co-teaching Model: ${coteachingModel}
                ${description ? `Additional Description: ${description}` : ''}

                The ELTP Standards focus on:
                1. Knowledge about Language
                2. Sociocultural Context
                3. Planning and Implementing Instruction
                4. Assessment and Evaluation
                5. Cultural Ambassador / Professionalism

                Please create these three sections:

                ### Teaching Materials
                List only essential materials needed for this lesson:
                - [Material with brief purpose]
                - [Material with brief purpose]

                ### Basic Vocabulary & Sentence Patterns
                Essential vocabulary (4-6 words max):
                - [word with simple definition]
                - [word with simple definition]

                Key sentence patterns appropriate for student level and age (2-3 only):
                - [pattern with example]
                - [pattern with example]

                ### Reflection Questions
                Create 3 focused questions that help teachers reflect on:
                1. Student learning outcomes
                2. Teaching effectiveness
                3. Cultural/language considerations

                Remember: Keep your lists concise and focused on essentials only. Your output will be used in the final phase to create a complete lesson plan.`;

				anthropicModel = 'claude-3-haiku-20240307'; // Use Haiku
				// deepseekModel remains DEEPSEEK_CHAT_MODEL
				max_tokens = 1000;
				break;

			case 'Creating Final Plan':
				prompt = `You are assisting English Teaching Assistants in Taiwan with Fulbright. This is the last phase in an AI lesson plan creation workflow. Your task in this final phase is to bring together all the previous phase outputs to create a cohesive final formatted version of this lesson plan which the teacher can use to build on or run a lesson in their class.

                Apply Universal Design for Learning (UDL) principles throughout the plan by:
                1. Including multiple means of engagement (different motivational approaches)
                2. Incorporating multiple means of representation (varied ways of presenting content)
                3. Providing multiple means of action and expression (diverse ways for students to demonstrate learning)
                4. Ensuring backward design (clear objectives drive assessment and activities)

                Context Information:
                Topic: ${topic}
                Time: ${duration}
                Grade: ${grade}
                Co-teaching Model: ${coteachingModel}
                ${description ? `Additional Description: ${description}` : ''}

                Previous Phase Outputs:
                Objectives Phase Output: ${refinedObjectives ? refinedObjectives : 'No refined objectives provided'}
                Procedures Phase Output: ${activities ? activities : 'No activities provided'}
                Components Phase Output: ${components ? components : 'No components provided'}

                Lesson Plan Template:
                    # [Topic]
                    **Grade:** [grade]
                    **Time:** [duration]

                    ## Learning Objectives
                    Students will be able to:
                    1. [objective 1]
                    2. [objective 2]

                    ## Teaching Materials
                    - [material]
                    - [material]

                    ## Basic Vocabulary & Sentence Patterns
                    **New Vocabulary:**
                    - [word in english and traditional chinese]
                    - [word in english and traditional chinese]

                    **Target Patterns:**
                    - [pattern]
                    - [pattern]

                    ## Procedures
                    ### I. Warm-up ([X] min)
                    **Objective Connection:**
                    [Brief statement connecting to objectives]

                    **Steps:**
                    1. [Clear action step 1]
                    2. [Clear action step 2]
                    3. [Clear action step 3]


                    ### II. Introduction ([X] min)
                    **Objective Connection:**
                    [Brief statement connecting to objectives]

                    **Steps:**
                    1. [Clear action step 1]
                    2. [Clear action step 2]
                    3. [Clear action step 3]

                    ### III. Main Activities ([X] min)
                    **Objective Connection:**
                    [Brief statement connecting to objectives]

                    **Steps:**
                    1. [Clear action step 1]
                    2. [Clear action step 2]
                    3. [Clear action step 3]

                    Differentiation Note:
                    - *For struggling learners:* [Specific support strategy]
                    - *For advanced learners:* [Specific extension strategy]
                    - *Multiple means of engagement:* [How activity provides options for interest]
                    - *Multiple means of representation:* [How content is presented in various ways]
                    - *Multiple means of expression* [How students can demonstrate learning differently]

                    ### IV. Assessment ([X] min)
                    **Success Criteria:**
                    - [Criterion]
                    - [Criterion]

                    **Assessment Methods** (provide at least 2 options):
                    1. [Assessment method]
                    2. [Assessment method]

                    Steps:
                    1. [Clear action step 1]
                    2. [Clear action step 2]
                    3. [Clear action step 3]

                    ### V. Closure ([X] min)
                    **Steps:**
                    1. [Clear action step 1]
                    2. [Clear action step 2]

                    **Reflection Opportunity:** [Brief description of how students reflect on learning]

                    ### VI. Optional Extensions
                    [1-3 extension activities if time permits, with at least one addressing advanced learners]

                    ## Reflection Questions for Teachers
                    1. [Question 2]
                    2. [Question 1]

                Note:
                - Ensure each activity includes at least one UDL element (engagement, representation, or expression)
                - Include differentiation strategies for diverse learners
                - Provide multiple assessment options aligned with objectives
                - Use consistent markdown formatting throughout and use numbered lists where numbered in the template.`;

				anthropicModel = 'claude-3-5-sonnet-20240620'; // Use Sonnet 3.5 for the final complex task
				// deepseekModel remains DEEPSEEK_CHAT_MODEL
				max_tokens = 4000;
				break;

			default:
				return json({ error: 'Invalid phase name' }, { status: 400 });
		}

		// Log prompt before sending
		console.log(
			`ETA Phase: ${phaseName} - Provider: ${provider} - Prompt being sent to LLM:`,
			prompt
		);

		let content = '';

		// --- Call the appropriate API based on the provider ---
		if (provider === 'deepseek') {
			if (!DEEPSEEK_API_KEY) {
				throw new Error('DEEPSEEK_API_KEY is not set in environment variables.');
			}
			// Initialize DeepSeek client (using OpenAI SDK)
			const deepseekClient = new OpenAI({
				apiKey: DEEPSEEK_API_KEY,
				baseURL: DEEPSEEK_BASE_URL
			});

			model = deepseekModel; // Assign the selected DeepSeek model

			const completion = await deepseekClient.chat.completions.create({
				model: model,
				messages: [
					// Deepseek/OpenAI generally benefits from a system prompt
					{
						role: 'system',
						content:
							'You are a helpful assistant specializing in creating educational materials for English Teaching Assistants in Taiwan.'
					},
					{ role: 'user', content: prompt }
				],
				max_tokens: max_tokens
				// Add other DeepSeek/OpenAI compatible parameters if needed (e.g., temperature)
				// temperature: 0.7,
			});

			content = completion.choices[0]?.message?.content || '';
			// Log LLM output
			console.log(`ETA Phase: ${phaseName} - DeepSeek Output:`, content);
		} else if (provider === 'anthropic') {
			if (!ANTHROPIC_API_KEY) {
				throw new Error('ANTHROPIC_API_KEY is not set in environment variables.');
			}
			// Initialize Anthropic client
			const anthropicClient = new Anthropic({
				apiKey: ANTHROPIC_API_KEY
			});

			model = anthropicModel; // Assign the selected Anthropic model

			const msg = await anthropicClient.messages.create({
				model: model,
				max_tokens: max_tokens,
				// Anthropic allows a dedicated system prompt parameter
				// system: 'You are a helpful assistant specializing in creating educational materials for English Teaching Assistants in Taiwan.',
				messages: [{ role: 'user', content: prompt }]
			});

			content = msg.content[0]?.text || '';
			// Log LLM output
			console.log(`ETA Phase: ${phaseName} - Anthropic Output:`, content);
		} else {
			return json({ error: `Unsupported LLM_PROVIDER: ${provider}` }, { status: 501 });
		}

		// --- Return the generated content ---
		return json({
			phase: {
				name: phaseName,
				content: content
			}
		});
	} catch (error) {
		console.error(`Error calling ${LLM_PROVIDER || 'LLM'} API for ETA lesson:`, error);
		const errorMessage = error instanceof Error ? error.message : String(error);
		// Try to parse potential API error details
		let details = errorMessage;
		if (error?.response?.data) {
			details = `${errorMessage} - ${JSON.stringify(error.response.data)}`;
		} else if (error?.error?.message) {
			// Structure for OpenAI/DeepSeek SDK errors
			details = error.error.message;
		} else if (error?.message) {
			// Structure for Anthropic SDK errors
			details = error.message;
		}

		return json(
			{
				error: `Failed to generate lesson plan phase using ${LLM_PROVIDER || 'LLM'}`,
				details: details
			},
			{ status: 500 }
		);
	}
}
