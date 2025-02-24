<!-- src/lib/components/loading/ProgressDisplay.svelte -->
<script>
  import PhaseCard from './PhaseCard.svelte';
  
  let { phases, currentPhase } = $props();
  let expandedPhase = $state(null);
</script>

<div class="mx-auto max-w-2xl">
  {#each phases as phase}
    <PhaseCard 
      {...phase}
      isActive={currentPhase === phase.name}
      isExpanded={expandedPhase === phase.name}
      onToggle={() => expandedPhase = expandedPhase === phase.name ? null : phase.name}
    />
  {/each}
</div>