<!-- src/routes/+page.svelte -->
<script>
	import BasicSettings from '$lib/components/form/BasicSettings.svelte';
	import AdvancedSettings from '$lib/components/form/AdvancedSettings.svelte';
	import ProgressDisplay from '$lib/components/loading/ProgressDisplay.svelte';
	import LessonPlanDisplay from '$lib/components/results/LessonPlanDisplay.svelte';

	// State management
	let activeTab = $state('basic');
	let isLoading = $state(false);
	let error = $state(null);
	let currentPhase = $state(null);
	let phaseContent = $state({
		'Refining objectives': null,
		'Generating activities': null,
		'Final lesson plan': null
	});

	// Form data
	let formData = $state({
		topic: '',
		grade: 1,
		classDuration: '',
		coTeachingModel: 'One teach, one observe',
		objectives: '',
		classroomSetting: '',
		classSize: 25,
		proficiencyLevels: ['Elementary'],
		assessmentTypes: [],
		materials: '',
		keyVocabulary: '',
		extraConsiderations: ''
	});

	// Pedagogical tooltips
	const tooltips = {
		classroomSetting: 'Understanding your space helps create suitable activities',
		classSize: 'Student numbers influence grouping and activity management',
		proficiencyLevels: 'Language levels guide appropriate scaffolding',
		assessmentTypes: 'Different methods help monitor various aspects of learning',
		materials: 'Available resources shape possible activities',
		keyVocabulary: 'Target language ensures focused practice',
		extraConsiderations: 'Special circumstances affecting lesson delivery'
	};

	async function handleSubmit() {
		isLoading = true;
		error = null;
		currentPhase = 'Refining objectives';

		try {
			const phases = ['refine-objectives', 'generate-activities', 'generate-lesson'];
			const phaseNames = {
				'refine-objectives': 'Refining objectives',
				'generate-activities': 'Generating activities',
				'generate-lesson': 'Final lesson plan'
			};

			for (const phase of phases) {
				currentPhase = phaseNames[phase];
				const response = await fetch(`/api/${phase}`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(formData)
				});

				if (!response.ok) throw new Error(`Failed to ${phase.replace('-', ' ')}`);
				phaseContent[phaseNames[phase]] = await response.text();
			}
		} catch (err) {
			error = err.message;
		} finally {
			isLoading = false;
		}
	}
</script>

<main class="container mx-auto max-w-4xl px-4 py-8">
	<h1 class="mb-4 text-3xl font-bold">ETA Lesson Plan Generator</h1>

	<p class="mb-8 text-gray-600">
		Create lesson plan ideas. Share your topic, objectives, and class details, and we'll help you
		draft a lesson plan. Use it as a starting point to build your perfect lesson.
	</p>

	<!-- Tab Navigation -->
	<nav class="mb-6 flex gap-4 border-b border-gray-200">
		<button
			class="px-4 py-2 transition"
			class:border-b-2={activeTab === 'basic'}
			class:border-blue-500={activeTab === 'basic'}
			class:text-blue-600={activeTab === 'basic'}
			on:click={() => (activeTab = 'basic')}
		>
			Basic Settings
		</button>
		<button
			class="px-4 py-2 transition"
			class:border-b-2={activeTab === 'advanced'}
			class:border-blue-500={activeTab === 'advanced'}
			class:text-blue-600={activeTab === 'advanced'}
			on:click={() => (activeTab = 'advanced')}
		>
			Advanced Settings
		</button>
	</nav>

	<!-- Main Form -->
	<form on:submit|preventDefault={handleSubmit} class="space-y-6">
		{#if activeTab === 'basic'}
			<BasicSettings {formData} />
		{:else}
			<AdvancedSettings {formData} {tooltips} />
		{/if}

		<button
			type="submit"
			class="w-full rounded bg-blue-500 px-6 py-2 text-white transition hover:bg-blue-600 disabled:bg-blue-300 md:w-auto"
			disabled={isLoading}
		>
			{isLoading ? 'Generating...' : 'Generate Lesson Plan'}
		</button>
	</form>

	<!-- Error Display -->
	{#if error}
		<div class="mt-6 border-l-4 border-red-500 bg-red-100 p-4">
			<p class="text-red-700">{error}</p>
		</div>
	{/if}

	<!-- Loading Progress -->
	{#if isLoading}
		<ProgressDisplay
			phases={Object.entries(phaseContent).map(([name, content]) => ({
				name,
				content,
				isComplete: content !== null
			}))}
			{currentPhase}
		/>
	{/if}

	<!-- Result Display -->
	{#if phaseContent['Final lesson plan'] && !isLoading}
		<LessonPlanDisplay content={phaseContent['Final lesson plan']} />
	{/if}
</main>
