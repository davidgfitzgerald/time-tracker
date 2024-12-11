<script>
	import { formatDuration } from '$lib/utils/time';
	import { duration } from '$lib/stores';
</script>

<div class="stopwatch">
	<h1>{formatDuration($duration)}</h1>
</div>

<style>
	.stopwatch {
		font-size: 2em;
		text-align: center;
	}

	h1 {
		padding: 0px;
	}
</style>
