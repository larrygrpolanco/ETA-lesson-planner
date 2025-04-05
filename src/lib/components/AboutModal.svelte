<!-- src/lib/components/AboutModal.svelte -->
<script>
	import { createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition'; // For a smooth fade effect

	export let open = false;

	const dispatch = createEventDispatcher();

	function close() {
		dispatch('close');
	}

	// Close modal on Escape key press
	function handleKeydown(event) {
		if (event.key === 'Escape') {
			close();
		}
	}

	// Close modal when clicking outside the content area
	function handleBackdropClick(event) {
		if (event.target === event.currentTarget) {
			// Ensure the click was directly on the backdrop, not the modal content
			close();
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

{#if open}
	<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/70 p-4"
		transition:fade={{ duration: 150 }}
		on:click={handleBackdropClick}
		role="dialog"
		aria-modal="true"
		aria-labelledby="about-modal-title"
	>
		<div
			class="relative w-full max-w-2xl rounded-lg bg-white dark:bg-slate-800 shadow-xl p-6 max-h-[80vh] overflow-y-auto"
		>
			<!-- Close Button -->
			<button
				on:click={close}
				class="absolute top-3 right-3 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-800 rounded-full p-1 transition-colors"
				aria-label="Close modal"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="2"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>

			<!-- Modal Content -->
			<h2
				id="about-modal-title"
				class="text-2xl font-semibold mb-4 text-gray-900 dark:text-slate-200"
			>
				About Fulbright Planner
			</h2>

			<div class="prose prose-sm sm:prose dark:prose-invert max-w-none space-y-3 text-gray-700 dark:text-slate-300">
				<h3 class="text-lg font-medium text-gray-800 dark:text-slate-200">The Challenge:</h3>
				<p>
					Fulbright Taiwan grantees work in diverse settings across Taiwan. Standard training
					struggles to address the unique needs of each placement, from city schools to rural
					communities.
				</p>

				<h3 class="text-lg font-medium text-gray-800 dark:text-slate-200">The Solution:</h3>
				<p>
					Fulbright Planner is an LLM-powered web app designed to help Fulbright ETAs, EMI Advisors,
					and Teaching Fellows create personalized educational resources quickly. It generates
					detailed lesson plans and workshop outlines tailored to:
				</p>
				<ul class="list-disc list-inside space-y-1">
					<li>Fulbright goals and Taiwan MOE standards</li>
					<li>Specific grade levels, class times, and teaching contexts</li>
					<li>Appropriate co-teaching models for Taiwan's bilingual initiative</li>
				</ul>

				<h3 class="text-lg font-medium text-gray-800 dark:text-slate-200">Key Features:</h3>
				<ul class="list-disc list-inside space-y-1">
					<li>
						<strong>Dual Modes:</strong> Separate planning for Lessons (ETAs) and Workshops
						(EMI/Fellows).
					</li>
					<li>
						<strong>Multi-Phase Planning:</strong> LLM generates plans step-by-step (Objectives →
						Activities → Components → Final Plan), mimicking experienced teacher workflows.
					</li>
					<li>
						<strong>Taiwan-Specific:</strong> Incorporates local curriculum needs, co-teaching models,
						bilingual education elements, and cultural sensitivity.
					</li>
					<li>
						<strong>User-Developed:</strong> Built with feedback from ~60 Fulbright participants.
					</li>
				</ul>

                 <h3 class="text-lg font-medium text-gray-800 dark:text-slate-200">Technology:</h3>
                 <p>
                    Built with SvelteKit, TailwindCSS, Node.js, Vercel Serverless Functions, and Anthropic's Claude AI models.
                 </p>

				<h3 class="text-lg font-medium text-gray-800 dark:text-slate-200">Goal:</h3>
				<p>
					To save time, improve planning quality, reduce burnout, and help educators focus more on
					teaching and relationships. This tool enhances human capabilities, informed by real-world
					teaching experience.
				</p>
                <p class="text-xs italic text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
                    Project by Larry Grullon-Polanco. Special thanks to the Fulbright Taiwan community and the Foundation for Scholarly Exchange.
                </p>
			</div>
		</div>
	</div>
{/if}

<style>
	/* Add Tailwind Typography plugin styles if not already global */
	/* You might need to install `@tailwindcss/typography` and add it to your tailwind.config.js */
	/* @import '@tailwindcss/typography'; */

    /* Ensure scrollbar looks decent in dark mode if needed */
    /* Customize scrollbar for Webkit browsers */
    .overflow-y-auto::-webkit-scrollbar {
        width: 8px; /* Adjust width as needed */
    }
    .overflow-y-auto::-webkit-scrollbar-track {
        background: transparent; /* Or match modal bg */
    }
    .overflow-y-auto::-webkit-scrollbar-thumb {
        background-color: rgba(156, 163, 175, 0.5); /* gray-400 with opacity */
        border-radius: 10px;
        border: 2px solid transparent; /* Creates padding around thumb */
        background-clip: content-box;
    }
    .dark .overflow-y-auto::-webkit-scrollbar-thumb {
         background-color: rgba(107, 114, 128, 0.6); /* gray-500 with opacity */
    }
    .overflow-y-auto::-webkit-scrollbar-thumb:hover {
        background-color: rgba(107, 114, 128, 0.7); /* gray-500 */
    }
     .dark .overflow-y-auto::-webkit-scrollbar-thumb:hover {
         background-color: rgba(75, 85, 99, 0.8); /* gray-600 */
    }

    /* Basic scrollbar styles for Firefox */
    .overflow-y-auto {
      scrollbar-width: thin;
      scrollbar-color: rgba(156, 163, 175, 0.5) transparent; /* thumb track */
    }
    .dark .overflow-y-auto {
         scrollbar-color: rgba(107, 114, 128, 0.6) transparent;
    }

</style>