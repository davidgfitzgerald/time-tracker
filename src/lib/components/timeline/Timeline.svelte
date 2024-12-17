<script>
	import { DateTime, Interval } from 'luxon';
	import Overlay from './Overlay.svelte';
	import { times } from '$lib/stores';

	const now = DateTime.now();
    
    /**
	 * @param {Interval} interval
	 * @param {DateTime} time
	 * @returns {boolean}
	 */
    function happensOnThisDay(interval, time) {
        const startOfDay = time.startOf('day')
        const startOfTomorrow = startOfDay.plus({days: 1})
        const day = Interval.fromDateTimes(startOfDay, startOfTomorrow)

        return interval.overlaps(day)
    }

	/**
	 * @param {import('$lib/stores').Task} task
	 * @returns {task is import('$lib/stores').Task & { endTime: string }}
	 */
	function nonActive(task) {
		return task.endTime !== null && task.status !== "ACTIVE";
	}

	/**
	 * @typedef {Object} TaskAndInterval
	 * @property {import('$lib/stores').Task} task - Array of tasks
	 * @property {Interval} interval - Error message, if any
	 */

	/**
	 * @type {TaskAndInterval[]}
	 */
	const taskAndIntervals = $times.tasks
		.filter(nonActive)
		.map(task => {
			return {
				task,
				interval: Interval.fromDateTimes(
					DateTime.fromISO(task.startTime),
					DateTime.fromISO(task.endTime),
				)
			}
		}
	)

	const hoursInDay = 24;
	const cellHeight = 100;
	const externalOffset = cellHeight;  // Header cell height

	let hours = [];
	for (let i = 0; i < hoursInDay; i++) {
		hours.push(`${i.toString().padStart(2, '0')}:00`);
	}

	let daysInWeek = [now];
	for (let i = 1; i < 7; i++) {
		daysInWeek.push(now.plus({ days: i }));
		daysInWeek.unshift(now.minus({ days: i }));
	}
</script>

<div class="calendar" style="--cell-height: {cellHeight}">
	<div class="column">
        <div class="cell"></div>
		{#each hours as hour}
			<div class="cell">{hour}</div>
		{/each}
	</div>
	{#each daysInWeek as day}
		<div class="column">
			<div class="cell header">
				{day.toFormat('ccc dd')}
			</div>
            {#each hours}
                <div class="cell"></div>
            {/each}
			{#each taskAndIntervals as {task, interval}}
				{#if happensOnThisDay(interval, day)}
					<Overlay {interval} {cellHeight} {externalOffset} {task}></Overlay>
				{/if}
			{/each}
		</div>
	{/each}
</div>

<style>
	.calendar {
		display: flex;
		flex-direction: row;
	}

	.header {
		text-align: center;
		justify-content: center;
	}

	.column {
		position: relative;
	}

	.header {
		text-align: center;

	}

	.cell {
		border-bottom: 1px solid hsl(0, 0%, 80%);
		height: calc(var(--cell-height) * 1px);
		width: calc(var(--cell-height) * 1px);
	}
</style>
