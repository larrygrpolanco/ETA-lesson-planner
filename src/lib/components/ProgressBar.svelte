<script>
	/**
	 * @type {{ name: string, key: string, content: null | string, isLoading: boolean, completed: boolean }[]}
	 */
	export let phases = [];

	$: completedPhasesCount = phases.filter((phase) => phase.completed).length;
	$: totalPhases = phases.length;
	$: progressPercentage = (completedPhasesCount / totalPhases) * 100;

	$: currentPhase = phases.find(phase => phase.isLoading);
	$: currentPhaseName = currentPhase?.name || ''; // Get the name of the loading phase
	$: showPhaseName = !!currentPhaseName; // Determine if we should show the phase name
</script>

<div class="mb-6">
	{#if showPhaseName}
		<p class="mb-2 text-center font-semibold text-gray-700">
			{currentPhaseName}
			{#if currentPhase?.isLoading}
				<span class="dot-animation">
					<span></span><span></span><span></span>
				</span>
			{/if}
		</p>
	{/if}
	<div class="h-2.5 w-full rounded-full bg-gray-200">
		<div
			class="h-2.5 rounded-full bg-sky-600 transition-all duration-500"
			style="width: {progressPercentage}%"
		></div>
	</div>
</div>

<style>
  /* You can add more styling for the phase name if needed here */
</style>