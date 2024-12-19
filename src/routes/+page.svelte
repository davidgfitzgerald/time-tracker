<script>
	import Controls from '$lib/components/Controls.svelte';
	import Timeline from '$lib/components/calendar/Timeline.svelte';
</script>

<div class="body">
	<div class="left-column">
		<Timeline />
	</div>
	<div class="right-column">
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
		border-right: 1px solid grey;
	}
</style>
