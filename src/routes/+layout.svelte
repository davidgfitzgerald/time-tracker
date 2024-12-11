<script>
	import NavBar from '$lib/components/NavBar.svelte';
	import { onMount, onDestroy } from 'svelte';
	import { times } from '$lib/stores';
	import { setupClock, updateDuration } from '$lib/utils/clock.js';

	/**
	 * @type {() => void}
	 */
	let teardownClock;

	// During the lifecycle of the application, update the clock
	onMount(() => {
		teardownClock = setupClock(times, () => {
			updateDuration($times.tasks);
		});
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
