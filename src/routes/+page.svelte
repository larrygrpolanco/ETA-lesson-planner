<!-- src/routes/+page.svelte -->
<script>
	import ETALessonForm from '$lib/components/ETALessonForm.svelte';
	import EMIWorkshopForm from '$lib/components/EMIWorkshopForm.svelte';
	import DarkModeToggle from '$lib/components/DarkModeToggle.svelte';

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

<!-- src/routes/+page.svelte -->
<div class="min-h-screen bg-gray-100 transition-colors duration-500 dark:bg-slate-900">
	<main class="container mx-auto max-w-3xl px-6 py-16">
		<!-- Header with Dark Mode Toggle -->
		<div class="relative mb-10 text-center">
			<div class="absolute top-0 right-0">
				<DarkModeToggle />
			</div>
			<h1 class="mb-3 text-3xl font-bold text-gray-900 dark:text-slate-200">
				Fulbright Lesson Planner
			</h1>
			<p class="text-lg text-gray-700 dark:text-slate-400">
				Craft personalized lesson plans effortlessly.
			</p>
		</div>

		<!-- Tabs with softer dark mode variants -->
		<div class="mb-0 flex w-full">
			<button
				class="flex-1 rounded-t-md px-4 pt-3 text-xl font-medium transition-colors
                duration-500 focus:outline-none {activeTab === 'eta'
					? 'border-b-2 border-blue-500 text-blue-500 dark:border-blue-400 dark:text-blue-400'
					: 'text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-300'}"
				on:click={() => (activeTab = 'eta')}
			>
				Lesson
			</button>
			<button
				class="flex-1 rounded-t-md px-4 pt-3 text-xl font-medium transition-colors
                duration-500 focus:outline-none {activeTab === 'emi'
					? 'border-b-2 border-indigo-500 text-indigo-500 dark:border-indigo-400 dark:text-indigo-400'
					: 'text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-300'}"
				on:click={() => (activeTab = 'emi')}
			>
				Workshop
			</button>
		</div>

		<!-- Form components -->
		{#if activeTab === 'eta'}
			<ETALessonForm {coTeachingOptions} {gradeOptions} />
		{/if}

		{#if activeTab === 'emi'}
			<EMIWorkshopForm />
		{/if}
	</main>
</div>
