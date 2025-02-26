<!-- src/lib/components/DarkModeToggle.svelte -->
<script>
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { spring } from 'svelte/motion';
  
  let darkMode = false;
  
  onMount(() => {
    // Check localStorage or system preference
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark' || (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      darkMode = true;
      document.documentElement.classList.add('dark');
    }
  });
  
  function toggleDarkMode() {
    darkMode = !darkMode;
    
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }
</script>

<button 
  on:click={toggleDarkMode}
  class="rounded-full p-2 bg-slate-200 dark:bg-slate-700 transition-all duration-500 hover:bg-slate-300 dark:hover:bg-slate-600"
  aria-label="Toggle dark mode"
>
  {#if darkMode}
    <div in:fade={{ duration: 300 }}>
      <!-- Sun icon with softer yellow -->
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-amber-200" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd" />
      </svg>
    </div>
  {:else}
    <div in:fade={{ duration: 300 }}>
      <!-- Moon icon with softer blue -->
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-600" viewBox="0 0 20 20" fill="currentColor">
        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
      </svg>
    </div>
  {/if}
</button>