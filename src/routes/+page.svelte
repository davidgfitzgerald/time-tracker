<script>
	import Controls from '$lib/components/Controls.svelte';
	import Clock from '$lib/components/Clock.svelte';
	import Timeline from '$lib/components/calendar/Timeline.svelte';
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
		display: grid;
		overflow: auto;
		grid-template-columns: 4fr 1fr;
	}

	.left-column {
		overflow: auto;
	}
</style>
