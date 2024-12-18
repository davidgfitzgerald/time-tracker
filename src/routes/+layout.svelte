<script>
	import NavBar from '$lib/components/NavBar.svelte';
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

<div>
	<NavBar />
	<div class="background">
		<div class="content">
			<slot></slot>
		</div>
	</div>
</div>

<style>
	@import '../app.css';

	.background {
		padding: 1rem;
		background-color: grey;
	}

	.content {
		padding: 1rem;
		background-color: rgb(255, 255, 255);
		box-shadow: 10px 10px 10px rgb(92, 92, 92);
		transform: translate3d(0,0,0); /* Hack to fix poor box-shadow rendering on iOS*/
	}
</style>
