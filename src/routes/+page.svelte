// src/routes/+page.svelte
<script>
  // Tab management
  let activeTab = 'basic';
  
  // Form data store
  let formData = {
    // Core fields (Basic Settings tab)
    topic: '',
    grade: 1,
    classDuration: '',
    coTeachingModel: 'One teach, one observe',
    objectives: '',
    
    // Optional fields (Advanced Settings tab)
    classroomSetting: '',
    classSize: 25,
    proficiencyLevels: ['Elementary'],
    assessmentTypes: [],
    materials: '',
    keyVocabulary: '',
    extraConsiderations: ''
  };

  // Options for select inputs
  const coTeachingOptions = [
    "One teach, one observe",
    "One teach, one assist", 
    "Team teaching",
    "Station teaching",
    "Parallel teaching",
    "Alternative teaching"
  ];

  const assessmentOptions = [
    "Watch & Note: observing student work and behavior",
    "Speaking Check: asking questions and listening to responses",
    "Quick Poll: understanding checks via thumbs up/down or voting",
    "Practice Task: students applying what they learned",
    "Group Work: collaborative demonstration of learning",
    "Written Check: quick writing tasks like worksheets or questions"
  ];

  const proficiencyOptions = ["Beginner", "Elementary", "Intermediate", "Advanced"];

  // Form submission handling
  let isLoading = false;
  let error = null;
  let lessonPlan = null;

  async function handleSubmit() {
    isLoading = true;
    error = null;
    
    try {
      const response = await fetch('/api/generate-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to generate lesson plan');
      lessonPlan = await response.json();
    } catch (err) {
      error = err.message;
    } finally {
      isLoading = false;
    }
  }
</script>

<main class="container mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold mb-4">ETA Lesson Plan Generator</h1>
  
  <p class="mb-8">
    Create lesson plan ideas. Share your topic, objectives, and class details, 
    and we'll help you draft a lesson plan. Use it as a starting point to build 
    your perfect lesson.
  </p>

  <!-- Tab Navigation -->
  <div class="border-b border-gray-200 mb-6">
    <nav class="flex space-x-4">
      <button
        class="px-4 py-2 {activeTab === 'basic' ? 'border-b-2 border-blue-500 text-blue-600' : ''}"
        on:click={() => activeTab = 'basic'}
      >
        Basic Settings
      </button>
      <button
        class="px-4 py-2 {activeTab === 'advanced' ? 'border-b-2 border-blue-500 text-blue-600' : ''}"
        on:click={() => activeTab = 'advanced'}
      >
        Advanced Settings
      </button>
    </nav>
  </div>

  <!-- Main Form -->
  <form on:submit|preventDefault={handleSubmit} class="space-y-6 mb-8">
    {#if activeTab === 'basic'}
      <!-- Basic Settings Tab -->
      <section class="space-y-6">
        <!-- Topic and Grade -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="topic" class="block font-medium mb-1">Topic/Theme*</label>
            <input
              type="text"
              id="topic"
              bind:value={formData.topic}
              placeholder="e.g., Food and Nutrition, Family Members"
              class="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div>
            <label for="grade" class="block font-medium mb-1">Grade Level</label>
            <select
              id="grade"
              bind:value={formData.grade}
              class="w-full p-2 border rounded"
            >
              {#each Array(12) as _, i}
                <option value={i + 1}>{i + 1}</option>
              {/each}
            </select>
          </div>
        </div>

        <!-- Duration and Co-teaching Model -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="duration" class="block font-medium mb-1">Class Duration*</label>
            <input
              type="text"
              id="duration"
              bind:value={formData.classDuration}
              placeholder="e.g., 40 min"
              class="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div>
            <label for="coTeaching" class="block font-medium mb-1">Co-teaching Model</label>
            <select
              id="coTeaching"
              bind:value={formData.coTeachingModel}
              class="w-full p-2 border rounded"
            >
              {#each coTeachingOptions as option}
                <option value={option}>{option}</option>
              {/each}
            </select>
          </div>
        </div>

        <!-- Objectives -->
        <div>
          <label for="objectives" class="block font-medium mb-1">Learning Objectives*</label>
          <textarea
            id="objectives"
            bind:value={formData.objectives}
            placeholder="Example:&#10;SWBAT identify common food vocabulary words&#10;SWBAT use 'I like' and 'I don't like' in simple sentences"
            class="w-full p-2 border rounded h-32"
            required
          ></textarea>
        </div>
      </section>
    {:else}
      <!-- Advanced Settings Tab -->
      <section class="space-y-6">
        <!-- Classroom Setting -->
        <div>
          <label for="setting" class="block font-medium mb-1">Classroom Setting</label>
          <textarea
            id="setting"
            bind:value={formData.classroomSetting}
            placeholder="Describe the general classroom environment and setting.&#10;e.g., English classroom, homeroom class, outdoors PE."
            class="w-full p-2 border rounded h-24"
          ></textarea>
        </div>

        <!-- Class Size and Proficiency Levels -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="classSize" class="block font-medium mb-1">Number of Students</label>
            <input
              type="number"
              id="classSize"
              bind:value={formData.classSize}
              min="1"
              max="40"
              class="w-full p-2 border rounded"
            />
          </div>
          
          <div>
            <label for="proficiency" class="block font-medium mb-1">Student English Levels</label>
            <select
              id="proficiency"
              multiple
              bind:value={formData.proficiencyLevels}
              class="w-full p-2 border rounded h-24"
            >
              {#each proficiencyOptions as option}
                <option value={option}>{option}</option>
              {/each}
            </select>
          </div>
        </div>

        <!-- Assessment Types -->
        <div>
          <label class="block font-medium mb-1">Assessment Methods</label>
          <div class="space-y-2">
            {#each assessmentOptions as option}
              <label class="flex items-start space-x-2">
                <input
                  type="checkbox"
                  value={option}
                  bind:group={formData.assessmentTypes}
                  class="mt-1"
                />
                <span>{option}</span>
              </label>
            {/each}
          </div>
        </div>

        <!-- Materials and Vocabulary -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="materials" class="block font-medium mb-1">Teaching Materials</label>
            <textarea
              id="materials"
              bind:value={formData.materials}
              placeholder="List any specific materials you would like to use"
              class="w-full p-2 border rounded h-24"
            ></textarea>
          </div>
          
          <div>
            <label for="vocabulary" class="block font-medium mb-1">Key Vocabulary/Phrases</label>
            <textarea
              id="vocabulary"
              bind:value={formData.keyVocabulary}
              placeholder="List any specific vocabulary or phrases to include"
              class="w-full p-2 border rounded h-24"
            ></textarea>
          </div>
        </div>

        <!-- Extra Considerations -->
        <div>
          <label for="extra" class="block font-medium mb-1">Extra Considerations</label>
          <textarea
            id="extra"
            bind:value={formData.extraConsiderations}
            placeholder="Add any additional important information about your class or lesson"
            class="w-full p-2 border rounded h-24"
          ></textarea>
        </div>
      </section>
    {/if}

    <!-- Submit Button (shown on both tabs) -->
    <button
      type="submit"
      class="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
      disabled={isLoading}
    >
      {isLoading ? 'Generating...' : 'Generate Lesson Plan'}
    </button>
  </form>

  <!-- Error Display -->
  {#if error}
    <div class="bg-red-100 border-l-4 border-red-500 p-4 mb-4">
      <p class="text-red-700">{error}</p>
    </div>
  {/if}

  <!-- Lesson Plan Display -->
  {#if lessonPlan}
    <section class="bg-white p-6 rounded-lg shadow-lg">
      <h2 class="text-2xl font-bold mb-4">{lessonPlan.topic}</h2>
      <!-- Add more lesson plan display structure here -->
    </section>
  {/if}
</main>