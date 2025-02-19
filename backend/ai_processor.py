from anthropic import Anthropic
from config import config


class LessonPlanProcessor:
    def __init__(self, api_key=None):
        """Initialize the processor with an API key."""
        self.client = Anthropic(api_key=api_key or config.ANTHROPIC_API_KEY)

    def get_relevant_context(self, context: dict) -> str:
        """
        Creates a formatted string of only the context elements that were provided by the user.
        """
        sections = {
            "Core Information": {
                "Topic/Theme": context["topic"],
                "Grade Level": context["grade"],
                "Class Duration": context["class_duration"],
                "Co-teaching Model": context["co_teaching_model"],
            },
            "Classroom Environment": {
                "Setting Description": context.get("classroom_setting"),
                "Number of Students": context.get("class_size"),
            },
            "Student Information": {
                "English Proficiency Levels": context.get("proficiency_levels")
            },
            "Assessment Plans": {
                "Planned Assessment Methods": context.get("assessment_types")
            },
            "Teaching Resources": {
                "Available Materials": context.get("materials"),
                "Target Vocabulary/Phrases": context.get("key_vocabulary"),
            },
            "Additional Information": {
                "Special Considerations": context.get("extra_considerations")
            },
        }

        formatted_context = ["This is what the teacher has told us about their class:"]

        for section, items in sections.items():
            relevant_items = {
                k: v
                for k, v in items.items()
                if v and v != "Not specified" and v != [] and v is not None
            }

            if relevant_items:
                formatted_context.append(f"\n{section}:")
                for key, value in relevant_items.items():
                    if isinstance(value, list):
                        formatted_value = ", ".join(str(item) for item in value)
                    else:
                        formatted_value = str(value)
                    formatted_context.append(f"{key}: {formatted_value}")

        return "\n".join(formatted_context)

    def refine_objectives(self, objectives: str, context: dict) -> str:
        """
        Refines the lesson objectives to be more specific and measurable.

        Args:
            objectives: Raw objectives from user input
            context: Dictionary containing lesson context information

        Returns:
            String containing refined, markdown-formatted objectives
        """
        prompt = f"""As an expert English Teaching Assistant in Taiwan, you are part of a multi-step lesson planning workflow. Your role in Phase 1 is to refine raw learning objectives and provide supporting context for later phases. Improve on, but do not disregard important details in the INPUT OBJECTIVES. This is what the teacher wants to work on.

        INPUT OBJECTIVES:
        {objectives}

        LESSON CONTEXT:
        {self.get_relevant_context(context)}

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
        - How these objectives work with the chosen co-teaching model
        - Potential role distribution between ETA and LET

        c) Cultural Elements
        - Cultural learning opportunities within these objectives
        - Cross-cultural communication considerations

        d) Assessment Approaches
        - Ways to measure student achievement of these objectives
        - Both formal and informal assessment suggestions

        Response Format:
        ### Refined Objectives
        - [First objective]
        - [Second objective]
        - [Optional third objective if needed]

        ### Planning Considerations
        **Differentiation Opportunities**
        [1-2 sentences about differentiation strategies]

        **Co-teaching Integration**
        [1-2 sentences about co-teaching implementation]

        **Cultural Elements**
        [1-2 sentences about cultural aspects]

        **Assessment Approaches**
        [1-2 sentences about assessment strategies]

        Remember: Your output will be used by subsequent phases to generate detailed lesson activities and assessments. Keep your language clear and your suggestions specific."""

        response = self.client.messages.create(
            model="claude-3-5-haiku-20241022",
            max_tokens=1000,
            messages=[{"role": "user", "content": prompt}],
        )

        return response.content[0].text

    def generate_activity_and_assessment(self, objectives: str, context: dict) -> str:
        """
        Generates detailed procedures and assessment strategies for the lesson plan.

        Args:
            objectives: The refined learning objectives
            context: Dictionary containing lesson context information

        Returns:
            String containing structured lesson procedures and assessment plans
        """

        prompt = f"""As an expert English Teaching Assistant in Taiwan, you are working on Phase 2 of the lesson planning workflow. Your role is to transform the refined objectives and planning considerations from Phase 1 into a structured sequence of classroom activities.

        PHASE 1 OUTPUT:
        Objectives: {objectives}
        [Include the full Planning Considerations section from Phase 1]

        LESSON CONTEXT:
        {self.get_relevant_context(context)}

        Create a detailed lesson procedure that:
        1. Builds progressively toward the lesson objectives
        2. Maintains clear connections between activities
        3. Includes informal assessment opportunities throughout
        4. Allows flexibility for teacher adaptation
        5. Keeps activities simple and broadly applicable

        Please structure your response using this format:

        ### Time Distribution Overview
        Total Class Time: {context['class_duration']} minutes
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
        [extensions]

        Guidelines for Writing Activity Steps:
        1. Write each step as a clear action
        2. Start with the teacher action, then describe student response
        3. Keep instructions simple and direct
        4. Include approximate timing for each major step
        5. Note key transitions between activities
        6. Highlight opportunities for student interaction
        7. Include brief suggestions for informal assessment

        Remember: Your output will be used in Phase 3 to add supporting materials and reflection questions. Focus on creating clear, practical activities that directly support the lesson objectives while maintaining flexibility for teacher adaptation."""

        response = self.client.messages.create(
            model="claude-3-5-haiku-20241022",
            max_tokens=2000,
            messages=[{"role": "user", "content": prompt}],
        )
        return response.content[0].text

    def prepare_lesson_components(
        self, objectives: str, activities: str, context: dict
    ) -> str:
        prompt = f"""As an expert English Teaching Assistant in Taiwan, you are working on Phase 3 of the lesson planning workflow. Your role is to identify essential materials and create reflection questions that align with ELTP Professional Standards.

        Previous Phase Outputs:
        Objectives: {objectives}
        Activities: {activities}

        LESSON CONTEXT:
        {self.get_relevant_context(context)}

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

        Remember: Keep your lists concise and focused on essentials only. Your output will be used in the final phase to create a complete lesson plan."""

        response = self.client.messages.create(
            model="claude-3-5-haiku-20241022",
            max_tokens=1000,
            messages=[{"role": "user", "content": prompt}],
        )
        return response.content[0].text

    def create_final_lesson(
        self, objectives: str, procedures: str, components: str, context: dict
    ) -> str:
        prompt = f"""You are assisting English Teaching Assistants in Taiwan. This is the last phase in an AI lesson plan creation workflow. Your task in this final phase is to bring together all the previous phase outputs to create a cohesive final formatted version of this lesson plan.

        Context Information:
        Topic: {context['topic']}
        Time: {context['class_duration']} 
        Grade: {context['grade']}
        Setting: {context['classroom_setting']}

        Previous Phase Outputs:
        Objectives Phase Output: {objectives}
        Procedures Phase Output: {procedures}
        Components Phase Output: {components}


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
        - Always start with 'Here's a starting idea for your lesson plan!'"""

        response = self.client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=4000,
            messages=[{"role": "user", "content": prompt}],
        )

        return response.content[0].text

    def generate_lesson_plan(self, inputs: dict) -> dict:
        """Main method to generate a complete lesson plan."""
        try:
            # Step 1: Refine objectives
            refined_objectives = self.refine_objectives(inputs["objectives"], inputs)

            # Step 2: Generate activities and assessment
            procedures = self.generate_activity_and_assessment(
                refined_objectives, inputs
            )

            # Step 3: Prepare components
            components = self.prepare_lesson_components(
                refined_objectives, procedures, inputs
            )

            # Step 4: Create final lesson
            final_plan = self.create_final_lesson(
                refined_objectives, procedures, components, inputs
            )

            return {
                "status": "success",
                "data": {
                    "refined_objectives": refined_objectives,
                    "procedures": procedures,
                    "components": components,
                    "final_plan": final_plan,
                },
            }

        except Exception as e:
            return {"status": "error", "message": str(e)}
