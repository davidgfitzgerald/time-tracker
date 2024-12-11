<script>
	import Times from '$lib/components/Times.svelte';
	import Controls from '$lib/components/Controls.svelte';
	import Clock from '$lib/components/Clock.svelte';

	import { times } from '$lib/stores.js';
	import { updateDuration } from '$lib/utils/clock.js';

	// The load function in +page.server.js automatically
	// returns data.
	export let data;
	console.debug("Initial backend data loaded.")
	times.set(data);
	
	console.debug("Updating duration manually in +page.svelte.")
	updateDuration($times.tasks);

	let error = $times.error;
</script>

<Clock />
<Controls />

{#if error}
	<p>{error}</p>
{:else if $times.tasks.length === 0}
	<p>No tasks found.</p>
{:else}
	<Times />
{/if}
