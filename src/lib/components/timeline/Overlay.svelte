<script>
	import { Interval } from "luxon";

    /**
	 * @param {Interval} interval
	 */
    export let interval;
    /**
	 * @type {number}
	 */
    export let cellHeight;
    /**
	 * @type {number}
	 */
    export let externalOffset;

    const hoursInDay = 24
    const bodyHeightPx = hoursInDay * cellHeight;
    const secondsInHour = 60 * 60
    const totalSecondsInDay = hoursInDay * secondsInHour
    /**
	 * @param {Interval} interval
	 */
    function calculateTop(interval) {
        const start = interval.start
        const secondsSinceStartOfDay = start.toSeconds() - start.startOf("day").toSeconds()
        const pixelOffset = secondsToPixels(secondsSinceStartOfDay)
        const top = pixelOffset + externalOffset
        return top
    }

    /**
	 * @param {number} seconds
	 */
    function secondsToPixels(seconds) {
        const proportion = seconds / totalSecondsInDay
        return proportion * bodyHeightPx
    }

    /**
	 * @param {Interval} interval
	 */
    function calculateHeight(interval) {
        return secondsToPixels(interval.length("seconds"))
    }

    const top = calculateTop(interval);
    const height = calculateHeight(interval)
</script>

<div
    class="highlight"
    style:--top={top}
    style:--height={height}
    >
</div>

<style>
    .highlight {
        position: absolute;
        background-color: rgba(255, 166, 0, 0.808);  /* Orange with opacity */
        border: none;
        border-radius: 10px;
        top: calc(var(--top) * 1px);
        height: calc(var(--height) * 1px);
        width: 100px;
    }

    .highlight:hover {
        filter: drop-shadow(5px 5px 10px rgba(0, 0, 0, 0.5));
        transform: rotateZ(1deg);
        transition: all 0.3s ease;
        cursor: pointer;
    }
</style>