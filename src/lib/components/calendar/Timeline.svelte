<script>
	import { DateTime, Interval } from 'luxon';
	import Overlay from './Overlay.svelte';
	import { times } from '$lib/stores';
	import { splitIntervalByDays } from '$lib/utils/time';
	import { calculatePositions, findDayIndex } from './overlay';
	import Calendar from './Calendar.svelte';

	const cellHeight = $state(28);
	const cellWidth = $state(100);
	const headerHeight = $state(50);
	const headerWidth = $derived(cellWidth);

	const initialDay = DateTime.now();

	let daysToDisplay = $state([initialDay])

	function addDayToEnd() {
		const latestDay = daysToDisplay.at(-1)
		if (latestDay == undefined) {
			daysToDisplay.push(initialDay)
		} else {
			daysToDisplay.push(latestDay.plus({days: 1}))
		}
	}

	function addDayToStart() {
		const earliestDay = daysToDisplay.at(0)
		if (earliestDay == undefined) {
			daysToDisplay.unshift(initialDay)
		} else {
			daysToDisplay.unshift(earliestDay.minus({days: 1}))
		}
	}

	function removeDayFromEnd() {
		daysToDisplay.pop()
	}

	function removeDayFromStart() {
		daysToDisplay.shift()
	}

	for (let i = 1; i < 7; i++) {
		addDayToEnd()
		addDayToStart()
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
			.filter(inBounds)
			.map((task) => {
				const interval = Interval.fromDateTimes(
					DateTime.fromISO(task.startTime),
					DateTime.fromISO(task.endTime)
				);
				const intervals = splitIntervalByDays(interval);
				const positions = calculatePositions(
					intervals,
					cellHeight,
					cellWidth,
					headerHeight,
					daysToDisplay
				);

				return { task, positions };
			})
	);
</script>

<div class="calendar">
	<Calendar 
		{daysToDisplay}
		--cell-height={cellHeight}
		--cell-width={cellWidth}
		--header-height={headerHeight}
		--header-width={headerWidth}
	>
	</Calendar>
	{#each tasksAndPositions as { task, positions }}
		<Overlay {task} {positions}></Overlay>
	{/each}
	<div>
		<button onclick={addDayToStart}>Add Day Start</button>
		<button onclick={addDayToEnd}>Add Day End</button>
		<button onclick={removeDayFromStart}>Remove First Day</button>
		<button onclick={removeDayFromEnd}>Remove Last Day</button>
	</div>
</div>

<style>
	.calendar {
		display: flex;
		flex-direction: row;
		position: relative;
	}
</style>
