// src/routes/api/generate-emi-lesson/+server.js

/**
 * @file Handles the API endpoint for generating EMI workshop plan phases using either Anthropic or DeepSeek APIs.
 * This server-side code receives workshop details, constructs prompts based on the requested phase,
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

// --- Client Initialization ---
// We initialize clients conditionally later based on the provider selected

// --- Constants ---
const DEEPSEEK_BASE_URL = 'https://api.deepseek.com/v1'; // Use v1 for OpenAI compatibility
const DEEPSEEK_CHAT_MODEL = 'deepseek-chat';
// Add other DeepSeek models if needed, e.g., const DEEPSEEK_REASONER_MODEL = 'deepseek-reasoner';

/**
 * POST endpoint for /api/generate-emi-lesson
 * Handles requests to generate different phases of an EMI workshop plan using the configured LLM provider.
 *
 * @param {Object} event - SvelteKit event object containing request details.
 * @returns {Response} JSON response containing the generated content for the requested phase, or an error.
 */
export async function POST({ request }) {
	try {
		// Parse the request body as JSON
		const formData = await request.json();
		console.log('EMI formData received:', formData);

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
		// (Keep your existing formData extraction logic)
		const topic = formData.topic || '';
		const audience = formData.audience || 'University Students';
		const duration = formData.workshopDuration || '';
		const participantCount = formData.participantCount || '';
		const workshopContext = formData.workshopContext || '';
		const objectives = formData.objectives || '';

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
		// (Keep your existing prompt construction logic within the switch)
		// We will set the `model` variable inside the switch based on the provider

		let anthropicModel = ''; // Temporary variable for Anthropic model selection
		let deepseekModel = DEEPSEEK_CHAT_MODEL; // Default DeepSeek model

		switch (phaseName) {
			case 'Refining Objectives':
				prompt = `As an expert English as a Medium of Instruction (EMI) Advisor in Taiwan, you are part of a multi-step workshop planning workflow. Your role in Phase 1 is to refine raw learning objectives and provide supporting context for later phases. Improve on, but do not disregard important details in the INPUT OBJECTIVES. This is what the workshop facilitator wants to work on.

                INPUT OBJECTIVES:
                ${objectives}

                WORKSHOP CONTEXT:
                Topic: ${topic}
                Target Audience: ${audience}
                Workshop Duration: ${duration}
                Number of Participants: ${participantCount}
                ${workshopContext ? `Additional Context: ${workshopContext}` : ''}

                Your response should have two parts:

                PART 1: REFINED OBJECTIVES (2-3 total)
                Create 2-3 focused, achievable objectives based on the INPUT OBJECTIVES that are:
                - Specific and measurable using clear action verbs
                - Appropriate for the target audience and achievable in the given time
                - Written to allow for different participation styles
                - Structured as: "Participants will be able to [action verb] [specific skill/knowledge] [conditions] [criteria]"

                PART 2: PLANNING CONSIDERATIONS
                Provide key information for subsequent planning phases about:
                a) Differentiation Opportunities
                - How these objectives can be modified for different proficiency levels
                - Suggested scaffolding approaches

                b) Interactive Elements
                - How to make these objectives work with a large group (${participantCount} participants)
                - Potential small group activities and collaboration opportunities

                c) Cultural Elements
                - Cultural learning opportunities within these objectives
                - Cross-cultural communication considerations for Taiwan context

                d) Assessment Approaches
                - Ways to measure participant achievement of these objectives
                - Both formal and informal assessment suggestions appropriate for a workshop setting

                Remember: Your output will be used by subsequent phases to generate detailed workshop activities and assessments. Keep your language clear and your suggestions specific.`;

				anthropicModel = 'claude-3-haiku-20240307'; // Use Haiku for faster phases if desired
				// deepseekModel remains DEEPSEEK_CHAT_MODEL
				max_tokens = 1000;
				break;

			case 'Designing Activities':
				prompt = `As an expert English as a Medium of Instruction (EMI) Advisor in Taiwan, you are working on Phase 2 of the workshop planning workflow. Your role is to transform the refined objectives and planning considerations from Phase 1 into a structured sequence of interactive workshop activities.

                PHASE 1 OUTPUT:
                ${refinedObjectives ? refinedObjectives : 'No refined objectives provided'}

                WORKSHOP CONTEXT:
                Topic: ${topic}
                Target Audience: ${audience}
                Workshop Duration: ${duration}
                Number of Participants: ${participantCount}
                ${workshopContext ? `Additional Context: ${workshopContext}` : ''}

                Create a detailed workshop procedure that:
                1. Builds progressively toward the workshop objectives
                2. Maintains clear connections between activities
                3. Includes plenty of interactive elements and icebreakers
                4. Allows flexibility for facilitator adaptation
                5. Works effectively with larger groups (${participantCount} participants)
                6. Incorporates both individual and group activities
                7. Provides opportunities for active learning and participation

                Please include a timing overview:
                Time Distribution Overview
                Total Workshop Time: ${duration} minutes
                - Welcome & Icebreaker: [X] minutes
                - Introduction & Objectives: [X] minutes
                - Interactive Activities: [X] minutes
                - Group Work: [X] minutes
                - Reflection & Discussion: [X] minutes
                - Conclusion: [X] minutes

                Guidelines for Writing Activity Steps:
                1. Write each step as a clear action
                2. Start with the facilitator action, then describe participant response
                3. Keep instructions simple and direct
                4. Include approximate timing for each major step
                5. Note key transitions between activities
                6. Highlight opportunities for participant interaction
                7. Include brief suggestions for checking understanding`;

				anthropicModel = 'claude-3-haiku-20240307'; // Use Haiku
				// deepseekModel remains DEEPSEEK_CHAT_MODEL
				max_tokens = 2000;
				break;

			case 'Creating Interactive Elements':
				prompt = `As an expert English as a Medium of Instruction (EMI) Advisor in Taiwan, you are working on Phase 3 of the workshop planning workflow. Your role is to identify essential materials and create interactive elements that will engage all participants.

                Previous Phase Outputs:
                Objectives: ${refinedObjectives ? refinedObjectives : 'No refined objectives provided'}
                Activities: ${activities ? activities : 'No activities provided'}

                WORKSHOP CONTEXT:
                Topic: ${topic}
                Target Audience: ${audience}
                Workshop Duration: ${duration}
                Number of Participants: ${participantCount}
                ${workshopContext ? `Additional Context: ${workshopContext}` : ''}

                Please create these three sections:

                ### Workshop Materials
                List essential materials needed for this workshop:
                - [Material with brief purpose]
                - [Material with brief purpose]
                (Include digital tools, handouts, multimedia resources, etc.)

                ### Interactive Elements
                Design 3-4 specific interactive elements that will engage participants of various English levels:

                1. [Name of Interactive Element]
                   - Purpose: [Brief description of learning purpose]
                   - Setup: [How to set up the activity]
                   - Procedure: [Step-by-step instructions]
                   - Variations: [How to adapt for different proficiency levels]

                2. [Name of Interactive Element]
                   - Purpose: [Brief description of learning purpose]
                   - Setup: [How to set up the activity]
                   - Procedure: [Step-by-step instructions]
                   - Variations: [How to adapt for different proficiency levels]

                Focus on activities that:
                - Maximize participation from all ${participantCount} participants
                - Allow for both individual and group work
                - Create opportunities for language practice
                - Accommodate different proficiency levels
                - Can be implemented with minimal preparation

                ### Reflection Questions
                Create 3 focused questions that help facilitators reflect on:
                1. Participant engagement and learning outcomes
                2. Workshop effectiveness and flow
                3. Cultural/language considerations for future workshops

                Remember: Keep your suggestions practical and appropriate for the audience and workshop duration. Your output will be used in the final phase to create a complete workshop plan.`;

				anthropicModel = 'claude-3-haiku-20240307'; // Use Haiku
				// deepseekModel remains DEEPSEEK_CHAT_MODEL
				max_tokens = 1500;
				break;

			case 'Finalizing Workshop Plan':
				prompt = `You are assisting English as a Medium of Instruction (EMI) Advisors in Taiwan with Fulbright. This is the last phase in an AI workshop plan creation workflow. Your task in this final phase is to bring together all the previous phase outputs to create a cohesive final formatted version of this workshop plan which the facilitator can use to conduct an effective session.

                Apply principles of effective workshop design throughout the plan by:
                1. Including multiple engagement strategies (different motivational approaches)
                2. Incorporating varied presentation methods (diverse ways of presenting content)
                3. Providing multiple means of participation (different ways for participants to engage)
                4. Ensuring backward design (clear objectives drive activities and assessment)
                5. Building in opportunities for interaction among participants

                Context Information:
                Topic: ${topic}
                Duration: ${duration}
                Target Audience: ${audience}
                Number of Participants: ${participantCount}
                ${workshopContext ? `Additional Context: ${workshopContext}` : ''}

                Previous Phase Outputs:
                Objectives Phase Output: ${refinedObjectives ? refinedObjectives : 'No refined objectives provided'}
                Activities Phase Output: ${activities ? activities : 'No activities provided'}
                Interactive Elements Phase Output: ${components ? components : 'No components provided'}

                Workshop Plan Template:
                    # ${topic} Workshop Plan
                    **Target Audience:** ${audience}
                    **Duration:** ${duration}
                    **Number of Participants:** ${participantCount}

                    ## Workshop Objectives
                    By the end of this workshop, participants will be able to:
                    1. [objective 1]
                    2. [objective 2]

                    ## Workshop Materials
                    - [material]
                    - [material]

                    ## Workshop Structure

                    ### I. Welcome & Icebreaker ([X] min)
                    **Purpose:**
                    [Brief statement of purpose]

                    **Activity Description:**
                    [Describe the icebreaker activity]

                    **Steps:**
                    1. [Clear action step 1]
                    2. [Clear action step 2]
                    3. [Clear action step 3]

                    ### II. Introduction & Objectives ([X] min)
                    **Purpose:**
                    [Brief statement of purpose]

                    **Steps:**
                    1. [Clear action step 1]
                    2. [Clear action step 2]
                    3. [Clear action step 3]

                    ### III. Main Activities ([X] min)
                    **Activity 1: [Name]** ([X] min)
                    - **Purpose:** [Brief description of learning purpose]
                    - **Setup:** [How to set up the activity]
                    - **Steps:**
                      1. [Clear action step 1]
                      2. [Clear action step 2]
                      3. [Clear action step 3]
                    - **Facilitation Notes:**
                      - For lower proficiency participants: [Specific support strategy]
                      - For higher proficiency participants: [Specific extension strategy]

                    **Activity 2: [Name]** ([X] min)
                    - **Purpose:** [Brief description of learning purpose]
                    - **Setup:** [How to set up the activity]
                    - **Steps:**
                      1. [Clear action step 1]
                      2. [Clear action step 2]
                      3. [Clear action step 3]
                    - **Facilitation Notes:**
                      - For lower proficiency participants: [Specific support strategy]
                      - For higher proficiency participants: [Specific extension strategy]

                    ### IV. Group Work & Application ([X] min)
                    **Activity Description:**
                    [Describe the group work activity]

                    **Steps:**
                    1. [Clear action step 1]
                    2. [Clear action step 2]
                    3. [Clear action step 3]

                    **Success Indicators:**
                    - [Indicator]
                    - [Indicator]

                    ### V. Reflection & Discussion ([X] min)
                    **Questions for Reflection:**
                    1. [Question 1]
                    2. [Question 2]
                    3. [Question 3]

                    **Facilitation Approach:**
                    [Brief description of how to facilitate this discussion]

                    ### VI. Conclusion & Next Steps ([X] min)
                    **Summary Points:**
                    - [Key point 1]
                    - [Key point 2]
                    - [Key point 3]

                    **Action Items for Participants:**
                    1. [Action item 1]
                    2. [Action item 2]

                    ## Facilitator Notes
                    **Preparation Checklist:**
                    - [Preparation item 1]
                    - [Preparation item 2]

                    **Potential Challenges & Solutions:**
                    - **Challenge:** [Potential challenge]
                      **Solution:** [Suggested solution]
                    - **Challenge:** [Potential challenge]
                      **Solution:** [Suggested solution]

                    **Reflection Questions for Facilitators:**
                    1. [Question 1]
                    2. [Question 2]
                    3. [Question 3]

                Note:
                - Ensure each activity includes opportunities for all participants to engage
                - Include strategies for managing a large group of ${participantCount} participants
                - Provide clear facilitation notes to help the workshop run smoothly
                - Use consistent markdown formatting throughout and use numbered lists where indicated in the template.`;

				anthropicModel = 'claude-3-5-sonnet-20240620'; // Use Sonnet 3.5 for the final complex task
				// deepseekModel remains DEEPSEEK_CHAT_MODEL
				max_tokens = 4000;
				break;

			default:
				return json({ error: 'Invalid phase name' }, { status: 400 });
		}

		// Log prompt before sending
		console.log(
			`EMI Phase: ${phaseName} - Provider: ${provider} - Prompt being sent to LLM:`,
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
				messages: [{ role: 'user', content: prompt }],
				max_tokens: max_tokens
				// Add other DeepSeek/OpenAI compatible parameters if needed (e.g., temperature)
				// temperature: 0.7,
			});

			content = completion.choices[0]?.message?.content || '';
			// Log LLM output
			console.log(`EMI Phase: ${phaseName} - DeepSeek Output:`, content);
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
				messages: [{ role: 'user', content: prompt }]
				// Add other Anthropic specific parameters if needed (e.g., system prompt)
			});

			content = msg.content[0]?.text || '';
			// Log LLM output
			console.log(`EMI Phase: ${phaseName} - Anthropic Output:`, content);
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
		console.error(`Error calling ${LLM_PROVIDER || 'LLM'} API for EMI workshop:`, error);
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
				error: `Failed to generate workshop plan phase using ${LLM_PROVIDER || 'LLM'}`,
				details: details
			},
			{ status: 500 }
		);
	}
}
