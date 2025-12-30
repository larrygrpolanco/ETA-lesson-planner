// src/routes/api/generate-emi-lesson/+server.js

/**
 * @file Handles the API endpoint for generating EMI workshop plan phases using Gemini.
 */

import { json } from '@sveltejs/kit';
import { generateContent } from '$lib/llm.js';

/**
 * POST endpoint for /api/generate-emi-lesson
 */
export async function POST({ request }) {
	try {
		const formData = await request.json();
		const phaseName = request.headers.get('phase');
		
		if (!phaseName) {
			return json({ error: 'Phase header is missing' }, { status: 400 });
		}

		console.log(`EMI Task: ${phaseName} - Processing...`);

		// Extract Form Data
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
			refinedObjectives = formData.phases.find((p) => p.key === 'objectives')?.content || '';
			activities = formData.phases.find((p) => p.key === 'activities')?.content || '';
			components = formData.phases.find((p) => p.key === 'components')?.content || '';
		}

		let prompt = '';
		let max_tokens = 1000;

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
                b) Interactive Elements (specifically for ${participantCount} participants)
                c) Cultural Elements (Taiwan context)
                d) Assessment Approaches`;
				max_tokens = 1000;
				break;

			case 'Designing Activities':
				prompt = `As an expert English as a Medium of Instruction (EMI) Advisor in Taiwan, you are working on Phase 2 of the workshop planning workflow. Your role is to transform the refined objectives and planning considerations from Phase 1 into a structured sequence of interactive workshop activities.

                PHASE 1 OUTPUT:
                ${refinedObjectives}

                WORKSHOP CONTEXT:
                Topic: ${topic}
                Target Audience: ${audience}
                Workshop Duration: ${duration}
                Number of Participants: ${participantCount}
                ${workshopContext ? `Additional Context: ${workshopContext}` : ''}

                Create a detailed workshop procedure that:
                1. Builds progressively toward the workshop objectives
                2. Includes plenty of interactive elements and icebreakers
                3. Works effectively with larger groups (${participantCount} participants)
                4. Incorporates both individual and group activities

                Please include a timing overview (Total: ${duration} minutes).`;
				max_tokens = 2000;
				break;

			case 'Creating Interactive Elements':
				prompt = `As an expert English as a Medium of Instruction (EMI) Advisor in Taiwan, you are working on Phase 3 of the workshop planning workflow. Your role is to identify essential materials and create interactive elements.

                Previous Phase Outputs:
                Objectives: ${refinedObjectives}
                Activities: ${activities}

                WORKSHOP CONTEXT:
                Topic: ${topic}
                Target Audience: ${audience}
                Workshop Duration: ${duration}
                Number of Participants: ${participantCount}

                Please create these three sections:
                ### Workshop Materials
                ### Interactive Elements (3-4 specific elements for ${participantCount} participants)
                ### Reflection Questions (3 focused questions)`;
				max_tokens = 1500;
				break;

			case 'Finalizing Workshop Plan':
				prompt = `You are an expert EMI Advisor in Taiwan. Create a cohesive final workshop plan based on previous outputs.

                Context:
                Topic: ${topic}, Duration: ${duration}, Audience: ${audience}, Participants: ${participantCount}
                ${workshopContext ? `Additional Context: ${workshopContext}` : ''}

                Previous Outputs:
                Objectives: ${refinedObjectives}
                Activities: ${activities}
                Elements: ${components}

                Workshop Plan Template:
                # ${topic} Workshop Plan
                **Target Audience:** ${audience}
                **Duration:** ${duration}
                **Number of Participants:** ${participantCount}
                
                ## Workshop Objectives
                ## Workshop Materials
                ## Workshop Structure (Welcome, Intro, Main Activities, Group Work, Reflection, Conclusion)
                ## Facilitator Notes (Preparation, Challenges, Reflection)

                Ensure clear markdown formatting.`;
				max_tokens = 4000;
				break;

			default:
				return json({ error: 'Invalid phase name' }, { status: 400 });
		}

		const content = await generateContent(prompt, max_tokens);

		return json({
			phase: {
				name: phaseName,
				content: content
			}
		});
	} catch (error) {
		console.error(`EMI Generation Error:`, error);
		return json({ error: 'Failed to generate workshop plan phase', details: error.message }, { status: 500 });
	}
}
