<script>
	import Times from '$lib/components/Times.svelte';
	import Controls from '$lib/components/Controls.svelte';
	import Clock from '$lib/components/Clock.svelte';

	import { times } from '$lib/stores.js';
	import { updateDuration } from '$lib/utils/clock.js';
	
	console.debug("Updating duration manually in +page.svelte.")
	updateDuration($times.tasks);

	let error = $times.error;
</script>

<Clock />
<Controls />

{#if error}
	<p>{error}</p>
{:else if $times.tasks?.length > 0}
	<Times />
{:else}
	<p>No tasks found.</p>
{/if}
