<script>
	import { formatDuration } from '$lib/utils/time';
	import { duration } from '$lib/stores';
</script>

<div class="stopwatch">
	<h4>{formatDuration($duration)}</h4>
</div>

<style>
	.stopwatch {
		font-size: 2em;
		text-align: center;
	}

	h4 {
		padding: 1rem;
	}
</style>
