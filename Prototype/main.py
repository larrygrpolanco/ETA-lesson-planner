import streamlit as st
from ai_processor import LessonPlanProcessor

# Debug mode flag - set to True to enable debug output
DEBUG_MODE = True

st.set_page_config(page_title="Lesson Plan Assistant", layout="wide")


def display_lesson_plan(lesson_plan: str):
    """Display the lesson plan with consistent styling for both light and dark modes."""
    st.markdown(
        """
        <style>
        .lesson-plan-output {
            font-family: 'Inter', 'Helvetica Neue', sans-serif;
            line-height: 1.6;
            padding: 24px;
            background-color: #ffffff;
            color: #2d3748; /* Neutral dark gray */
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            margin: 20px 0;
        }

        /* Headers with color gradation */
        .lesson-plan-output h1 {
            color: #1a73e8; /* Primary blue */
            font-weight: 700;
            font-size: 2em;
            margin-top: 1.5em;
            margin-bottom: 0.75em;
        }
        
        .lesson-plan-output h2 {
            color: #1a73e8; /* Slightly lighter blue */
            font-weight: 600;
            font-size: 1.6em;
            margin-top: 1.3em;
            margin-bottom: 0.6em;
        }
        
        .lesson-plan-output h3 {
            color: #1a73e8; /* Even lighter blue */
            font-weight: 600;
            font-size: 1.3em;
            margin-top: 1.1em;
            margin-bottom: 0.5em;
        }

        .lesson-plan-output strong {
            color: inherit;
            font-weight: 600;
        }

        /* List styling */
        .lesson-plan-output ul, .lesson-plan-output ol {
            margin: 0.75em 0;
            padding-left: 1.75em;
        }

        .lesson-plan-output li {
            margin-bottom: 0.5em;
        }

        /* Dark mode */
        [data-theme="dark"] .lesson-plan-output {
            background-color: #1a1a1a;
            color: #e2e8f0; /* Light gray */
        }

        [data-theme="dark"] .lesson-plan-output h1 {
            color: #64b5f6; /* Soft blue */
        }
        
        [data-theme="dark"] .lesson-plan-output h2 {
            color: #90caf9; /* Lighter soft blue */
        }
        
        [data-theme="dark"] .lesson-plan-output h3 {
            color: #bbdefb; /* Even lighter soft blue */
        }
        </style>
        """,
        unsafe_allow_html=True,
    )

    # Display lesson plan
    st.markdown(
        f'<div class="lesson-plan-output">{lesson_plan}</div>',
        unsafe_allow_html=True,
    )


def get_co_teaching_options():
    return [
        "One teach, one observe",
        "One teach, one assist",
        "Team teaching",
        "Station teaching",
        "Parallel teaching",
        "Alternative teaching",
    ]


def get_assessment_types():
    return [
        "Watch & Note: observing student work and behavior",
        "Speaking Check: asking questions and listening to responses",
        "Quick Poll: understanding checks via thumbs up/down or voting",
        "Practice Task: students applying what they learned",
        "Group Work: collaborative demonstration of learning",
        "Written Check: quick writing tasks like worksheets or questions",
    ]


def main():
    st.title("ETA Lesson Plan?")
    st.caption(
        "Create lesson plans ideas. Share your topic, objectives, and class details, and the app will make you a lesson plan draft. A hopefully helpful starting point. Customize and build on it to fit your classroom needs. Good Luck!"
    )

    with st.form("lesson_plan_form"):
        # Core Information Section
        st.subheader("Class Context")
        st.caption("Share basic information about your class to get ideas started.")

        col1, col2 = st.columns(2)
        with col1:
            topic = st.text_input(
                "Topic/Theme*",
                placeholder="e.g., Food and Nutrition, Family Members, Past Tense Verbs",
            )
            grade = st.selectbox("Grade Level", range(1, 13))

        with col2:
            class_duration = st.text_input(
                "Class Duration*", placeholder="e.g., 40 min"
            )
            co_teaching_model = st.selectbox(
                "Co-teaching Model", get_co_teaching_options()
            )

        # Classroom Setting
        classroom_setting = st.text_area(
            "Classroom Setting / Special Situation",
            placeholder="Describe the general classroom environment and setting.  \ne.g., English classroom, homeroom class, outdoors PE.",
        )

        # Learning Objectives
        st.subheader("Learning Objectives*")
        objectives = st.text_area(
            "*Students Will Be Able To (SWBAT):*",
            placeholder="Example:\nSWBAT identify common food vocabulary words\nSWBAT use 'I like' and 'I don't like' in simple sentences",
        )

        # Optional Information Section
        with st.expander("Extra Context (Optional)", expanded=False):
            # Class Context
            class_size = st.number_input(
                "Number of students", min_value=1, max_value=40, value=25
            )

            # Student Levels
            proficiency_levels = st.multiselect(
                "Student English Levels",
                ["Beginner", "Elementary", "Intermediate", "Advanced"],
                default=["Elementary"],
            )

            # Assessment Types
            assessment_types = st.multiselect(
                "How do you plan to assess student learning?",
                options=get_assessment_types(),
                placeholder="Select one or more ways you'll check student understanding during this lesson",
            )

            # Materials
            materials = st.text_area(
                "Teaching Materials",
                placeholder="List any specific materials you would like to use in this lesson",
            )

            # Key Vocabulary
            key_vocabulary = st.text_area(
                "Key Vocabulary or Phrases",
                placeholder="List any specific vocabulary or phrases you want to include",
            )

            # Extra Considerations
            extra_considerations = st.text_area(
                "Extra Considerations",
                placeholder="Add any additional important information about your class or lesson",
            )

        submitted = st.form_submit_button("Generate Lesson Plan")

    if submitted:
        # Validate required fields
        if not all([topic, class_duration, objectives]):
            st.error("Please fill in all the fields with asterisks.")
            return

        processor = LessonPlanProcessor()
        inputs = {
            "topic": topic,
            "grade": grade,
            "class_duration": class_duration,
            "objectives": objectives,
            "co_teaching_model": co_teaching_model,
            "classroom_setting": classroom_setting,
            "class_size": class_size,
            "proficiency_levels": proficiency_levels,
            "materials": materials,
            "key_vocabulary": key_vocabulary,
            "extra_considerations": extra_considerations,
            "assessment_types": assessment_types,
        }

        try:
            with st.spinner(
                "This can take a couple minutes. Please wait, making your lesson plan... ✨"
            ):
                processor = LessonPlanProcessor()

                # Generate components
                refined_objectives = processor.refine_objectives(
                    inputs["objectives"], inputs
                )
                procedures = processor.generate_activity_and_assessment(
                    refined_objectives, inputs
                )
                components = processor.prepare_lesson_components(
                    refined_objectives, procedures, inputs
                )
                lesson_plan = processor.create_final_lesson(
                    refined_objectives, procedures, components, inputs
                )

                # Only print debug info if DEBUG_MODE is True
                if DEBUG_MODE:
                    print("\n=== Input Parameters ===")
                    print(inputs)
                    print("\n=== Refined Objectives ===")
                    print(refined_objectives)
                    print("\n=== Procedures ===")
                    print(procedures)
                    print("\n=== Components ===")
                    print(components)
                    print("\n=== Final Plan ===")
                    print(lesson_plan)

                # Display the lesson plan
                display_lesson_plan(lesson_plan)

        except Exception as e:
            st.error(f"Error generating lesson plan: {str(e)}")
            if DEBUG_MODE:
                st.error(f"Debug details: {str(e)}")


if __name__ == "__main__":
    main()
