<script>
	import { formatDuration } from '$lib/utils/time';
	import { duration } from '$lib/stores';
</script>

<div class="stopwatch">
	<p>
		{formatDuration($duration)}
	</p>
</div>

<style>
	.stopwatch {
		width: 100%;
		height: 75%;
		display: flex;
		justify-content: center; /* Centers content horizontally */
		align-items: center; /* Centers content vertically */
		border: 1px solid #000; /* Optional: for visualization */
		box-sizing: content-box;
		border-radius: 5px;
	}
</style>
