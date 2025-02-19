from anthropic import Anthropic
from config import config


class LessonPlanProcessor:
    def __init__(self, api_key=None):
        """Initialize the processor with an API key."""
        self.client = Anthropic(api_key=api_key or config.ANTHROPIC_API_KEY)

    def get_relevant_context(self, context: dict) -> str:
        """Creates a formatted string of only the context elements that were provided by the user."""
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
        """Refines the lesson objectives to be more specific and measurable."""
        prompt = f"""As an expert English Teaching Assistant in Taiwan, you are part of a multi-step lesson planning workflow..."""  # Your existing prompt here

        response = self.client.messages.create(
            model="claude-3-5-haiku-20241022",
            max_tokens=1000,
            messages=[{"role": "user", "content": prompt}],
        )

        return response.content[0].text

    def generate_activity_and_assessment(self, objectives: str, context: dict) -> str:
        """Generates detailed procedures and assessment strategies for the lesson plan."""
        prompt = f"""As an expert English Teaching Assistant in Taiwan, you are working on Phase 2..."""  # Your existing prompt here

        response = self.client.messages.create(
            model="claude-3-5-haiku-20241022",
            max_tokens=2000,
            messages=[{"role": "user", "content": prompt}],
        )
        return response.content[0].text

    def prepare_lesson_components(
        self, objectives: str, activities: str, context: dict
    ) -> str:
        """Prepares lesson components and reflection questions."""
        prompt = f"""As an expert English Teaching Assistant in Taiwan, you are working on Phase 3..."""  # Your existing prompt here

        response = self.client.messages.create(
            model="claude-3-5-haiku-20241022",
            max_tokens=1000,
            messages=[{"role": "user", "content": prompt}],
        )
        return response.content[0].text

    def create_final_lesson(
        self, objectives: str, procedures: str, components: str, context: dict
    ) -> str:
        """Creates the final formatted lesson plan."""
        prompt = f"""You are assisting English Teaching Assistants in Taiwan. This is the last phase..."""  # Your existing prompt here

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
