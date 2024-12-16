<script>
	import { Interval } from "luxon";

    export let interval;

    const hoursInDay = 3
    const cellHeightPx = 100;
    const headerHeightPx = cellHeightPx;
    const bodyHeightPx = hoursInDay * cellHeightPx;
    const secondsInHour = 60 * 60
    const totalSecondsInDay = hoursInDay * secondsInHour
    /**
	 * @param {Interval} interval
	 */
    function calculateTop(interval) {
        const start = interval.start
        const secondsSinceStartOfDay = start.toSeconds() - start.startOf("day").toSeconds()
        const pixelOffset = secondsToPixels(secondsSinceStartOfDay)
        const top = pixelOffset + headerHeightPx
        return `${top}px`
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
        const seconds = interval.length("seconds")
        return `${secondsToPixels(seconds)}px`
    }

    const top = calculateTop(interval);
    const height = calculateHeight(interval)
</script>

<div
    class="cell highlight"
    style:--top={top}
    style:--height={height}
    >
</div>

<style>
    .cell {
        text-align: left;
        outline: 0.5px solid grey;
        height: 100px;
        width: 100px;
    }

    .highlight {
        position: absolute;
        background-color: rgba(255, 165, 0, 0.7); /* Orange with opacity */
        
        top: var(--top);
        height: var(--height);
    }
</style>