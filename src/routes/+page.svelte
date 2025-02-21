<!-- src/routes/+page.svelte -->
<script lang="ts">
  import type { LessonPlanFormData, ApiResponse } from '$lib/types';
  import { OPTIONS } from '$lib/types';
  import "../app.css";
  
  // Initialize form data with proper types
  let formData: LessonPlanFormData = {
    topic: '',
    grade: 1,
    classDuration: '',
    coTeachingModel: 'One teach, one observe',
    classroomSetting: '',
    objectives: '',
    classSize: 25,
    proficiencyLevels: ['Elementary'],
    assessmentTypes: [],
    materials: '',
    keyVocabulary: '',
    extraConsiderations: ''
  };

  // State management
  let isLoading = false;
  let errorMessage = '';
  let lessonPlan = '';

  // Form submission handler
  async function handleSubmit(): Promise<void> {
    // Validate required fields
    if (!formData.topic || !formData.classDuration || !formData.objectives) {
      errorMessage = 'Please fill in all required fields (marked with *)';
      return;
    }

    isLoading = true;
    errorMessage = '';

    try {
      const response = await fetch('/api/generate-lesson', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to generate lesson plan');
      }

      const data: ApiResponse = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      lessonPlan = data.lessonPlan ?? '';
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    } finally {
      isLoading = false;
    }
  }

  // Generate array of grade options
  const gradeOptions = Array.from({ length: 12 }, (_, i) => i + 1);
</script>

<div class="container mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold mb-4">ETA Lesson Plan Generator</h1>
  <p class="mb-8">Create lesson plan ideas. Share your topic, objectives, and class details, and get a customized lesson plan draft.</p>

  <form on:submit|preventDefault={handleSubmit} class="space-y-6">
    <!-- Core Information -->
    <div class="bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-xl font-semibold mb-4">Class Context</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block mb-2">
            Topic/Theme*
            <input
              type="text"
              bind:value={formData.topic}
              placeholder="e.g., Food and Nutrition, Family Members"
              class="w-full p-2 border rounded"
            />
          </label>

          <label class="block mb-2">
            Grade Level
            <select 
              bind:value={formData.grade}
              class="w-full p-2 border rounded"
            >
              {#each gradeOptions as grade}
                <option value={grade}>{grade}</option>
              {/each}
            </select>
          </label>
        </div>

        <div>
          <label class="block mb-2">
            Class Duration*
            <input
              type="text"
              bind:value={formData.classDuration}
              placeholder="e.g., 40 min"
              class="w-full p-2 border rounded"
            />
          </label>

          <label class="block mb-2">
            Co-teaching Model
            <select 
              bind:value={formData.coTeachingModel}
              class="w-full p-2 border rounded"
            >
              {#each OPTIONS.coTeaching as option}
                <option value={option}>{option}</option>
              {/each}
            </select>
          </label>
        </div>
      </div>

      <label class="block mb-2">
        Classroom Setting
        <textarea
          bind:value={formData.classroomSetting}
          placeholder="Describe the general classroom environment and setting"
          class="w-full p-2 border rounded h-24"
        ></textarea>
      </label>

      <label class="block mb-2">
        Learning Objectives*
        <textarea
          bind:value={formData.objectives}
          placeholder="Example:&#10;SWBAT identify common food vocabulary words&#10;SWBAT use 'I like' and 'I don't like' in simple sentences"
          class="w-full p-2 border rounded h-32"
        ></textarea>
      </label>
    </div>

    <!-- Optional Information -->
    <div class="bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-xl font-semibold mb-4">Extra Context (Optional)</h2>
      
      <div class="space-y-4">
        <label class="block">
          Number of Students
          <input
            type="number"
            bind:value={formData.classSize}
            min="1"
            max="40"
            class="w-full p-2 border rounded"
          />
        </label>

        <label class="block">
          Student English Levels
          <select
            multiple
            bind:value={formData.proficiencyLevels}
            class="w-full p-2 border rounded"
          >
            {#each OPTIONS.proficiency as option}
              <option value={option}>{option}</option>
            {/each}
          </select>
        </label>

        <label class="block">
          Assessment Types
          <select
            multiple
            bind:value={formData.assessmentTypes}
            class="w-full p-2 border rounded"
          >
            {#each OPTIONS.assessment as option}
              <option value={option}>{option}</option>
            {/each}
          </select>
        </label>

        <label class="block">
          Teaching Materials
          <textarea
            bind:value={formData.materials}
            placeholder="List any specific materials you would like to use"
            class="w-full p-2 border rounded h-24"
          ></textarea>
        </label>

        <label class="block">
          Key Vocabulary or Phrases
          <textarea
            bind:value={formData.keyVocabulary}
            placeholder="List any specific vocabulary or phrases"
            class="w-full p-2 border rounded h-24"
          ></textarea>
        </label>

        <label class="block">
          Extra Considerations
          <textarea
            bind:value={formData.extraConsiderations}
            placeholder="Add any additional important information"
            class="w-full p-2 border rounded h-24"
          ></textarea>
        </label>
      </div>
    </div>

    {#if errorMessage}
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
        {errorMessage}
      </div>
    {/if}

    <button
      type="submit"
      class="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-blue-300"
      disabled={isLoading}
    >
      {isLoading ? 'Generating Lesson Plan...' : 'Generate Lesson Plan'}
    </button>
  </form>

  {#if lessonPlan}
    <div class="mt-8 bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-xl font-semibold mb-4">Generated Lesson Plan</h2>
      {@html lessonPlan}
    </div>
  {/if}
</div>

<style>
  :global(body) {
    background-color: #f3f4f6;
  }
</style>