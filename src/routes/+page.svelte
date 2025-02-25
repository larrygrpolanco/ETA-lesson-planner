<script>
	import ETALessonForm from '$lib/components/ETALessonForm.svelte';
	import EMILessonForm from '$lib/components/EMILessonForm.svelte';

	let activeTab = 'eta'; // Default to ETA tab

	const coTeachingOptions = [
		'One teach, one observe',
		'One teach, one assist',
		'Team teaching',
		'station teaching',
		'Parallel teaching',
		'Alternative teaching'
	];

	const gradeOptions = Array.from({ length: 12 }, (_, i) => i + 1);
</script>

<div class="min-h-screen bg-gray-100">
	<main class="container mx-auto max-w-3xl px-6 py-16">
		<!-- Header -->
		<div class="mb-10 text-center">
			<h1 class="mb-3 text-3xl font-bold text-gray-900">Fulbright Lesson Planner</h1>
			<p class="text-lg text-gray-700">Craft personalized lesson plans effortlessly.</p>
		</div>

		<!-- Tabs -->
		<div class="mb-6 flex justify-center">
			<!-- Removed border-b from here -->
			<button
				class="<!-- Rounded top corners --> <!-- Smooth --> <!-- Subtle hover
				background --> rounded-t-md px-8 py-2 text-xl
				font-medium transition-colors duration-200 hover:bg-gray-50 focus:outline-none
				{activeTab === 'eta'
					? 'border-b-2 border-blue-500 bg-gray-100 text-blue-500' /* Active tab background */
					: 'text-gray-500 hover:text-gray-700'}"
				on:click={() => (activeTab = 'eta')}
			>
				ETA
			</button>
			<button
				class="<!-- Rounded top corners --> <!-- Smooth --> <!-- Subtle hover
				background --> rounded-t-md px-8 py-2 text-xl
				font-medium transition-colors duration-200 hover:bg-gray-50 focus:outline-none
				{activeTab === 'emi'
					? 'border-b-2 border-indigo-500 bg-gray-100 text-indigo-500' /* Active tab background */
					: 'text-gray-500 hover:text-gray-700'}"
				on:click={() => (activeTab = 'emi')}
			>
				EMI
			</button>
		</div>
		<div class="border-b border-gray-200"></div>
		<!-- Added border-b here separately -->

		<!-- ETA Form -->
		{#if activeTab === 'eta'}
			<ETALessonForm {coTeachingOptions} {gradeOptions} />
		{/if}

		<!-- EMI Form -->
		{#if activeTab === 'emi'}
			<EMILessonForm {coTeachingOptions} {gradeOptions} />
		{/if}
	</main>
</div>
