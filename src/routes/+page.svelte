<!-- // src/routes/+page.svelte -->
<script>
	import { enhance } from '$app/forms';
	import { marked } from 'marked'; // For markdown rendering

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
		'Station teaching',
		'Parallel teaching',
		'Alternative teaching'
	];

	let lessonPlan = null;
	let isLoading = false;
	let error = null;
	let currentStep = 1; // For multi-step form
	let isDarkMode = false; // Dark mode toggle

	// Toggle dark mode
	function toggleDarkMode() {
		isDarkMode = !isDarkMode;
		document.documentElement.classList.toggle('dark', isDarkMode);
	}

	// Handle form submission
	async function handleSubmit() {
		isLoading = true;
		error = null;

		try {
			const response = await fetch('/api/generate-lesson', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData)
			});

			if (!response.ok) throw new Error('Failed to generate lesson plan');
			lessonPlan = await response.json();
		} catch (err) {
			error = err.message;
		} finally {
			isLoading = false;
		}
	}

	// Copy lesson plan to clipboard
	function copyLessonPlan() {
		navigator.clipboard.writeText(lessonPlan).then(() => {
			alert('Lesson plan copied to clipboard!');
		});
	}
</script>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
	<main class="container mx-auto max-w-3xl px-4 py-12">
		<!-- Dark Mode Toggle -->
		<button
			on:click={toggleDarkMode}
			class="fixed top-4 right-4 rounded-full bg-gray-200 p-2 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
		>
			{#if isDarkMode}
				<span class="text-gray-900 dark:text-gray-100">🌞</span>
			{:else}
				<span class="text-gray-900 dark:text-gray-100">🌙</span>
			{/if}
		</button>

		<!-- Header -->
		<div class="mb-12 text-center">
			<h1 class="mb-4 text-4xl font-bold text-gray-900 dark:text-gray-100">ETA Lesson Planner</h1>
			<p class="text-lg text-gray-600 dark:text-gray-300">
				Share your lesson details, and we'll help craft a personalized teaching plan
			</p>
		</div>

		<!-- Multi-Step Form -->
		{#if !lessonPlan}
			<form
				on:submit|preventDefault={handleSubmit}
				class="space-y-10 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800"
			>
				<!-- Step 1: Topic and Grade -->
				{#if currentStep === 1}
					<div class="space-y-6">
						<h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
							Step 1: Lesson Details
						</h2>
						<div class="space-y-3">
							<div class="relative">
								<input
									type="text"
									id="topic"
									bind:value={formData.topic}
									class="peer w-full rounded-xl border border-gray-200 p-4 text-lg placeholder-transparent
											transition duration-200 focus:border-transparent focus:ring-2
											focus:ring-blue-500 focus:outline-none dark:border-gray-700"
									placeholder="e.g., Food and Nutrition"
									required
								/>
								<label
									for="topic"
									class="absolute -top-2.5 left-4 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base
											peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm
											peer-focus:text-blue-600 dark:bg-gray-800 dark:text-gray-300"
								>
									What's your lesson topic?
								</label>
							</div>
						</div>

						<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
							<div class="space-y-3">
								<label
									for="grade"
									class="block text-lg font-medium text-gray-900 dark:text-gray-100"
								>
									Grade Level
								</label>
								<select
									id="grade"
									bind:value={formData.grade}
									class="w-full rounded-xl border border-gray-200 p-4 text-lg transition
											duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500
											focus:outline-none dark:border-gray-700"
									required
								>
									{#each Array(12) as _, i}
										<option value={i + 1}>Grade {i + 1}</option>
									{/each}
								</select>
							</div>

							<div class="space-y-3">
								<div class="relative">
									<input
										type="text"
										id="classDuration"
										bind:value={formData.classDuration}
										class="peer w-full rounded-xl border border-gray-200 p-4 text-lg placeholder-transparent
												transition duration-200 focus:border-transparent focus:ring-2
												focus:ring-blue-500 focus:outline-none dark:border-gray-700"
										placeholder="e.g., 40 minutes"
										required
									/>
									<label
										for="classDuration"
										class="absolute -top-2.5 left-4 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base
												peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm
												peer-focus:text-blue-600 dark:bg-gray-800 dark:text-gray-300"
									>
										Class Duration
									</label>
								</div>
							</div>
						</div>

						<button
							type="button"
							on:click={() => (currentStep = 2)}
							class="w-full rounded-xl bg-blue-600 px-6 py-4 text-lg font-medium text-white
									transition duration-200 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500
									focus:ring-offset-2 focus:outline-none"
						>
							Next
						</button>
					</div>
				{/if}

				<!-- Step 2: Objectives and Description -->
				{#if currentStep === 2}
					<div class="space-y-6">
						<h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
							Step 2: Objectives and Class Details
						</h2>
						<div class="space-y-3">
							<div class="relative">
								<textarea
									id="objectives"
									bind:value={formData.objectives}
									class="peer w-full rounded-xl border border-gray-200 p-4 text-lg placeholder-transparent
											transition duration-200 focus:border-transparent focus:ring-2
											focus:ring-blue-500 focus:outline-none dark:border-gray-700"
									placeholder="students will be able to..."
									required
								></textarea>
								<label
									for="objectives"
									class="absolute -top-2.5 left-4 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base
											peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm
											peer-focus:text-blue-600 dark:bg-gray-800 dark:text-gray-300"
								>
									What do you want your students to learn?
								</label>
							</div>
						</div>

						<div class="space-y-3">
							<div class="relative">
								<textarea
									id="classDescription"
									bind:value={formData.classDescription}
									class="peer w-full rounded-xl border border-gray-200 p-4 text-lg placeholder-transparent
											transition duration-200 focus:border-transparent focus:ring-2
											focus:ring-blue-500 focus:outline-none dark:border-gray-700"
									placeholder="e.g., I have 20 students with mixed English levels..."
								></textarea>
								<label
									for="classDescription"
									class="absolute -top-2.5 left-4 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base
											peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm
											peer-focus:text-blue-600 dark:bg-gray-800 dark:text-gray-300"
								>
									Tell us about your class <span class="text-gray-400">(Optional)</span>
								</label>
							</div>
						</div>

						<div class="flex gap-4">
							<button
								type="button"
								on:click={() => (currentStep = 1)}
								class="w-1/2 rounded-xl bg-gray-200 px-6 py-4 text-lg font-medium text-gray-900 transition duration-200
										hover:bg-gray-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none dark:bg-gray-700
										dark:text-gray-100 dark:hover:bg-gray-600"
							>
								Back
							</button>
							<button
								type="submit"
								class="w-1/2 rounded-xl bg-blue-600 px-6 py-4 text-lg font-medium text-white
										transition duration-200 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500
										focus:ring-offset-2 focus:outline-none"
							>
								Generate Lesson Plan
							</button>
						</div>
					</div>
				{/if}
			</form>
		{/if}

		<!-- Error Display -->
		{#if error}
			<div class="mt-8 rounded-lg border-l-4 border-red-500 bg-red-50 p-4 dark:bg-red-900">
				<p class="text-red-700 dark:text-red-200">{error}</p>
			</div>
		{/if}

		<!-- Results Display -->
		{#if lessonPlan}
			<div
				class="mt-8 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800"
			>
				<div class="mb-6 flex items-center justify-between">
					<h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Your Lesson Plan</h2>
					<button
						on:click={copyLessonPlan}
						class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white
								transition duration-200 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500
								focus:ring-offset-2 focus:outline-none"
					>
						Copy to Clipboard
					</button>
				</div>
				<div class="prose dark:prose-invert">
					{@html marked(lessonPlan)}
				</div>
			</div>
		{/if}
	</main>
</div>
