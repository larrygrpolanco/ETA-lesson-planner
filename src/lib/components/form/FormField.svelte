<!-- src/lib/components/form/FormField.svelte -->
<script>
  import { Info } from 'lucide-svelte';
  
  let { label, tooltip, required = false } = $props();
</script>

<div class="space-y-2">
  <div class="flex items-center space-x-2">
    <!-- svelte-ignore a11y_label_has_associated_control -->
    <label class="block font-medium">
      {label}{#if required}<span class="text-red-500">*</span>{/if}
    </label>
    {#if tooltip}
      <div class="relative group">
        <Info class="w-4 h-4 text-gray-400 cursor-help" />
        <div class="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-gray-800 text-white text-sm rounded shadow-lg">
          {tooltip}
        </div>
      </div>
    {/if}
  </div>
  <slot />
</div>