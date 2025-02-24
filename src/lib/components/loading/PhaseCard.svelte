<!-- src/lib/components/loading/PhaseCard.svelte -->
<script>
  import { slide } from 'svelte/transition';
  import { ChevronDown, ChevronUp, Check } from 'lucide-svelte';
  
  let { phase, content, isActive, isComplete, isExpanded, onToggle } = $props();
</script>

<div class="mb-4">
  <button 
    onclick={onToggle}
    class="flex w-full items-center justify-between rounded-lg border p-4 transition"
    class:bg-blue-50={isActive}
    class:bg-green-50={isComplete}
    class:bg-gray-50={!isComplete && !isActive}
  >
    <div class="flex items-center gap-3">
      <div class="h-6 w-6 rounded-full transition-colors"
        class:bg-green-500={isComplete}
        class:bg-blue-500={isActive}
        class:bg-gray-300={!isComplete && !isActive}
      >
        {#if isComplete}
          <Check class="h-6 w-6 text-white" />
        {/if}
      </div>
      <span class="font-medium">{phase}</span>
    </div>
    
    {#if content}
      {#if isExpanded}
        <ChevronUp class="h-5 w-5" />
      {:else}
        <ChevronDown class="h-5 w-5" />
      {/if}
    {/if}
  </button>

  {#if isExpanded && content}
    <div transition:slide class="mt-2 rounded-lg border bg-white p-4 prose max-w-none">
      {@html content}
    </div>
  {/if}
</div>