<!-- src/lib/components/form/CheckboxGroup.svelte -->
<script>
  import { slide } from 'svelte/transition';
  
  let { label, options, value, tooltip } = $props();
</script>

<div class="space-y-2">
  <div class="flex items-center gap-2">
    <label class="font-medium">{label}</label>
    {#if tooltip}
      <button class="group relative" aria-label="More information">
        <svg class="h-4 w-4 text-gray-400" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
          <path d="M12 16v-4" stroke="currentColor" stroke-width="2"/>
          <circle cx="12" cy="8" r="1" fill="currentColor"/>
        </svg>
        <div class="invisible absolute bottom-full left-1/2 mb-2 w-64 -translate-x-1/2 rounded bg-gray-800 p-2 text-sm text-white shadow-lg group-hover:visible">
          {tooltip}
        </div>
      </button>
    {/if}
  </div>

  <div class="space-y-2">
    {#each options as option}
      <label class="flex items-start rounded bg-gray-50 p-2 hover:bg-gray-100 transition cursor-pointer">
        <input
          type="checkbox"
          value={option}
          bind:group={value}
          class="mt-1 h-4 w-4"
        />
        <span class="ml-2">{option}</span>
      </label>
    {/each}
  </div>
</div>