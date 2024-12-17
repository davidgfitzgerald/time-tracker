<script>
	import Controls from '$lib/components/Controls.svelte';
	import Clock from '$lib/components/Clock.svelte';
	import Timeline from '$lib/components/timeline/Timeline.svelte';
</script>

<div class="body">
	<div class="left-column">
		<Timeline />
	</div>
	<div class="right-column">
		<Clock />
		<Controls />
	</div>
</div>

<style>
	.body {
		height: 80vh;
		display: flex;
		overflow: hidden;
	}

	.left-column {
		width: 85%;
		height: 100%;
		overflow-y: auto; /* Enable vertical scrolling */
		overflow-x: hidden; /* Disable horizontal scrolling */
	}

	.right-column {
		width: 15%;
		height: 100%;
		overflow: hidden; /* Prevent scrolling */
	}
</style>
