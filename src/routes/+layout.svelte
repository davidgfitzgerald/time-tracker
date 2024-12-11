<script>
	import NavBar from '$lib/components/NavBar.svelte';
	import { onDestroy } from 'svelte';
	import { times } from '$lib/stores';
	import { setupClock, updateDuration } from '$lib/utils/clock.js';

	/**
	 * @type {() => void}
	 */
	let teardownClock;

	/**
	 * Start task to periodicially update clock
	*/
	console.debug("+layout.svelte running to set up clock")
	teardownClock = setupClock(times, () => {
		updateDuration($times.tasks);
	});

	onDestroy(() => {
		if (teardownClock) {
			teardownClock();
		}
	});
</script>

<div>
	<NavBar />
	<div class="content">
		<slot></slot>
	</div>
</div>

<style>
	@import '../app.css';
</style>
