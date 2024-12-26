<script>
	import { DateTime, Interval } from 'luxon';
	import Overlay from './Overlay.svelte';
	import { times } from '$lib/stores';
	import { splitIntervalByDays } from '$lib/utils/time';
	import { calculatePositions, findDayIndex } from './overlay';
	import Calendar from './Calendar.svelte';
	import Clock from './Clock.svelte';

	// Height and width
	const cellHeight = $state(28);
	const cellWidth = $state(100);
	const headerRowHeight = $state(50); // Minimum 30
	const headerColWidth = $derived(cellWidth);
	let innerWidth = $state(0)  // window.innerWidth
	
	// Day state
	let initialDay = $state(DateTime.now().minus({days: 5}))
	let maxVisibleDaysCount = $derived(Math.floor((innerWidth - headerColWidth) / cellWidth))
	let visibleDaysCount = $derived(Math.min(maxVisibleDaysCount, 15))

	/**
	 * @type {DateTime[]}
	 */
	let daysToDisplay = $derived.by(() => {
		/**
		 * @type {DateTime[]}
		 */
		const days = [];
		Array.from({ length: visibleDaysCount }, () => appendDay(days));
		return days;
	});


	/**
	 * Append the next day
	 * to a list of days.
	 * @param {DateTime[]} days
	 */
	function appendDay(days) {
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
					headerColWidth,
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
		--header-row-height={headerRowHeight}
		--header-col-width={headerColWidth}

	>
		<Clock --width={headerColWidth}/>
	</Calendar>
	{#each tasksAndPositions as { task, positions }}
		<Overlay {task} {positions}></Overlay>
	{/each}
</div>
<div>
	<button onclick={() => {initialDay = initialDay.minus({days: 1})}}>Left</button>
	<button onclick={() => {initialDay = initialDay.plus({days: 1})}}>Right</button>
</div>

<style>
	.calendar {
		display: flex;
		flex-direction: row;
		position: relative;
	}
</style>
