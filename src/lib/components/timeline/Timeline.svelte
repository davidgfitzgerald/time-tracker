<script>
	import { DateTime, Interval } from 'luxon';
	import Overlay from './Overlay.svelte';
	import { times } from '$lib/stores';
	import { splitIntervalByDays } from '$lib/utils/time';
	import { calculatePositions, findDayIndex } from './overlay';
	
	const now = DateTime.now();

	const hoursInDay = 24;
	const cellHeight = 100;

	let hours = [];
	for (let i = 0; i < hoursInDay; i++) {
		hours.push(`${i.toString().padStart(2, '0')}:00`);
	}

	let daysToDisplay = [now];
	for (let i = 1; i < 7; i++) {
		daysToDisplay.push(now.plus({ days: i }));
		daysToDisplay.unshift(now.minus({ days: i }));
	}

	/**
	 * @param {import('$lib/stores').Task} task
	 * @returns {task is import('$lib/stores').Task & { endTime: string }}
	 */
	function nonActive(task) {
		return task.endTime !== null && task.status !== 'ACTIVE';
	}

	/**
	 * @param {import('$lib/stores').Task} task
	 * @returns {task is import('$lib/stores').Task & { endTime: string }}
	 */
	function inBounds(task) {
		if (task.endTime === null) return false

		const start = DateTime.fromISO(task.startTime)
		const end = DateTime.fromISO(task.endTime)
		const startInBounds = findDayIndex(daysToDisplay, start) != -1
		const endInBounds = findDayIndex(daysToDisplay, end) != -1
		return startInBounds && endInBounds;
	}

	/**
	 * @type {import("./overlay").TaskAndPositions[]}
	 */
	const tasksAndPositions = $times.tasks
		.filter(nonActive)
		.filter(inBounds)
		.map((task) => {
			const interval = Interval.fromDateTimes(
				DateTime.fromISO(task.startTime),
				DateTime.fromISO(task.endTime)
			)
			const intervals = splitIntervalByDays(interval)
			const positions = calculatePositions(intervals, daysToDisplay)

			return {task, positions}
		});
</script>

<div class="calendar" style="--cell-height: {cellHeight}">
	<div class="column">
		<div class="cell"></div>
		{#each hours as hour}
			<div class="cell">{hour}</div>
		{/each}
	</div>
	{#each daysToDisplay as day, i}
		<div class="column">
			<div class="cell header">
				{day.toFormat('ccc dd')}
			</div>
			{#each hours}
				<div class="cell"></div>
			{/each}
		</div>
		{/each}
	{#each tasksAndPositions as { task, positions }}
		{#each positions as position}
			<Overlay {position} {task}></Overlay>
		{/each}
	{/each}
</div>

<style>
	.calendar {
		display: flex;
		flex-direction: row;
		position: relative;
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
