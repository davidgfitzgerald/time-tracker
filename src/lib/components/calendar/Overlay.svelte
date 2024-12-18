<script>
	/**
	 * @type {{
	 * 	positions: import("./overlay").Position[]
	 * 	task: import("$lib/stores").Task
	 * }}
	 */
	let { task, positions } = $props();

	/**
	 * Choose a colour for this overlay.
	 *
	 * TODO - Improve colour choice logic.
	 * @param {import('$lib/stores').Task} task
	 */
	function chooseColour(task) {
		const category = task.category?.toLowerCase();
		if (category?.includes('sleep')) {
			return 'rgba(50, 166, 0, 0.808)'; // Green with opacity *
		} else if (category?.includes('work')) {
			return 'rgba(0, 50, 150, 0.808)'; // Blue with opacity *
		} else {
			return 'rgba(255, 166, 0, 0.808)'; // Yellow/orange with opacity *
		}
	}
	const colour = chooseColour(task);
</script>

<div class="overlay-group">
	{#each positions as { top, left, height, width }}
			<div
			class="interval"
			style:--top={top}
			style:--height={height}
			style:--width={width}
			style:--left={left}
			style:--colour={colour}
		>
			<span>{task.category}</span>
		</div>
	{/each}
</div>

<style>
	.interval {
		position: absolute;
		background-color: var(--colour);
		border: none;
		border-radius: 10px;
		top: calc(var(--top) * 1px);
		height: calc(var(--height) * 1px);
		left: calc(var(--left) * 1px);
		width: calc(var(--width) * 1px);
	}

	.overlay-group:hover .interval {
		z-index: 1;
		filter: drop-shadow(5px 5px 10px rgba(0, 0, 0, 0.5));
		transform: rotateZ(3deg);
		transition: all 0.3s ease;
		cursor: pointer;
	}

	.interval:hover span {
		display: block;
		position: fixed;
		top: -20px;
	}

	span {
		position: absolute;
		justify-content: center;
		align-items: center;
		display: none;
		position: relative;
		background: black;
		color: white;
		padding: 5px;
		border-radius: 3px;
		white-space: nowrap;
		transform: translate(-50%, -50%);
		top: 50%; /* Center it vertically */
		left: 50%; /* Center it horizontally */
		padding: 2px 6px; /* Optional: add some padding */
		pointer-events: none; /* Prevents the span from interfering with clicks */
	}
</style>
