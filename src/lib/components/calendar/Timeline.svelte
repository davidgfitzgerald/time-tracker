<script>
	import { DateTime, Interval } from 'luxon';
	import Overlay from './Overlay.svelte';
	import { times } from '$lib/stores';
	import { splitIntervalByDays } from '$lib/utils/time';
	import { calculatePositions, findDayIndex } from './overlay';
	import Calendar from './Calendar.svelte';
	import Clock from './Clock.svelte';

	// Height and width state
	const cellHeight = $state(28);
	const cellWidth = $state(100);
	const headerRowHeight = $state(50);
	const headerWidth = $derived(cellWidth);
	let innerWidth = $state(0)  // Maps to window.innerWidth
	
	// Day state
	let initialDay = $state(DateTime.now().minus({days: 5}))
	let maxVisibleDaysCount = $derived(Math.floor((innerWidth - cellWidth) / cellWidth))
	let visibleDaysCount = $derived(Math.min(maxVisibleDaysCount, 15))

	/**
	 * @type {DateTime[]}
	 */
	let daysToDisplay = $derived.by(() => {
		/**
		 * @type {DateTime[]}
		 */
		const days = [];
		Array.from({ length: visibleDaysCount }, () => addDayToStart(days));
		return days;
	});


	/**
	 * @param {DateTime[]} days
	 */
	function addDayToStart(days) {
		const latestDay = days.at(-1)
		if (latestDay == undefined) {
			days.push(initialDay)
		} else {
			days.push(latestDay.plus({days: 1}))
		}
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
	function taskInBounds(task) {
		if (task.endTime === null) return false;

		const start = DateTime.fromISO(task.startTime);
		const end = DateTime.fromISO(task.endTime);
		const startInBounds = findDayIndex(daysToDisplay, start) != -1;
		const endInBounds = findDayIndex(daysToDisplay, end) != -1;
		return startInBounds || endInBounds;
	}

	/**
	 * @param {Interval} interval
	 * @returns {boolean}
	 */
	function intervalInBounds(interval) {
		const start = interval.start
		const end = interval.end
		const startInBounds = findDayIndex(daysToDisplay, start) != -1;
		const endInBounds = findDayIndex(daysToDisplay, end) != -1;
		return startInBounds && endInBounds;
	}

	/**
	 * Constructs reactive data of this format:
	 *
	 * 	[
	 * 		{
	 * 			"task": {...},
	 * 			"positions": [
	 * 				{...},
	 * 				{...}
	 * 			]
	 * 		}
	 * 	]
	 * @type {import("./overlay").TaskAndPositions[]}
	 */
	const tasksAndPositions = $derived(
		$times.tasks
			.filter(nonActive)
			.filter(taskInBounds)
			.map((task) => {
				const interval = Interval.fromDateTimes(
					DateTime.fromISO(task.startTime),
					DateTime.fromISO(task.endTime)
				);
				const intervals = splitIntervalByDays(interval);
				return { task, intervals };
			})
			.map(({task, intervals}) => {
				intervals = intervals.filter(intervalInBounds);
				return {task, intervals}
			})
			.map(({task, intervals}) => {
				const positions = calculatePositions(
					intervals,
					cellHeight,
					cellWidth,
					headerRowHeight,
					daysToDisplay
				);
				return { task, positions}
			})
	);
</script>

<!-- Bind window.innderWidth to the innerWidth state var -->
<svelte:window bind:innerWidth={innerWidth} />

<div class="calendar">
	<Calendar 
		{daysToDisplay}
		--cell-height={cellHeight}
		--cell-width={cellWidth}
		--header-height={headerRowHeight}
		--header-width={headerWidth}

	>
		<Clock/>
	</Calendar>
	{#each tasksAndPositions as { task, positions }}
		<Overlay {task} {positions}></Overlay>
	{/each}
	<div>
		<button onclick={() => {initialDay = initialDay.minus({days: 1})}}>Left</button>
		<button onclick={() => {initialDay = initialDay.plus({days: 1})}}>Right</button>
	</div>
</div>

<style>
	.calendar {
		display: flex;
		flex-direction: row;
		position: relative;
	}
</style>
