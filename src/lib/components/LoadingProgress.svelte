<!-- src/lib/components/LoadingProgress.svelte -->
<script>
	import { ChevronDown, ChevronUp, Check } from 'lucide-svelte';

	// Props for the component
	let { phases, currentPhase } = $props();

	let expandedPhase = $state(null);
</script>

<div class="mx-auto max-w-2xl">
	{#each phases as { phase, content, isComplete }}
		<div class="mb-4">
			<button
				onclick={() => (expandedPhase = expandedPhase === phase ? null : phase)}
				class="flex w-full items-center justify-between rounded-lg p-4"
				class:bg-blue-50={currentPhase === phase}
				class:border-blue-200={currentPhase === phase}
				class:bg-green-50={isComplete}
				class:border-green-200={isComplete}
				class:bg-gray-50={!isComplete && currentPhase !== phase}
				class:border-gray-200={!isComplete && currentPhase !== phase}
			>
				<div class="flex items-center space-x-3">
					{#if isComplete}
						<div class="flex h-6 w-6 items-center justify-center rounded-full bg-green-500">
							<Check class="h-4 w-4 text-white" />
						</div>
					{:else}
						<div
							class="h-6 w-6 rounded-full"
							class:bg-blue-500={currentPhase === phase}
							class:bg-gray-300={currentPhase !== phase}
						></div>
					{/if}
					<span class="font-medium">{phase}</span>
				</div>

				{#if content}
					{#if expandedPhase === phase}
						<ChevronUp class="h-5 w-5" />
					{:else}
						<ChevronDown class="h-5 w-5" />
					{/if}
				{/if}
			</button>

			{#if expandedPhase === phase && content}
				<div class="prose mt-2 max-w-none rounded-lg border border-gray-200 bg-white p-4">
					{@html content}
				</div>
			{/if}
		</div>
	{/each}
</div>
