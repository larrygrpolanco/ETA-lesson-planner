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

	const gradeOptions = Array.from({ length: 12 }, (_, i) => i + 1);

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
			<!-- Topic Section -->
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
					<!-- Shortened label -->
				</div>
			</div>

			<!-- Class Details Grid -->
			<div class="grid grid-cols-1 md:grid-cols-2 md:gap-4">
				<!-- Class Duration -->
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
				<!-- Grade Level -->
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

			<!-- Co-teaching Model -->
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

			<!-- Learning Objectives -->
			<div class="form-group">
				<div class="input-group">
					<textarea
						id="objectives"
						bind:value={formData.objectives}
						placeholder=" "
						class="input-field peer h-28"
						required
					></textarea><!--Reduced textarea height h-28 -->
					<label for="objectives" class="input-label"> Learning Objectives </label>
					<!-- Shortened label -->
				</div>
			</div>

			<!-- Class Description -->
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
						<!-- Shortened label -->
					</label>
				</div>
				<p class="mt-3 text-sm text-gray-600">
					Provide details about your class - size, levels, special needs, etc.
				</p>
			</div>

			<!-- Submit Button -->
			<div class="form-group">
				<button type="submit" class="submit-button" disabled={isLoading}>
					{isLoading ? 'Creating Lesson...' : 'Generate Plan'}
					<!-- Shortened button text -->
				</button>
			</div>
		</form>

		<!-- Error Display -->
		{#if error}
			<div class="mt-6 rounded-md border-l-4 border-red-500 bg-red-50 p-4">
				<p class="text-red-700">{error}</p>
			</div>
		{/if}

		<!-- Results Display -->
		{#if lessonPlan}
			<div class="mt-8 rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
				<h2 class="mb-4 text-2xl font-bold text-gray-900">{lessonPlan.topic}</h2>
				<!-- Reduced mb-4, text-2xl -->
				<!-- Add lesson plan content display here -->
				<pre>{JSON.stringify(lessonPlan, null, 2)}</pre>
				<!-- For testing, display JSON -->
			</div>
		{/if}
	</main>
</div>
