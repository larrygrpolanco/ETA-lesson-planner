<!-- src/lib/components/AutoExpandingTextarea.svelte -->
<script>
  import { slide } from 'svelte/transition';
  let { label, placeholder, value, tooltip } = $props();

  function adjustHeight(e) {
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  }
</script>

<div class="space-y-2">
  <div class="flex items-center gap-2">
    <!-- svelte-ignore a11y_label_has_associated_control -->
    <label class="font-medium">{label}</label>
    {#if tooltip}
      <button 
        class="group relative"
        aria-label="More information"
      >
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

  <textarea
    bind:value
    {placeholder}
    class="min-h-[40px] w-full rounded border p-2 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
    on:input={adjustHeight}
  />
</div>