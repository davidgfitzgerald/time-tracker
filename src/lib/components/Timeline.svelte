<script>
	import { DateTime } from "luxon";

    const dates = [
        DateTime.now(),
        DateTime.now().plus({days: 1}),
        DateTime.now().plus({days: 2}),
        DateTime.now().plus({days: 3}),
    ]
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

        <div class="cell highlight"></div>
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
        height: 50px;
        width: 50px;
        /* overflow:scroll; */
    }

    .highlight {
        position: absolute;
        background-color: rgba(255, 165, 0, 0.7); /* Orange with opacity */
        
        top: 0;
        /* bottom: 100;
        height: 100%;
        width: 100%; */

        /* padding: 1rem; */
        /* height: 50px;
        width: 50px; */
    }
</style>