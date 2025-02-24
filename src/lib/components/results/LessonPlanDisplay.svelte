<!-- src/lib/components/results/LessonPlanDisplay.svelte -->
<script>
  import { fade } from 'svelte/transition';
  import { Copy, Check } from 'lucide-svelte';
  
  let { content } = $props();
  let copied = $state(false);
  
  async function copyToClipboard() {
    await navigator.clipboard.writeText(content);
    copied = true;
    setTimeout(() => copied = false, 2000);
  }
</script>

<div class="bg-white rounded-lg shadow-lg p-6 prose max-w-none" transition:fade>
  <div class="flex justify-between items-center mb-6">
    <h2 class="text-2xl font-bold m-0">Your Lesson Plan</h2>
    <button 
      on:click={copyToClipboard}
      class="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
    >
      {#if copied}
        <Check class="h-4 w-4" />
        <span>Copied!</span>
      {:else}
        <Copy class="h-4 w-4" />
        <span>Copy</span>
      {/if}
    </button>
  </div>
  
  <div class="markdown-content">
    {@html content}
  </div>
</div>