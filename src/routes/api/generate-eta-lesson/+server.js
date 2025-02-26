// src/routes/api/generate-lesson/+server.js

/**
 * @file Handles the API endpoint for generating lesson plan phases using Anthropic's API.
 * This server-side code is responsible for receiving lesson details from the frontend,
 * constructing prompts for Anthropic's models based on the requested phase, sending these prompts
 * to the Anthropic API, and returning the generated content. It supports a multi-phase
 * lesson planning workflow where outputs from previous phases inform subsequent phases.
 */

import { json } from '@sveltejs/kit';
import Anthropic from '@anthropic-ai/sdk';
import { ANTHROPIC_API_KEY } from '$env/static/private';

// Initialize the Anthropic client with the API key
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
		// Parse the request body as JSON
		const formData = await request.json();
		console.log('formData received:', formData);

		// Extract the 'phase' header from the request
		const phaseName = request.headers.get('phase');
		if (!phaseName) {
			return json({ error: 'Phase header is missing' }, { status: 400 });
		}

		let prompt = '';
		let model = 'claude-3-5-sonnet-20241022'; // Default model
		let max_tokens = 200; // Default token limit

		// Construct the prompt based on the requested phase
		switch (phaseName) {
			case 'Refining Objectives':
				prompt = `As an expert English Teaching Assistant in Taiwan, you are part of a multi-step lesson planning workflow. Your role in Phase 1 is to refine raw learning objectives and provide supporting context for later phases. Improve on, but do not disregard important details in the INPUT OBJECTIVES. This is what the teacher wants to work on.

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
                - Both formal and informal assessment suggestions

                Remember: Your output will be used by subsequent phases to generate detailed lesson activities and assessments. Keep your language clear and your suggestions specific.`;

				model = 'claude-3-5-haiku-20241022';
				max_tokens = 1000;
				break;

			case 'Generating Activities':
				prompt = `As an expert English Teaching Assistant in Taiwan, you are working on Phase 2 of the lesson planning workflow. Your role is to transform the refined objectives and planning considerations from Phase 1 into a structured sequence of classroom activities.

                PHASE 1 OUTPUT:
                ${formData.refinedObjectives || 'No previous output provided'}

                LESSON CONTEXT:
                Topic: ${formData.topic}
                Grade Level: ${formData.grade}
                Class Duration: ${formData.duration}
                Co-teaching Model: ${formData.coteachingModel}
                ${formData.description ? `Additional Description: ${formData.description}` : ''}

                Create a detailed lesson procedure that:
                1. Builds progressively toward the lesson objectives
                2. Maintains clear connections between activities
                3. Includes informal assessment opportunities throughout
                4. Allows flexibility for teacher adaptation
                5. Keeps activities simple and broadly applicable

                Please structure your response using this format:

                ### Time Distribution Overview
                Total Class Time: ${formData.duration} minutes
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
                [1-3 extension activities if time permits]

                Guidelines for Writing Activity Steps:
                1. Write each step as a clear action
                2. Start with the teacher action, then describe student response
                3. Keep instructions simple and direct
                4. Include approximate timing for each major step
                5. Note key transitions between activities
                6. Highlight opportunities for student interaction
                7. Include brief suggestions for informal assessment`;

				model = 'claude-3-5-haiku-20241022';
				max_tokens = 2000;
				break;

			case 'Preparing Components':
				prompt = `As an expert English Teaching Assistant in Taiwan, you are working on Phase 3 of the lesson planning workflow. Your role is to identify essential materials and create reflection questions that align with ELTP Professional Standards.

                Previous Phase Outputs:
                Objectives: ${formData.refinedObjectives || 'No refined objectives provided'}
                Activities: ${formData.activities || 'No activities provided'}

                LESSON CONTEXT:
                Topic: ${formData.topic}
                Grade Level: ${formData.grade}
                Class Duration: ${formData.duration}
                Co-teaching Model: ${formData.coteachingModel}
                ${formData.description ? `Additional Description: ${formData.description}` : ''}

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
                Essential vocabulary (5-8 words max):
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

				model = 'claude-3-5-haiku-20241022';
				max_tokens = 1000;
				break;

			case 'Creating Final Plan':
				prompt = `You are assisting English Teaching Assistants in Taiwan. This is the last phase in an AI lesson plan creation workflow. Your task in this final phase is to bring together all the previous phase outputs to create a cohesive final formatted version of this lesson plan.

                Context Information:
                Topic: ${formData.topic}
                Time: ${formData.duration} 
                Grade: ${formData.grade}
                Co-teaching Model: ${formData.coteachingModel}
                ${formData.description ? `Additional Description: ${formData.description}` : ''}

                Previous Phase Outputs:
                Objectives Phase Output: ${formData.refinedObjectives || 'No refined objectives provided'}
                Procedures Phase Output: ${formData.activities || 'No activities provided'}
                Components Phase Output: ${formData.components || 'No components provided'}

                Lesson Plan Template:
                    Here's a starting idea for your lesson plan!

                    # [Topic]
                    **Grade:** [grade]  
                    **Time:** [duration]  

                    ## Learning Objectives
                    Students will be able to:
                    - [objective 1]
                    - [objective 2]
                    
                    ## Teaching Materials
                    - [material 1]
                    - [material 2]
                    
                    ## Basic Vocabulary & Sentence Patterns
                    **New Vocabulary:**
                    - [word 1]
                    - [word 2]
                    
                    **Target Patterns:**
                    - [pattern 1]
                    - [pattern 2]
                    
                    ## Procedures
                    [Transfer the procedures from the previous phase, maintaining all their original detail and structure while applying consistent formatting. Keep the natural flow and depth of instructions.]

                    ### I. Warm up (XX min)
                    Objective Connection: [Insert from Procedures Phase Output]

                    Steps: [From Procedures Phase Output]
                    
                    ### II. Introduction (XX min)
                    Objective Connection: [Insert from Procedures Phase Output]

                    Steps: 
                    [Insert from Procedures Phase Output]
                    
                    ### III. Main Activities (XX min)
                    Objective Connection: [Insert from Procedures Phase Output]

                    Steps: 
                    [Insert from Procedures Phase Output]

                    Differentiation Note:
                    [Insert from Procedures Phase Output]

                    ### IV. Assessment (XX min)
                    Success Criteria:
                    [Insert from Procedures Phase Output]
                    
                    Steps:
                    [Insert from Procedures Phase Output]
                    
                    ### V. Closure (XX min)
                    Steps:
                    [Insert from Procedures Phase Output]
                    
                    ### VI. Optional Extensions
                    [Insert from Procedures Phase Output]
                    
                    ## Reflection Questions
                    1. [question 1]
                    2. [question 2]

                Note: 
                - When formatting the Procedures section, you must copy the exact content from the PROCEDURES output above. Do not summarize or simplify the steps.
                - Maintain all step-by-step instructions
                - Preserve all assessment criteria
                - Keep all differentiation notes
                - Use consistent markdown formatting throughout
                - Always start with 'Here's a starting idea for your lesson plan!'`;

				model = 'claude-3-5-sonnet-20241022';
				max_tokens = 4000;
				break;

			default:
				return json({ error: 'Invalid phase name' }, { status: 400 });
		}

		// Log prompt before sending to LLM
		console.log(`Phase: ${phaseName} - Prompt being sent to LLM:`, prompt);

		// Send the prompt to the Anthropic API
		const msg = await anthropic.messages.create({
			model: model,
			max_tokens: max_tokens,
			messages: [{ role: 'user', content: prompt }]
		});

		// Extract the generated content
		let content = msg.content[0].text;

		// Log LLM output
		console.log(`Phase: ${phaseName} - LLM Output:`, content);

		// Return the generated content
		return json({
			phase: {
				name: phaseName,
				content: content
			}
		});
	} catch (error) {
		console.error('Error calling Anthropic API:', error);
		return json(
			{ error: 'Failed to generate lesson plan phase', details: error.message },
			{ status: 500 }
		);
	}
}
