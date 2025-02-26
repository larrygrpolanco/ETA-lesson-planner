<script>
    import { marked } from 'marked';
    import ProgressBar from '$lib/components/ProgressBar.svelte';

    export let coTeachingOptions; // Receive these as props
    export let gradeOptions; // Receive these as props

    let formData = {
        topic: '',
        grade: 1,
        classDuration: '',
        coTeachingModel: 'One teach, one observe',
        objectives: '',
        classDescription: ''
    };

    let lessonPlan = null;
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
        }));

        for (let i = 0; i < phases.length; i++) {
            const phase = phases[i];
            phases = phases.map((p, index) => (index === i ? { ...p, isLoading: true } : p));
            phases = [...phases];

            try {
                const response = await fetch('/api/generate-eta-lesson', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', phase: phase.name },
                    body: JSON.stringify({
                        ...formData,
                        phases: phases.map(p => ({
                            key: p.key,
                            name: p.name,
                            content: p.content,
                            completed: p.completed
                        }))
                    })
                });

                if (!response.ok) throw new Error(`ETA Failed to generate ${phase.name}`);
                const data = await response.json();

                if (data.phase.name === 'Creating Final Plan') {
                    finalLessonPlanOutput = data.phase.content;
                    lessonPlan = finalLessonPlanOutput;
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
            navigator.clipboard
                .writeText(finalLessonPlanOutput)
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


<div class="eta-form">
	<form
		on:submit|preventDefault={handleSubmit}
		class="space-y-6  border border-gray-200 bg-white p-8 shadow-md"
	>
		<div class="form-group">
			<div class="input-group">
				<input
					type="text"
					id="eta-topic"
					bind:value={formData.topic}
					placeholder=""
					class="input-field peer"
					required
				/>
				<label for="eta-topic" class="input-label"> Lesson Topic</label>
			</div>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 md:gap-4">
			<div class="form-group">
				<div class="input-group">
					<input
						type="text"
						id="eta-classDuration"
						bind:value={formData.classDuration}
						placeholder=""
						class="input-field peer"
						required
					/>
					<label for="eta-classDuration" class="input-label"> Class Duration</label>
				</div>
			</div>
			<div class="form-group">
				<div class="input-group">
					<select id="eta-grade" bind:value={formData.grade} class="input-field peer" required>
						{#each gradeOptions as grade}
							<option value={grade}>Grade {grade}</option>
						{/each}
						<option>University</option>
					</select>
					<label for="eta-grade" class="input-label"> Grade Level</label>
				</div>
			</div>
		</div>

		<div class="form-group">
			<div class="input-group">
				<select
					id="eta-coTeachingModel"
					bind:value={formData.coTeachingModel}
					class="input-field peer"
					required
				>
					{#each coTeachingOptions as option}
						<option value={option}>{option}</option>
					{/each}
				</select>
				<label for="eta-coTeachingModel" class="input-label"> Co-teaching Model</label>
			</div>
		</div>

		<div class="form-group">
			<div class="input-group">
				<textarea
					id="eta-objectives"
					bind:value={formData.objectives}
					placeholder=" "
					class="input-field peer h-28"
					required
				></textarea>
				<label for="eta-objectives" class="input-label"> Learning Objectives</label>
			</div>
		</div>

		<div class="form-group">
			<div class="input-group">
				<textarea
					id="eta-classDescription"
					bind:value={formData.classDescription}
					placeholder=""
					class="input-field peer h-28"
				></textarea>
				<label for="eta-classDescription" class="input-label">
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
					Generate Lesson Plan
				{/if}
			</button>
		</div>
	</form>
</div>

<!-- ETA Error Display -->
{#if error}
	<div class="mt-6 rounded-md border-l-4 border-red-500 bg-red-50 p-4">
		<p class="text-red-700">{error}</p>
	</div>
{/if}

<!-- ETA Results Display Section -->
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
					<button class="submit-button" on:click={copyToClipboard}
						>Copy ETA Plan to Clipboard</button
					>
				</div>
			</div>
		{/if}
	</div>
{/if}
