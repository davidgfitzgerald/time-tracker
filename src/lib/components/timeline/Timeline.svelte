<script>
	import { DateTime, Interval } from "luxon";
	import Overlay from "./Overlay.svelte";

    const start = DateTime.fromISO('2024-12-15T00:25:00.000')
    const end = DateTime.fromISO('2024-12-15T01:55:00.000')

    const interval = Interval.fromDateTimes(start, end)

    const hoursInDay = 3
    const cellHeight = 100;
    const cellWidth = 100;
    const headerPixelHeight = cellHeight;
    const tableBodyHeight = hoursInDay * cellHeight;
    const totalSecondsInDay = hoursInDay * 60 * 60
</script>

<div class="calendar">
    <div class="column">
        <div class="cell" style:--cell-height={`${cellHeight}px`}></div>
        <div class="cell" style:--cell-height={`${cellHeight}px`}>00:00</div>
        <div class="cell" style:--cell-height={`${cellHeight}px`}>01:00</div>
        <div class="cell" style:--cell-height={`${cellHeight}px`}>02:00</div>
    </div>
    <div class="column">
        <div class="cell" style:--cell-height={`${cellHeight}px`}>{DateTime.now().toFormat('ccc dd')}</div>
        <div class="cell" style:--cell-height={`${cellHeight}px`}></div>
        <div class="cell" style:--cell-height={`${cellHeight}px`}></div>
        <div class="cell" style:--cell-height={`${cellHeight}px`}></div>
        <Overlay {interval}></Overlay>
    </div>
    <div class="column">
        <div class="cell" style:--cell-height={`${cellHeight}px`}>{DateTime.now().plus({days: 1}).toFormat('ccc dd')}</div>
        <div class="cell" style:--cell-height={`${cellHeight}px`}></div>
        <div class="cell" style:--cell-height={`${cellHeight}px`}></div>
        <div class="cell" style:--cell-height={`${cellHeight}px`}></div>
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
        text-align: left;
        outline: 0.5px solid grey;
        height: var(--cell-height);
        width: var(--cell-height);
    }
</style>