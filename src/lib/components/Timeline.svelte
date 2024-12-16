<script>
	import { DateTime, Interval, Duration } from "luxon";

    const now = DateTime.now()

    const dates = [
        now,
        now.plus({days: 1}),
        now.plus({days: 2}),
        now.plus({days: 3}),
    ]

    const start = DateTime.fromISO('2024-12-15T00:25:00.000')
    const end = DateTime.fromISO('2024-12-15T01:55:00.000')

    const interval = Interval.fromDateTimes(start, end)

    const headerPixelHeight = 100;
    const totalPixelHeight = 300;
    const totalSecondsInDay = 3 * 60 * 60
    /**
	 * @param {DateTime} start
	 */
    function calculateTop(start) {
        const secondsSinceStartOfDay = start.toSeconds() - start.startOf("day").toSeconds()
        const pixelOffset = secondsToPixels(secondsSinceStartOfDay)
        const top = pixelOffset + headerPixelHeight
        return `${top}px`
    }

    /**
	 * @param {number} seconds
	 */
    function secondsToPixels(seconds) {
        const proportion = seconds / totalSecondsInDay
        return proportion * totalPixelHeight
    }

    /**
	 * @param {Interval} interval
	 */
    function calculateHeight(interval) {
        const seconds = interval.length("seconds")
        return `${secondsToPixels(seconds)}px`
    }

    const top = calculateTop(start);
    const height = calculateHeight(interval)
</script>

<div class="calendar">
    <div class="column">
        <div class="cell"></div>
        <div class="cell">00:00</div>
        <div class="cell">01:00</div>
        <div class="cell">02:00</div>
    </div>
    <div class="column">
        <div class="cell">{DateTime.now().toFormat('ccc dd')}</div>
        <div class="cell"></div>
        <div class="cell"></div>
        <div class="cell"></div>

        <div
            class="cell highlight"
            style:--top={top}
            style:--height={height}
            >
        </div>
    </div>
    <div class="column">
        <div class="cell">{DateTime.now().plus({days: 1}).toFormat('ccc dd')}</div>
        <div class="cell"></div>
        <div class="cell"></div>
        <div class="cell"></div>
    </div>
</div>

<style>
    .calendar {
        display: flex;
        flex-direction: row;
    }
    .column {
        position: relative;
    }
    .cell {
        /* padding: 1rem; */
        text-align: left;
        outline: 0.5px solid grey;
        height: 100px;
        width: 100px;
        /* overflow:scroll; */
    }

    .highlight {
        position: absolute;
        background-color: rgba(255, 165, 0, 0.7); /* Orange with opacity */
        
        top: var(--top);
        height: var(--height);
        /* top: 100px; */
        /* bottom: 100;
        height: 100%;
        width: 100%; */

        /* padding: 1rem; */
        /* height: 50px;
        width: 50px; */
    }
</style>