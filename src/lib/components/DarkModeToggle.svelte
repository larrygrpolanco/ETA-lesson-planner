<!-- src/lib/components/DarkModeToggle.svelte -->
<script>
	let darkMode = false; // Reactive variable to track dark mode state

	// Function to toggle dark mode and store preference in localStorage
	function toggleDarkMode() {
		darkMode = !darkMode;
		if (darkMode) {
			document.documentElement.classList.add('dark');
			localStorage.theme = 'dark';
		} else {
			document.documentElement.classList.remove('dark');
			localStorage.theme = 'light';
		}
	}

	// On component mount, check localStorage for theme preference
	import { onMount } from 'svelte';
	onMount(() => {
		if (
			localStorage.theme === 'dark' ||
			(!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
		) {
			darkMode = true;
			document.documentElement.classList.add('dark');
		} else {
			darkMode = false;
			document.documentElement.classList.remove('dark');
		}
	});
</script>

<button
	aria-label="Toggle Dark Mode"
	class="rounded-full bg-gray-200 p-2 transition-colors duration-200 hover:bg-gray-300 focus:ring-2 focus:ring-gray-400 focus:outline-none dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-500"
	on:click={toggleDarkMode}
>
	{#if darkMode}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			class="h-6 w-6 text-white"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-6.364-.386l1.591-1.591M3 12h2.25m.386-6.364l1.591 1.591M13.5 12c0 .56-.084 1.105-.25 1.611a.757.757 0 01-.712.613H9.5c-.75 0-1.5-.25-2.121-.75l-.75-.75a.75.75 0 011.06-1.06l.75.75c.621.621 1.364.932 2.121.932h3.5a.75.75 0 01.712.613c.166.506.25 1.051.25 1.611v2.25c0 .75.75 1.125 1.375.75l1.5-1.5a.75.75 0 011.06 1.06l-1.5 1.5c-.625.625-1.375.25-1.375-.75V15h-1.5a.75.75 0 01-.75-.75v-4.5a.75.75 0 01.75-.75H15v-1.5c0-.75.75-1.125 1.375-.75l1.5 1.5a.75.75 0 011.06 1.06l-1.5-1.5c-.625-.625-1.375-.25-1.375.75V9h-1.5a.75.75 0 01-.75-.75v-4.5a.75.75 0 01.75-.75H15V3c0-.75.75-1.125 1.375-.75l1.5 1.5a.75.75 0 011.06 1.06l-1.5-1.5c-.625-.625-1.375-.25-1.375.75V4.5h-1.5a.75.75 0 01-.75-.75V0z"
			/>
		</svg>
	{:else}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			class="h-6 w-6 text-gray-700 dark:text-white"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
			/>
		</svg>
	{/if}
</button>
