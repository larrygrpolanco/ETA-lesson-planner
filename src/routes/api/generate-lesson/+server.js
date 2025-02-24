// src/routes/api/generate-lesson/+server.js
console.log('Hello from +server.js! Is this running?');
import { json } from '@sveltejs/kit';
import Anthropic from '@anthropic-ai/sdk';
import { env } from '$env/static/private';

console.log('Test Var:', env.TEST_VAR);
console.log('Environment variables:', env);

const anthropic = new Anthropic({
	apiKey: env.ANTHROPIC_API_KEY // Access API key from environment variables
});

export async function POST({ request }) {
	try {
		const formData = await request.json();
		const phaseName = request.headers.get('phase');

		if (!phaseName) {
			return json({ error: 'Phase header is missing' }, { status: 400 });
		}

		let prompt = '';
		let model = 'claude-3-sonnet-20240229'; // Or another suitable Claude model
		let max_tokens = 200; // Adjust as needed per phase

		// Construct prompt based on the phase and form data
		switch (phaseName) {
			case 'Refining Objectives':
				prompt = `Refine the following learning objectives for a lesson plan. Grade Level: ${formData.grade}, Topic: ${formData.topic}, Objectives: ${formData.objectives}.  Make them more specific, measurable, achievable, relevant, and time-bound (SMART). Return only the refined objectives in markdown format.`;
				max_tokens = 300; // May need more tokens for objectives refinement
				break;
			case 'Generating Activities':
				prompt = `Generate a list of engaging and varied activities for a lesson plan on ${formData.topic} for Grade ${formData.grade}. Class duration is ${formData.classDuration}. Co-teaching model is ${formData.coTeachingModel}. Learning objectives are: ${formData.objectives}. Consider the classroom context: ${formData.classDescription}.  Provide activities suitable for this context and objectives. Return the activities as a numbered list in markdown format.`;
				max_tokens = 500; // Activities generation might need more tokens
				break;
			case 'Preparing Components':
				prompt = `Based on the lesson topic: ${formData.topic}, grade level: ${formData.grade}, and learning objectives: ${formData.objectives}, suggest necessary components for the lesson plan. Components could include materials, assessments, differentiation strategies, etc. List these components in markdown format.`;
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

                Include the following sections in the lesson plan:
                - Topic
                - Grade Level
                - Time Allotment
                - Learning Objectives (SMART objectives)
                - Materials
                - Activities (Detailed, step-by-step)
                - Assessment
                - Differentiation
                - Co-teaching strategies (based on the selected model)
                - Conclusion/Wrap-up

                Format the lesson plan in a clear and organized markdown format. Be detailed and comprehensive, suitable for a teacher to use directly.`;
				max_tokens = 1024; // Final plan generation will likely need more tokens
				model = 'claude-3-opus-20240229'; // Opus for better final plan quality, consider if you want to use a faster model like Sonnet for cost/speed
				break;
			default:
				return json({ error: 'Invalid phase name' }, { status: 400 });
		}

		const msg = await anthropic.messages.create({
			model: model,
			max_tokens: max_tokens,
			messages: [{ role: 'user', content: prompt }]
		});

		let content = msg.content[0].text;

		return json({
			phase: {
				name: phaseName,
				content: content // Return the generated content from Claude
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
