<!-- EMIWorkshopForm.svelte -->

<script>
	import { marked } from 'marked';
	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import removeMd from 'remove-markdown';

	// Define audience options specifically for EMI workshops
	let audienceOptions = [
		'Teachers',
		'University Students',
		'Senior High Students',
		'Elementary Students',
		'Junior High Students'
	];

	let formData = {
		topic: '',
		audience: 'University Students', // Changed from grade to audience with University default
		workshopDuration: '', // Changed from classDuration
		participantCount: '', // Changed from coTeachingModel to number of participants
		objectives: '',
		workshopContext: '' // Changed from classDescription to be more workshop-focused
	};

	let workshopPlan = null;
	let isLoading = false;
	let error = null;
	let phases = [
		{
			name: 'Refining Objectives',
			key: 'objectives',
			content: null,
			isLoading: false,
			completed: false
		},
		{
			name: 'Designing Activities',
			key: 'activities',
			content: null,
			isLoading: false,
			completed: false
		},
		{
			name: 'Creating Interactive Elements',
			key: 'components',
			content: null,
			isLoading: false,
			completed: false
		},
		{
			name: 'Finalizing Workshop Plan',
			key: 'finalPlan',
			content: null,
			isLoading: false,
			completed: false
		}
	];
	let finalWorkshopPlanOutput = null;

	async function handleSubmit() {
		isLoading = true;
		error = null;
		workshopPlan = null;
		finalWorkshopPlanOutput = null;
		phases = phases.map((phase) => ({
			...phase,
			content: null,
			isLoading: false,
			completed: false
		}));

		for (let i = 0; i < phases.length; i++) {
			const phase = phases[i];
			phases = phases.map((p, index) => (index === i ? { ...p, isLoading: true } : p));
			phases = [...phases];

			try {
				const response = await fetch('/api/generate-emi-lesson', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json', phase: phase.name },
					body: JSON.stringify({
						...formData,
						phases: phases.map((p) => ({
							key: p.key,
							name: p.name,
							content: p.content,
							completed: p.completed
						}))
					})
				});

				if (!response.ok) throw new Error(`Failed to generate ${phase.name} for EMI workshop`);
				const data = await response.json();

				if (data.phase.name === 'Finalizing Workshop Plan') {
					finalWorkshopPlanOutput = data.phase.content;
					workshopPlan = finalWorkshopPlanOutput;
				}

				phases = phases.map((p, index) => {
					if (index === i) {
						return { ...p, content: data.phase.content, isLoading: false, completed: true };
					}
					return p;
				});
				phases = [...phases];
			} catch (err) {
				error = err.message;
				phases = phases.map((p) => ({ ...p, isLoading: false }));
				phases = [...phases];
				break;
			}
		}
		isLoading = false;
	}

	function copyToClipboard() {
		if (finalLessonPlanOutput) {
			// Convert markdown to plain text
			const plainText = removeMd(finalLessonPlanOutput);

			navigator.clipboard
				.writeText(plainText)
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

<div class="emi-form">
	<form
		on:submit|preventDefault={handleSubmit}
		autocomplete="off"
		class="space-y-6 border border-gray-200 bg-white p-8 shadow-md transition-colors duration-500 dark:border-slate-700 dark:bg-slate-800"
	>
		<div class="form-group">
			<div class="input-group">
				<input
					type="text"
					id="emi-topic"
					bind:value={formData.topic}
					placeholder=""
					class="input-field peer"
					required
				/>
				<label for="emi-topic" class="input-label">Workshop Topic</label>
			</div>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 md:gap-4">
			<div class="form-group">
				<div class="input-group">
					<input
						type="text"
						id="emi-workshopDuration"
						bind:value={formData.workshopDuration}
						placeholder=""
						class="input-field peer"
						required
					/>
					<label for="emi-workshopDuration" class="input-label">Workshop Duration</label>
				</div>
			</div>
			<div class="form-group">
				<div class="input-group">
					<input
						type="text"
						id="emi-participantCount"
						bind:value={formData.participantCount}
						placeholder=""
						class="input-field peer"
						required
					/>
					<label for="emi-participantCount" class="input-label">Number of Participants</label>
				</div>
			</div>
		</div>

		<div class="form-group">
			<div class="input-group">
				<select id="emi-audience" bind:value={formData.audience} class="input-field peer" required>
					{#each audienceOptions as option}
						<option value={option}>{option}</option>
					{/each}
				</select>
				<label for="emi-audience" class="input-label">Target Audience</label>
			</div>
		</div>

		<div class="form-group">
			<div class="input-group">
				<textarea
					id="emi-objectives"
					bind:value={formData.objectives}
					placeholder=" "
					class="input-field peer h-28"
					required
				></textarea>
				<label for="emi-objectives" class="input-label">Workshop Objectives</label>
			</div>
		</div>

		<div class="form-group">
			<div class="input-group">
				<textarea
					id="emi-workshopContext"
					bind:value={formData.workshopContext}
					placeholder=""
					class="input-field peer h-28"
				></textarea>
				<label for="emi-workshopContext" class="input-label">
					Workshop Context <span class="text-gray-500">(Optional)</span>
				</label>
			</div>
			<p class="mt-3 text-sm text-gray-600">
				Provide details about your audience - English level, cultural context, specific needs for
				interactive elements, etc.
			</p>
		</div>

		<div>
			<button type="submit" class="submit-button" disabled={isLoading}>
				{#if isLoading}
					Creating Workshop Plan
				{:else}
					Generate Workshop Plan
				{/if}
			</button>
		</div>
	</form>
</div>

<!-- EMI Error Display -->
{#if error}
	<div class="mt-6 rounded-md border-l-4 border-red-500 bg-red-50 p-4 dark:bg-red-900/20">
		<p class="text-red-700 dark:text-red-400">{error}. Please try again later.</p>
	</div>
{/if}

<!-- EMI Results Display Section -->
{#if isLoading || finalWorkshopPlanOutput}
	<div class>
		<ProgressBar {phases} />
		<!-- Final Workshop Plan -->
		{#if finalWorkshopPlanOutput}
			<div
				class="rounded-lg border border-gray-200 bg-white p-8 shadow-sm transition-colors duration-500 dark:border-slate-700 dark:bg-slate-800"
			>
				<div class="markdown-body dark:bg-gray-800">
					{@html marked.parse(finalWorkshopPlanOutput)}
				</div>
				<div class="mt-4">
					<button class="submit-button" on:click={copyToClipboard}
						>Copy Workshop Plan to Clipboard</button
					>
				</div>
			</div>
		{/if}
	</div>
{/if}
