<!-- src/lib/components/Tabs.svelte -->
<script>
    export let tabs = []; // Array of tab objects: { name: 'Tab Name', id: 'tab-id' }
    export let activeTabId; // Bindable prop to track the active tab

    function selectTab(tabId) {
        activeTabId = tabId;
    }
</script>

<div class="tabs">
    {#each tabs as tab}
        <button
            class:active={activeTabId === tab.id}
            on:click={() => selectTab(tab.id)}
        >
            {tab.name}
        </button>
    {/each}
</div>

<style>
    .tabs {
        display: flex;
        border-bottom: 1px solid #ccc;
    }

    button {
        padding: 0.5rem 1rem;
        border: none;
        background-color: transparent;
        cursor: pointer;
        border-bottom: 2px solid transparent; /* Initially transparent */
        margin-bottom: -2px; /* To overlap bottom border of .tabs */
    }

    button.active {
        border-bottom-color: blue; /* Example active tab indicator */
        font-weight: bold;
    }

    button:hover:not(.active) {
        background-color: #f0f0f0; /* Light hover effect */
    }
</style>