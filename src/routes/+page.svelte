<!-- // src/routes/+page.svelte -->
<script>
	import { enhance } from '$app/forms';

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
</script>

<div class="min-h-screen bg-gray-50">
	<main class="container mx-auto max-w-3xl px-4 py-12">
		<!-- Header -->
		<div class="mb-12 text-center">
			<h1 class="mb-4 text-4xl font-bold text-gray-900">ETA Lesson Planner</h1>
			<p class="text-lg text-gray-600">
				Share your lesson details, and we'll help craft a personalized teaching plan
			</p>
		</div>

		<!-- Main Form -->
		<form
			on:submit|preventDefault={handleSubmit}
			class="space-y-10 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm"
		>
			<!-- Topic Section -->
			<div class="space-y-3">
				<label for="topic" class="block text-xl font-semibold text-gray-900">
					What's your lesson topic?
				</label>
				<input
					type="text"
					id="topic"
					bind:value={formData.topic}
					placeholder="e.g., Food and Nutrition, Family Members, Past Tense Verbs"
					class="w-full rounded-xl border border-gray-200 p-4 text-lg transition
                 duration-200 placeholder:text-gray-400 focus:border-transparent focus:ring-2
                 focus:ring-blue-500 focus:outline-none"
					required
				/>
			</div>

			<!-- Class Details Grid -->
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
				<div class="space-y-3">
					<label for="grade" class="block text-lg font-medium text-gray-900">
						Grade Level
					</label>
					<select
						id="grade"
						bind:value={formData.grade}
						class="w-full rounded-xl border border-gray-200 p-4 text-lg
                   transition duration-200 focus:border-transparent focus:ring-2
                   focus:ring-blue-500 focus:outline-none"
						required
					>
						{#each Array(12) as _, i}
							<option value={i + 1}>Grade {i + 1}</option>
						{/each}
					</select>
				</div>

				<div class="space-y-3">
					<label for="classDuration" class="block text-lg font-medium text-gray-900">
						Class Duration
					</label>
					<input
						type="text"
						id="classDuration"
						bind:value={formData.classDuration}
						placeholder="e.g., 40 minutes"
						class="w-full rounded-xl border border-gray-200 p-4 text-lg transition
                   duration-200 placeholder:text-gray-400 focus:border-transparent focus:ring-2
                   focus:ring-blue-500 focus:outline-none"
						required
					/>
				</div>
			</div>

			<!-- Co-teaching Model -->
			<div class="space-y-3">
				<label for="coTeachingModel" class="block text-lg font-medium text-gray-900">
					Co-teaching Model
				</label>
				<select
					id="coTeachingModel"
					bind:value={formData.coTeachingModel}
					class="w-full rounded-xl border border-gray-200 p-4 text-lg
                 transition duration-200 focus:border-transparent focus:ring-2
                 focus:ring-blue-500 focus:outline-none"
					required
				>
					{#each coTeachingOptions as option}
						<option value={option}>{option}</option>
					{/each}
				</select>
			</div>

			<!-- Learning Objectives -->
			<div class="space-y-3">
				<label for="objectives" class="block text-xl font-semibold text-gray-900">
					What do you want your students to learn?
				</label>
				<p class="text-gray-500">Write your objectives as "Students Will Be Able To (SWBAT)..."</p>
				<textarea
					id="objectives"
					bind:value={formData.objectives}
					placeholder="students will be able to..."
					class="h-36 w-full rounded-xl border border-gray-200 p-4 text-lg transition
                 duration-200 placeholder:text-gray-400 focus:border-transparent focus:ring-2
                 focus:ring-blue-500 focus:outline-none"
					required
				></textarea>
			</div>

			<!-- Class Description -->
			<div class="space-y-3">
				<label for="classDescription" class="block text-xl font-semibold text-gray-900">
					Tell us about your class <span class="text-gray-400">(Optional)</span>
				</label>
				<p class="text-gray-500">
					Share any details that might help us create a better lesson plan - class size, student
					levels, special considerations, etc.
				</p>
				<textarea
					id="classDescription"
					bind:value={formData.classDescription}
					placeholder="e.g., I have 20 students with mixed English levels in a society class. Most are elementary level, but  students are advanced..."
					class="h-36 w-full rounded-xl border border-gray-200 p-4 text-lg transition
                 duration-200 placeholder:text-gray-400 focus:border-transparent focus:ring-2
                 focus:ring-blue-500 focus:outline-none"
				></textarea>
			</div>

			<!-- Submit Button -->
			<div class="pt-6">
				<button
					type="submit"
					class="w-full rounded-xl bg-blue-600 px-6 py-4 text-lg font-medium text-white
                 transition duration-200 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500
                 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
					disabled={isLoading}
				>
					{isLoading ? 'Creating your lesson plan...' : 'Generate Lesson Plan'}
				</button>
			</div>
		</form>

		<!-- Error Display -->
		{#if error}
			<div class="mt-8 rounded-lg border-l-4 border-red-500 bg-red-50 p-4">
				<p class="text-red-700">{error}</p>
			</div>
		{/if}

		<!-- Results Display -->
		{#if lessonPlan}
			<div class="mt-8 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
				<h2 class="mb-6 text-2xl font-bold text-gray-900">{lessonPlan.topic}</h2>
				<!-- Add lesson plan content display here -->
			</div>
		{/if}
	</main>
</div>
