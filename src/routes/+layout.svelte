<script>
	import NavBar from '$lib/components/nav/NavBar.svelte';
	import { onDestroy } from 'svelte';
	import { times } from '$lib/stores';
	import { setupClock, updateDuration } from '$lib/utils/clock.js';

	// The load function in +layout.server.js automatically
	// returns data.
	/**
	 * @type {import('$lib/stores').TimesStore} data
	 */
	export let data;
	console.debug('Initial backend data loaded.');
	times.set(data);

	/**
	 * Long running task to periodicially update clock.
	 */
	console.debug('+layout.svelte setting up clock');
	const teardownClock = setupClock(times, () => updateDuration($times.tasks));

	onDestroy(() => teardownClock());
</script>

<div class="root">
	<NavBar />
	<div class="content">
		<slot></slot>
	</div>
</div>

<style>
	@import '../app.css';

	.content {
		overflow-x: auto;
		background-color: white;
		padding: 1rem;
		background-color: rgb(255, 255, 255);
	}
</style>
