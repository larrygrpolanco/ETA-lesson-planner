<!-- // src/routes/+page.svelte -->
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
		<div class="mb-6 flex border-b border-gray-200">
			<button
				class="px-4 py-2 text-sm font-medium focus:outline-none {activeTab === 'eta'
					? 'border-b-2 border-blue-500 text-blue-500'
					: 'text-gray-500 hover:text-gray-700'}"
				on:click={() => (activeTab = 'eta')}
			>
				ETA Lesson Plan
			</button>
			<button
				class="px-4 py-2 text-sm font-medium focus:outline-none {activeTab === 'emi'
					? 'border-b-2 border-blue-500 text-blue-500'
					: 'text-gray-500 hover:text-gray-700'}"
				on:click={() => (activeTab = 'emi')}
			>
				EMI Lesson Plan
			</button>
		</div>

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
