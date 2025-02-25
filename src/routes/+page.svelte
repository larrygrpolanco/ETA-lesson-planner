<!-- // src/routes/+page.svelte -->
<script>
	import { marked } from 'marked'; // Import marked
	import ProgressBar from '$lib/components/ProgressBar.svelte';

	let formData = {
		topic: '',
		grade: 1,
		classDuration: '',
		coTeachingModel: 'One teach, one observe',
		objectives: '',
		classDescription: ''
	};

	const coTeachingOptions = [
		'One teach, one observe',
		'One teach, one assist',
		'Team teaching',
		'station teaching',
		'Parallel teaching',
		'Alternative teaching'
	];

	const gradeOptions = Array.from({ length: 12 }, (_, i) => i + 1);

	let lessonPlan = null;
	let isLoading = false;
	let error = null;
	let phases = [
		// Initialize phases with loading state
		{
			name: 'Refining Objectives',
			key: 'objectives',
			content: null,
			isLoading: false,
			completed: false
		},
		{
			name: 'Generating Activities',
			key: 'activities',
			content: null,
			isLoading: false,
			completed: false
		},
		{
			name: 'Preparing Components',
			key: 'components',
			content: null,
			isLoading: false,
			completed: false
		},
		{
			name: 'Creating Final Plan',
			key: 'finalPlan',
			content: null,
			isLoading: false,
			completed: false
		}
	];
	let finalLessonPlanOutput = null;

	async function handleSubmit() {
		isLoading = true;
		error = null;
		lessonPlan = null;
		finalLessonPlanOutput = null;
		phases = phases.map((phase) => ({
			...phase,
			content: null,
			isLoading: false,
			completed: false
		})); // Reset all phases

		for (let i = 0; i < phases.length; i++) {
			const phase = phases[i];
			phases = phases.map((p, index) => (index === i ? { ...p, isLoading: true } : p)); // Start loading current phase
			phases = [...phases]; // trigger reactivity

			try {
				const response = await fetch('/api/generate-lesson', {
					// backend will simulate phases sequentially
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						phase: phase.name // <--- ADD THIS HEADER to send phase name
					},
					body: JSON.stringify(formData)
				});

				if (!response.ok) throw new Error(`Failed to generate ${phase.name}`);
				const data = await response.json();

				if (data.phase.name === 'Creating Final Plan') {
					finalLessonPlanOutput = data.phase.content;
					lessonPlan = finalLessonPlanOutput;
				}

				phases = phases.map((p, index) => {
					if (index === i) {
						return { ...p, content: data.phase.content, isLoading: false, completed: true }; // Phase complete
					}
					return p;
				});
				phases = [...phases]; // trigger reactivity
			} catch (err) {
				error = err.message;
				phases = phases.map((p) => ({ ...p, isLoading: false })); // Stop loading on error
				phases = [...phases]; // trigger reactivity
				break; // Stop processing further phases on error
			}
		}
		isLoading = false; // Overall loading complete (or stopped due to error)
	}

	function copyToClipboard() {
		if (finalLessonPlanOutput) {
			navigator.clipboard
				.writeText(JSON.stringify(finalLessonPlanOutput, null, 2))
				.then(() => {
					alert('Lesson plan copied to clipboard!');
				})
				.catch((err) => {
					console.error('Failed to copy: ', err);
					alert('Failed to copy lesson plan to clipboard.');
				});
		}
	}
</script>

<div class="min-h-screen bg-gray-100">
	<main class="container mx-auto max-w-3xl px-6 py-16">
		<!-- Header -->
		<div class="mb-10 text-center">
			<h1 class="mb-3 text-3xl font-bold text-gray-900">ETA Lesson Planner</h1>
			<p class="text-lg text-gray-700">Craft personalized lesson plans effortlessly.</p>
		</div>

		<!-- Main Form -->
		<form
			on:submit|preventDefault={handleSubmit}
			class="space-y-6 rounded-lg border border-gray-200 bg-white p-8 shadow-md"
		>
			<!-- Form fields - same as before -->
			<!-- ... (form fields remain the same) ... -->
			<div class="form-group">
				<div class="input-group">
					<input
						type="text"
						id="topic"
						bind:value={formData.topic}
						placeholder=""
						class="input-field peer"
						required
					/>
					<label for="topic" class="input-label"> Lesson Topic </label>
				</div>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 md:gap-4">
				<div class="form-group">
					<div class="input-group">
						<input
							type="text"
							id="classDuration"
							bind:value={formData.classDuration}
							placeholder=""
							class="input-field peer"
							required
						/>
						<label for="classDuration" class="input-label"> Class Duration </label>
					</div>
				</div>
				<div class="form-group">
					<div class="input-group">
						<select id="grade" bind:value={formData.grade} class="input-field peer" required>
							{#each gradeOptions as grade}
								<option value={grade}>Grade {grade}</option>
							{/each}
							<option>University</option>
						</select>
						<label for="grade" class="input-label"> Grade Level </label>
					</div>
				</div>
			</div>

			<div class="form-group">
				<div class="input-group">
					<select
						id="coTeachingModel"
						bind:value={formData.coTeachingModel}
						class="input-field peer"
						required
					>
						{#each coTeachingOptions as option}
							<option value={option}>{option}</option>
						{/each}
					</select>
					<label for="coTeachingModel" class="input-label"> Co-teaching Model </label>
				</div>
			</div>

			<div class="form-group">
				<div class="input-group">
					<textarea
						id="objectives"
						bind:value={formData.objectives}
						placeholder=" "
						class="input-field peer h-28"
						required
					></textarea>
					<label for="objectives" class="input-label"> Learning Objectives </label>
				</div>
			</div>

			<div class="form-group">
				<div class="input-group">
					<textarea
						id="classDescription"
						bind:value={formData.classDescription}
						placeholder=""
						class="input-field peer h-28"
					></textarea>
					<label for="classDescription" class="input-label">
						Classroom Context <span class="text-gray-500">(Optional)</span>
					</label>
				</div>
				<p class="mt-3 text-sm text-gray-600">
					Provide details about your class - size, levels, special needs, etc.
				</p>
			</div>

			<div>
				<button type="submit" class="submit-button" disabled={isLoading}>
					{#if isLoading}
						Creating Lesson
					{:else}
						Generate Plan
					{/if}
				</button>
			</div>
		</form>

		<!-- Error Display -->
		{#if error}
			<div class="mt-6 rounded-md border-l-4 border-red-500 bg-red-50 p-4">
				<p class="text-red-700">{error}</p>
			</div>
		{/if}

		<!-- Results Display Section -->
		{#if isLoading || finalLessonPlanOutput}
			<div class>
				<ProgressBar {phases} />
				<!-- Final Lesson Plan - Not Collapsible -->
				{#if finalLessonPlanOutput}
					<div class="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
						<div class="markdown-body">
							{@html marked.parse(finalLessonPlanOutput)}
						</div>
						<div class="mt-4">
							<button class="submit-button" on:click={copyToClipboard}>Copy to Clipboard</button>
						</div>
					</div>
				{/if}
			</div>
		{/if}
	</main>
</div>
