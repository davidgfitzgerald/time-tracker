<script>
    import { formatDuration } from "$lib/utils/time";
    import { duration } from "$lib/stores";
</script>

<div class="stopwatch">
	<h1>{formatDuration($duration)}</h1>
</div>

<style>
    .stopwatch {
		font-size: 2em;
		margin: 20px;
		text-align: center;
	}
</style>