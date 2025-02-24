<!-- // src/routes/+page.svelte -->
<script>
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
		{ name: 'Refining Objectives', key: 'objectives', content: null, isLoading: false, completed: false },
		{ name: 'Generating Activities', key: 'activities', content: null, isLoading: false, completed: false },
		{ name: 'Preparing Components', key: 'components', content: null, isLoading: false, completed: false },
		{ name: 'Creating Final Plan', key: 'finalPlan', content: null, isLoading: false, completed: false }
	];
	let finalLessonPlanOutput = null;

	async function handleSubmit() {
		isLoading = true;
		error = null;
		lessonPlan = null;
		finalLessonPlanOutput = null;
		phases = phases.map(phase => ({ ...phase, content: null, isLoading: false, completed: false })); // Reset all phases

		for (let i = 0; i < phases.length; i++) {
			const phase = phases[i];
			phases = phases.map((p, index) => index === i ? { ...p, isLoading: true } : p); // Start loading current phase
			phases = [...phases]; // trigger reactivity

			try {
				const response = await fetch('/api/generate-lesson', { // backend will simulate phases sequentially
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(formData)
				});

				if (!response.ok) throw new Error(`Failed to generate ${phase.name}`);
				const data = await response.json();

				if (data.phase.name === 'Creating Final Plan') { // Last phase returns final lesson plan
					finalLessonPlanOutput = data.finalLessonPlan;
					lessonPlan = finalLessonPlanOutput; // For existing logic
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
				phases = phases.map(p => ({ ...p, isLoading: false })); // Stop loading on error
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

<style>
	.spinner {
		border: 4px solid rgba(0, 0, 0, 0.1);
		border-top: 4px solid #3498db;
		border-radius: 50%;
		width: 20px;
		height: 20px;
		animation: spin 1s linear infinite;
		display: inline-block; /* To align with text */
		margin-left: 8px;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>

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
					{isLoading ? 'Creating Lesson...' : 'Generate Plan'}
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
		{#if phases.some((phase) => phase.completed) || finalLessonPlanOutput}
			<div class>
				<!-- Preliminary Phases - Collapsible -->
				{#each phases as phase}
					{#if phase.completed || phase.isLoading || phase.content} <!-- Show phases as they complete or load -->
						<details
							class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
							open={phase.completed || phase.isLoading}
						>
							<summary class="font-semibold text-gray-900 marker:text-sky-500">
								{phase.name}
								{#if phase.isLoading}
									<div class="spinner"></div>
								{/if}
							</summary>
							<div class="mt-2 text-gray-700">
								{#if phase.content}
									<pre class="whitespace-pre-wrap">{phase.content.content
											? JSON.stringify(phase.content.content, null, 2)
											: phase.content}</pre>
								{:else if phase.isLoading}
									<p>Processing...</p>
								{/if}
							</div>
						</details>
					{/if}
				{/each}

				<!-- Final Lesson Plan - Not Collapsible -->
				{#if finalLessonPlanOutput}
					<div class="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
						<h2 class="mb-4 text-2xl font-bold text-gray-900">
							Final Lesson Plan: {finalLessonPlanOutput.topic}
						</h2>
						<pre class="whitespace-pre-wrap">{JSON.stringify(finalLessonPlanOutput, null, 2)}</pre>
						<div class="mt-4">
							<button class="submit-button" on:click={copyToClipboard}>Copy to Clipboard</button>
						</div>
					</div>
				{/if}
			</div>
		{/if}
	</main>
</div>