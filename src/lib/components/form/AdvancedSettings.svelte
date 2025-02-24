<!-- src/lib/components/form/AdvancedSettings.svelte -->
<script>
  import AutoExpandingTextarea from '../AutoExpandingTextarea.svelte';
  import CheckboxGroup from './CheckboxGroup.svelte';
  
  let { formData, tooltips } = $props();
  
  const proficiencyOptions = ["Beginner", "Elementary", "Intermediate", "Advanced"];
  const assessmentOptions = [
    "Watch & Note: observing student work and behavior",
    "Speaking Check: asking questions and listening to responses",
    "Quick Poll: understanding checks via thumbs up/down or voting",
    "Practice Task: students applying what they learned",
    "Group Work: collaborative demonstration of learning",
    "Written Check: quick writing tasks like worksheets or questions"
  ];
</script>

<section class="space-y-6">
  <AutoExpandingTextarea
    label="Classroom Setting"
    bind:value={formData.classroomSetting}
    placeholder="Describe your classroom environment"
    tooltip={tooltips.classroomSetting}
  />

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label class="font-medium mb-2">Number of Students</label>
      <input
        type="number"
        bind:value={formData.classSize}
        min="1"
        max="40"
        class="w-full p-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500/50"
      />
    </div>
    
    <div>
      <label class="font-medium mb-2">Student English Levels</label>
      <select
        multiple
        bind:value={formData.proficiencyLevels}
        class="w-full p-2 rounded border h-24 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
      >
        {#each proficiencyOptions as option}
          <option value={option}>{option}</option>
        {/each}
      </select>
    </div>
  </div>

  <CheckboxGroup
    label="Assessment Methods"
    options={assessmentOptions}
    bind:value={formData.assessmentTypes}
    tooltip={tooltips.assessmentTypes}
  />

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <AutoExpandingTextarea
      label="Teaching Materials"
      bind:value={formData.materials}
      placeholder="List your materials"
      tooltip={tooltips.materials}
    />
    
    <AutoExpandingTextarea
      label="Key Vocabulary/Phrases"
      bind:value={formData.keyVocabulary}
      placeholder="List target vocabulary"
      tooltip={tooltips.keyVocabulary}
    />
  </div>
</section>