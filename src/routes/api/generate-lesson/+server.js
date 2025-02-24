// src/routes/api/generate-lesson/+server.js
import { json } from '@sveltejs/kit';

// Function to simulate delay
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function POST({ request }) {
	try {
		const inputData = await request.json();
		const { topic, grade, classDuration, objectives, coTeachingModel, classDescription } =
			inputData; // Simplified input data

		// Phase 1: Refined Objectives
		await sleep(1000); // Simulate API delay
		const refinedObjectivesOutput = `### Refined Objectives
- Students will be able to identify and correctly use 5-7 new vocabulary words from "The Missing Piece" in contextually appropriate spoken and written sentences
- Students will be able to describe the book's main character's emotions and journey using basic comparative sentence structures with 80% accuracy
- Students will be able to create a simple visual or verbal narrative that demonstrates understanding of the book's metaphorical themes of personal growth and self-discovery

### Planning Considerations
**Differentiation Opportunities**
Lower-level students can use word banks and sentence frames, while advanced students can create more complex emotional narratives or comparative analyses. Provide visual supports and partner work to support varied language proficiencies.

**Co-teaching Integration**
The Lead English Teacher (LET) can focus on overall story comprehension and literary themes, while the English Teaching Assistant (ETA) supports language production, vocabulary development, and provides individualized language scaffolding during activities.

**Cultural Elements**
Explore the universal themes of personal growth and self-acceptance, comparing how these concepts might be understood differently in Taiwanese and Western cultural contexts. Use the book as a bridge for cross-cultural dialogue about individual journeys and self-improvement.

**Assessment Approaches**
Use a combination of formative assessments: vocabulary matching games, quick verbal check-ins, peer dialogue observations, and a final creative task where students demonstrate vocabulary usage and narrative comprehension. Create a simple rubric that allows for multiple modes of demonstrating understanding (verbal, written, visual).`;

		// Phase 2: Procedures
		await sleep(1500); // Simulate API delay
		const proceduresOutput = `### Time Distribution Overview
Total Class Time: ${classDuration} min
- Warm-up: 5 minutes
- Introduction: 10 minutes
- Activities: 25 minutes
- Assessment: 7 minutes
- Closure: 3 minutes

### I. Warm-up (5 min)
Objective Connection: Activate prior knowledge and create emotional connection to the book's themes of personal growth

Steps:
1. Teacher displays silhouette image of a character with a "missing piece" (2 min)
   - Ask students: "What do you think is missing?"
   - Encourage brief partner sharing in L1 or simple English
2. Conduct quick whole-class brainstorm about personal challenges (3 min)
   - Students share one-word responses about feeling "incomplete"
   - Model with your own example to lower anxiety

### II. Introduction (10 min)
Objective Connection: Introduce key vocabulary and initial story context

Steps:
1. Vocabulary Pre-teaching (5 min)
   - Introduce 6 target vocabulary words with visual supports
   - Words: journey, search, complete, grow, change, discover
   - Use gesture and simple definition explanations
2. Picture Walk Activity (5 min)
   - Co-teachers do collaborative book preview
   - LET narrates basic story arc
   - ETA points out key emotional moments
   - Students predict story themes in pairs

### III. Main Activities (25 min)
Objective Connection: Build deep comprehension and language production skills

Steps:
1. Emotional Journey Mapping (10 min)
   - Students create a simple graphic organizer
   - Track main character's emotional progression
   - Use sentence frames:
     "At first, the character felt ___"
     "Then, the character learned _____"
2. Comparative Sentences Practice (8 min)
   - Partner activity comparing character's start vs. end states
   - Example frames:
     "Before, the character was ____. Now, the character is _____."
3. Creative Reconstruction (7 min)
   - Students draw/write their own "missing piece" story
   - Use learned vocabulary
   - Optional visual or verbal presentation

Differentiation Note:
- Lower-level: Use word banks, sentence frames
- Advanced: Add more complex emotional descriptions
- Visual learners: More drawing/diagramming options
- Verbal learners: More speaking opportunities

### IV. Assessment (7 min)
Success Criteria:
- Accurate vocabulary usage
- Basic emotional narrative
- Comparative sentence structure

Steps:
1. Vocabulary Quick Check (3 min)
   - Matching game with learned words
   - Peer assessment opportunity
2. Emotion/Journey Sharing (4 min)
   - Quick pair-share of personal "missing piece" reflection
   - Teachers circulate and note language use

### V. Closure (3 min)
Steps:
1. Rapid reflection: "What did you discover today?"
2. Preview next lesson's connection to theme

### VI. Optional Extensions
- Create a class "growth journey" wall display
- Write a letter to the book's main character
- Comparative cultural discussion about personal growth

Teaching Notes:
- Maintain high-engagement, low-stress environment
- Prioritize communication over perfect grammar
- Use lots of visual and kinesthetic supports
- Encourage risk-taking in language use

Key Adaptation Flexibility:
- Activities can be shortened/lengthened
- Vocabulary can be modified
- Assessment can be verbal or written
- Cultural examples can be localized`;

		// Phase 3: Components
		await sleep(1200); // Simulate API delay
		const componentsOutput = `### Teaching Materials
- Picture book "The Missing Piece" (primary text for lesson)
- Large graphic organizer sheets (for emotional journey mapping)
- Colored markers/pencils (for visual representation)
- Vocabulary word cards with visual supports
- Simple silhouette image for warm-up activity

### Basic Vocabulary & Sentence Patterns

Vocabulary:
- Journey: a process of personal change or development
- Complete: feeling whole or fulfilled
- Discover: to find or learn something new about oneself
- Grow: to develop or improve over time
- Search: looking for something important
- Change: to become different

Key Sentence Patterns:
- "Before [past state], now [current state]."
- "I discovered that [personal insight]."
- "My journey taught me [lesson learned]."

### Reflection Questions

1. Student Learning Outcomes:
   "To what extent did students demonstrate understanding of the book's metaphorical themes of personal growth through their vocabulary use and narrative creation?"

2. Teaching Effectiveness:
   "How effectively did the lesson's differentiated activities support students with varied English proficiency levels in accessing the lesson's core concepts?"

3. Cultural/Language Considerations:
   "In what ways did the lesson create space for students to explore personal growth concepts through both Taiwanese and global cultural perspectives?"`;

		// Phase 4: Final Plan
		await sleep(1800); // Simulate API delay
		const finalLessonPlanOutput = {
			topic: topic,
			grade: grade,
			classDuration: classDuration,
			coTeachingModel: coTeachingModel,
			objectives: objectives,
			classDescription: classDescription, // Using classDescription instead of classroomSetting, etc.
			refinedObjectives: refinedObjectivesOutput,
			procedures: proceduresOutput,
			components: componentsOutput,
			finalPlan: `Here's a starting idea for your lesson plan!

# ${topic}
**Grade:** ${grade}
**Time:** ${classDuration}
**Co-teaching Model:** ${coTeachingModel}

## Learning Objectives
Students will be able to:
- Identify and correctly use 5-7 new vocabulary words from "The Missing Piece" in contextually appropriate spoken and written sentences
- Describe the book's main character's emotions and journey using basic comparative sentence structures with 80% accuracy
- Create a simple visual or verbal narrative that demonstrates understanding of the book's metaphorical themes of personal growth and self-discovery

## Teaching Materials
- Picture book "The Missing Piece"
- Large graphic organizer sheets
- Colored markers/pencils
- Vocabulary word cards with visual supports
- Simple silhouette image for warm-up activity

## Basic Vocabulary & Sentence Patterns
**New Vocabulary:**
- Journey: a process of personal change or development
- Complete: feeling whole or fulfilled
- Discover: to find or learn something new about oneself
- Grow: to develop or improve over time
- Search: looking for something important
- Change: to become different

**Target Patterns:**
- "Before [past state], now [current state]."
- "I discovered that [personal insight]."
- "My journey taught me [lesson learned]."

## Procedures
${proceduresOutput}


## Reflection Questions
1. Student Learning Outcomes:
   "To what extent did students demonstrate understanding of the book's metaphorical themes of personal growth through their vocabulary use and narrative creation?"
2. Teaching Effectiveness:
   "How effectively did the lesson's differentiated activities support students with varied English proficiency levels in accessing the lesson's core concepts?"
3. Cultural/Language Considerations:
   "In what ways did the lesson create space for students to explore personal growth concepts through both Taiwanese and global cultural perspectives?"`
		};

		// Simulate phased response - returning one phase at a time

		const phaseName = request.headers.get('phase'); // Get phase from headers if needed for more complex logic

		if (!phaseName || phaseName === 'Refining Objectives') {
			return json({ phase: { name: 'Refining Objectives', content: refinedObjectivesOutput } });
		}
		if (phaseName === 'Generating Activities' || !phaseName) {
			// default to next phase if not specified or first phase
			return json({ phase: { name: 'Generating Activities', content: proceduresOutput } });
		}
		if (phaseName === 'Preparing Components' || !phaseName) {
			return json({ phase: { name: 'Preparing Components', content: componentsOutput } });
		}
		if (phaseName === 'Creating Final Plan' || !phaseName) {
			return json({
				phase: {
					name: 'Creating Final Plan',
					content: {
						finalLessonPlan: finalLessonPlanOutput,
						fullPlan: finalLessonPlanOutput.finalPlan
					}
				},
				finalLessonPlan: finalLessonPlanOutput // Top-level finalLessonPlan
			});
		}

		return json({ error: 'Invalid phase requested' }, { status: 400 });
	} catch (error) {
		console.error('Error in /api/generate-lesson:', error); // Log the full error to server console
		return new Response(JSON.stringify({ error: error.message }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
}
