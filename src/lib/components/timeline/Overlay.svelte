<script>
	import { Interval } from 'luxon';

	/**
	 * @type {{
	 *  interval: Interval,
	 *  cellHeight: number,
	 *  externalOffset: number,
	 *  task: import('$lib/stores').Task
	 * }}
	 */
	let { interval, cellHeight, externalOffset, task } = $props();

	const hoursInDay = 24;
	const bodyHeightPx = hoursInDay * cellHeight;
	const secondsInHour = 60 * 60;
	const totalSecondsInDay = hoursInDay * secondsInHour;
	const screenHeightPx = secondsToPx(totalSecondsInDay);
	/**
	 * @param {Interval} interval
	 */
	function calculateTop(interval) {
		const start = interval.start;
		const secondsSinceStartOfDay = start.toSeconds() - start.startOf('day').toSeconds();
		const pxOffset = secondsToPx(secondsSinceStartOfDay);
		const top = pxOffset + externalOffset;
		return top;
	}

	/**
	 * @param {number} seconds - Number of seconds
	 * @returns {number} - Number of pixels that equate to that number of seconds
	 */
	function secondsToPx(seconds) {
		const proportion = seconds / totalSecondsInDay;
		return proportion * bodyHeightPx;
	}

	/**
	 * @param {Interval} interval - The interval of time to display
	 * @param {number} top - Pixel distance between top of view and start of this overlay
	 */
	function calculateHeight(interval, top) {
		const requiredPx = secondsToPx(interval.length('seconds'));
		const remainingPx = screenHeightPx - top + externalOffset;

		/**
		 * Aim to use the required px but resort to
		 * displaying only for the remaining pixels left
		 * for that day.
		 *
		 * Otherwise overlay will spill over out of the
		 * day.
		 *
		 * TODO - Handle the case when time spills over
		 * into a new day.
		 */
		return Math.min(requiredPx, remainingPx);
	}

	// top - When to start drawing the overlay
	const top = calculateTop(interval);

	// height - How high the overlay will be
	const height = calculateHeight(interval, top);

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

<div class="highlight" style:--top={top} style:--height={height} style:--colour={colour}>
	<span>{task.category}</span>
</div>

<style>
	.highlight {
		position: absolute;
		background-color: var(--colour);
		border: none;
		border-radius: 10px;
		top: calc(var(--top) * 1px);
		height: calc(var(--height) * 1px);
		width: 100px;
	}

	.highlight:hover {
		z-index: 1;
		filter: drop-shadow(5px 5px 10px rgba(0, 0, 0, 0.5));
		transform: rotateZ(3deg);
		transition: all 0.3s ease;
		cursor: pointer;
	}

	.highlight:hover span {
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
