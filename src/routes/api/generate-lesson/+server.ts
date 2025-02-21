// src/routes/api/generate-lesson/+server.ts
import { ANTHROPIC_API_KEY } from '$env/static/private';
import { json, type RequestEvent } from '@sveltejs/kit';
import type { LessonPlanFormData, ApiResponse } from '$lib/types';

export async function POST({ request }: RequestEvent) {
  try {
    const formData: LessonPlanFormData = await request.json();
    
    // Format the context for the AI model
    const context = {
      topic: formData.topic,
      grade: formData.grade,
      class_duration: formData.classDuration,
      co_teaching_model: formData.coTeachingModel,
      classroom_setting: formData.classroomSetting,
      objectives: formData.objectives,
      class_size: formData.classSize,
      proficiency_levels: formData.proficiencyLevels,
      assessment_types: formData.assessmentTypes,
      materials: formData.materials,
      key_vocabulary: formData.keyVocabulary,
      extra_considerations: formData.extraConsiderations
    };

    // Create the prompt template
    const prompt = `Generate a detailed lesson plan based on the following information:
    
    Topic: ${context.topic}
    Grade Level: ${context.grade}
    Class Duration: ${context.class_duration}
    Co-teaching Model: ${context.co_teaching_model}
    
    Objectives:
    ${context.objectives}
    
    Classroom Setting:
    ${context.classroom_setting || 'Not specified'}
    
    Additional Context:
    - Class Size: ${context.class_size}
    - Proficiency Levels: ${context.proficiency_levels.join(', ')}
    - Assessment Types: ${context.assessment_types.join(', ')}
    
    Please provide a structured lesson plan including:
    1. Clear learning objectives
    2. Required materials
    3. Step-by-step procedure
    4. Assessment strategies
    5. Extension activities`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2024-02-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20241022',
        max_tokens: 4000,
        messages: [{
          role: 'user',
          content: prompt
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    return json({ lessonPlan: data.content[0].text } satisfies ApiResponse);
  } catch (error) {
    console.error('Error generating lesson plan:', error);
    return json(
      { error: 'Failed to generate lesson plan' } satisfies ApiResponse,
      { status: 500 }
    );
  }
}