<!-- src/lib/components/form/BasicSettings.svelte -->
<script>
  import FormField from './FormField.svelte';
  import AutoExpandingTextarea from '../AutoExpandingTextarea.svelte';
  
  let { formData } = $props();
  
  const coTeachingOptions = [
    "One teach, one observe",
    "One teach, one assist", 
    "Team teaching",
    "Station teaching",
    "Parallel teaching",
    "Alternative teaching"
  ];
</script>

<section class="space-y-6">
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <FormField label="Topic/Theme" required={true}>
      <input
        type="text"
        bind:value={formData.topic}
        placeholder="e.g., Food and Nutrition, Family Members"
        class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        required
      />
    </FormField>
    
    <FormField label="Grade Level">
      <select
        bind:value={formData.grade}
        class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        {#each Array(12) as _, i}
          <option value={i + 1}>{i + 1}</option>
        {/each}
      </select>
    </FormField>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <FormField label="Class Duration" required={true}>
      <input
        type="text"
        bind:value={formData.classDuration}
        placeholder="e.g., 40 min"
        class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        required
      />
    </FormField>
    
    <FormField label="Co-teaching Model">
      <select
        bind:value={formData.coTeachingModel}
        class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        {#each coTeachingOptions as option}
          <option value={option}>{option}</option>
        {/each}
      </select>
    </FormField>
  </div>

  <FormField label="Learning Objectives" required={true}>
    <AutoExpandingTextarea
      value={formData.objectives}
      placeholder="Example:&#10;SWBAT identify common food vocabulary words&#10;SWBAT use 'I like' and 'I don't like' in simple sentences"
      required
    />
  </FormField>
</section>