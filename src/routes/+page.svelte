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
    let phases = []; // Array to store phases
    let finalLessonPlanOutput = null; // To store the final lesson plan separately

    async function handleSubmit() {
        isLoading = true;
        error = null;
        lessonPlan = null; // Reset previous lesson plan
        phases = []; // Clear previous phases
        finalLessonPlanOutput = null; // Clear previous final plan

        try {
            const response = await fetch('/api/generate-lesson', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Failed to generate lesson plan');
            const data = await response.json();
            phases = data.phases; // Get phases from the response
            finalLessonPlanOutput = data.finalLessonPlan; // Get final lesson plan
            lessonPlan = finalLessonPlanOutput; // Keep lessonPlan for the existing display logic (can be refactored later)

        } catch (err) {
            error = err.message;
        } finally {
            isLoading = false;
        }
    }

    function copyToClipboard() {
        if (finalLessonPlanOutput) {
            navigator.clipboard.writeText(JSON.stringify(finalLessonPlanOutput, null, 2)).then(() => {
                alert('Lesson plan copied to clipboard!'); // Simple feedback for now
            }).catch(err => {
                console.error("Failed to copy: ", err);
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
            <div class="form-group">
                <div class="input-group">
                    <input type="text" id="topic" bind:value={formData.topic} placeholder="" class="input-field peer" required />
                    <label for="topic" class="input-label"> Lesson Topic </label>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 md:gap-4">
                <div class="form-group">
                    <div class="input-group">
                        <input type="text" id="classDuration" bind:value={formData.classDuration} placeholder="" class="input-field peer" required />
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
                    <select id="coTeachingModel" bind:value={formData.coTeachingModel} class="input-field peer" required>
                        {#each coTeachingOptions as option}
                            <option value={option}>{option}</option>
                        {/each}
                    </select>
                    <label for="coTeachingModel" class="input-label"> Co-teaching Model </label>
                </div>
            </div>

            <div class="form-group">
                <div class="input-group">
                    <textarea id="objectives" bind:value={formData.objectives} placeholder=" " class="input-field peer h-28" required ></textarea>
                    <label for="objectives" class="input-label"> Learning Objectives </label>
                </div>
            </div>

            <div class="form-group">
                <div class="input-group">
                    <textarea id="classDescription" bind:value={formData.classDescription} placeholder="" class="input-field peer h-28" ></textarea>
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
        {#if phases.length > 0 || finalLessonPlanOutput}
            <div class>
                <!-- Preliminary Phases - Collapsible -->
                {#each phases as phase}
                    <details class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                        <summary class="font-semibold text-gray-900 marker:text-sky-500">{phase.name}</summary>
                        <div class="mt-2 text-gray-700">
                            <pre class="whitespace-pre-wrap">{phase.content}</pre>
                        </div>
                    </details>
                {/each}

                <!-- Final Lesson Plan - Not Collapsible -->
                {#if finalLessonPlanOutput}
                    <div class="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
                        <h2 class="mb-4 text-2xl font-bold text-gray-900">Final Lesson Plan: {finalLessonPlanOutput.topic}</h2>
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
