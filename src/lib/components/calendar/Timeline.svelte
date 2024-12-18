<script>
	import { DateTime, Interval } from 'luxon';
	import Overlay from './Overlay.svelte';
	import { times } from '$lib/stores';
	import { splitIntervalByDays } from '$lib/utils/time';
	import { calculatePositions, findDayIndex } from './overlay';
	import Calendar from './Calendar.svelte';

	const cellHeight = 28;
	const cellWidth = 100;
	const headerHeight = cellHeight;

	const now = DateTime.now();

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
		if (task.endTime === null) return false;

		const start = DateTime.fromISO(task.startTime);
		const end = DateTime.fromISO(task.endTime);
		const startInBounds = findDayIndex(daysToDisplay, start) != -1;
		const endInBounds = findDayIndex(daysToDisplay, end) != -1;
		return startInBounds && endInBounds;
	}

	/**
	 * @type {import("./overlay").TaskAndPositions[]}
	 */
	const tasksAndPositions = $derived($times.tasks
		.filter(nonActive)
		.filter(inBounds)
		.map((task) => {
			const interval = Interval.fromDateTimes(
				DateTime.fromISO(task.startTime),
				DateTime.fromISO(task.endTime)
			);
			const intervals = splitIntervalByDays(interval);
			const positions = calculatePositions(intervals, cellHeight, cellWidth, headerHeight, daysToDisplay);

			return { task, positions };
		}))
</script>

<div class="calendar" style="--cell-height: {cellHeight}">
	<Calendar {daysToDisplay}></Calendar>
	{#each tasksAndPositions as { task, positions }}
		<Overlay {task} {positions}></Overlay>
	{/each}
</div>

<style>
	.calendar {
		display: flex;
		flex-direction: row;
		position: relative;
	}
</style>
