// src/routes/api/generate-eta-lesson/+server.js

/**
 * @file Handles the API endpoint for generating lesson plan phases using Gemini.
 */

import { json } from '@sveltejs/kit';
import { generateContent } from '$lib/llm.js';

/**
 * POST endpoint for /api/generate-eta-lesson
 */
export async function POST({ request }) {
	try {
		const formData = await request.json();
		const phaseName = request.headers.get('phase');
		
		if (!phaseName) {
			return json({ error: 'Phase header is missing' }, { status: 400 });
		}

		console.log(`ETA Task: ${phaseName} - Processing...`);

		// Extract Form Data
		const topic = formData.topic || '';
		const grade = formData.grade || '';
		const duration = formData.classDuration || '';
		const coteachingModel = formData.coTeachingModel || '';
		const description = formData.classDescription || '';
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
                b) Co-teaching Integration (${coteachingModel})
                c) Cultural Elements
                d) Assessment Approaches`;
				max_tokens = 1000;
				break;

			case 'Generating Activities':
				prompt = `As an expert English Teaching Assistant in Taiwan, you are working on Phase 2 of the lesson planning workflow. Your role is to transform the refined objectives and planning considerations from Phase 1 into a structured sequence of classroom activities.

                PHASE 1 OUTPUT:
                ${refinedObjectives}

                LESSON CONTEXT:
                Topic: ${topic}
                Grade Level: ${grade}
                Class Duration: ${duration}
                Co-teaching Model: ${coteachingModel}

                Create a detailed lesson procedure that:
                1. Builds progressively toward the lesson objectives
                2. Includes informal assessment opportunities throughout
                3. Keeps activities simple and broadly applicable

                Please include a timing overview (Total: ${duration} minutes).`;
				max_tokens = 2000;
				break;

			case 'Preparing Components':
				prompt = `As an expert English Teaching Assistant in Taiwan, you are working on Phase 3 of the lesson planning workflow. Your role is to identify essential materials and create components.

                Previous Phase Outputs:
                Objectives: ${refinedObjectives}
                Activities: ${activities}

                LESSON CONTEXT:
                Topic: ${topic}
                Grade Level: ${grade}

                Please create these three sections:
                ### Teaching Materials
                ### Basic Vocabulary & Sentence Patterns
                ### Reflection Questions (3 focused questions)`;
				max_tokens = 1000;
				break;

			case 'Creating Final Plan':
				prompt = `You are an expert ETA Advisor in Taiwan. Create a cohesive final lesson plan based on previous outputs.

                Context:
                Topic: ${topic}, Grade: ${grade}, Time: ${duration}, Co-teaching: ${coteachingModel}
                ${description ? `Description: ${description}` : ''}

                Previous Phase Outputs:
                Objectives: ${refinedObjectives}
                Activities: ${activities}
                Components: ${components}

                Lesson Plan Template:
                # ${topic}
                **Grade:** ${grade}
                **Time:** ${duration}
                **Co-teaching Model:** ${coteachingModel}

                ## Learning Objectives
                ## Teaching Materials
                ## Basic Vocabulary & Sentence Patterns
                ## Procedures (Warm-up, Intro, Main Activities, Assessment, Closure)
                ## Optional Extensions
                ## Reflection Questions for Teachers

                Apply UDL principles (engagement, representation, expression) and ensure clear markdown formatting.`;
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
		console.error(`ETA Generation Error:`, error);
		return json({ error: 'Failed to generate lesson plan phase', details: error.message }, { status: 500 });
	}
}
