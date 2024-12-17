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
    /**
     * @type {import('$lib/stores').Task}
     */
    export let task;

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

    /**
     * @param {MouseEvent} event - The mouseover event
     */
    function hide(event) {}


    /**
     * @param {import('$lib/stores').Task} task
     */
    function chooseColour(task) {
        const category = task.category?.toLowerCase()
        if (category?.includes("sleep")) {
            return 'rgba(50, 166, 0, 0.808)'  // Orange with opacity *
        } else if (category?.includes("work")) {
            return 'rgba(0, 50, 150, 0.808)'  // Orange with opacity *
        } else {
            return 'rgba(255, 166, 0, 0.808)'  // Orange with opacity *
        }
    }
    const colour = chooseColour(task)
</script>


<div
    class="highlight"
    style:--top={top}
    style:--height={height}
    style:--colour={colour}
    >
    <div class="container">
        <span>{task.category}</span>
    </div>
</div>


<style>
    .highlight {
        z-index: 0;
        position: absolute;
        background-color: var(--colour);  
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
    
    .highlight:hover span {
        display: block;
        /* position: relative; */
        z-index: 10;
        position: fixed;
        top: -20px;
    }

    .container {
        position: relative;
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
        z-index: 5;
        transform: translate(-50%, -50%);
        top: 50%; /* Center it vertically */
        left: 50%; /* Center it horizontally */
        padding: 2px 6px; /* Optional: add some padding */
        pointer-events: none; /* Prevents the span from interfering with clicks */

    }

    .category {
        transform: translate(-50%, -50%); /* Fine-tune centering */
        background: rgba(0, 0, 0, 0.7); /* Optional: add a background for better contrast */
        color: #fff; /* Make text stand out */
        padding: 2px 6px; /* Optional: add some padding */
        border-radius: 4px; /* Optional: rounded corners */
        pointer-events: none; /* Prevents the span from interfering with clicks */
    }

</style>