import { DateTime, Interval } from 'luxon';

const hoursInDay = 24;
const cellHeight = 100;
const cellWidth = cellHeight;
const externalOffset = cellHeight; // Header cell height
const bodyHeightPx = hoursInDay * cellHeight;
const secondsInHour = 60 * 60;
const totalSecondsInDay = hoursInDay * secondsInHour;
const screenHeightPx = secondsToPx(totalSecondsInDay);

/**
 * Position of an overlay on the calendar.
 * @typedef {Object} Position
 * @property {number} top
 * @property {number} left
 * @property {number} height
 */

/**
 * @typedef {Object} TaskAndPositions
 * @property {import('$lib/stores').Task} task - Array of tasks
 * @property {Position[]} positions - Overlay positions
 */

/**
 * Find the index of a day within a list.
 *
 * Returns -1 if the day is not found.
 * @param {DateTime[]} days
 * @param {DateTime} day
 * @returns
 */
export function findDayIndex(days, day) {
	const formattedDays = days.map((d) => d.toFormat('yyyy-LL-dd'));
	const i = formattedDays.indexOf(day.toFormat('yyyy-LL-dd'));
	return i;
}

/**
 * @param {Interval<import("luxon/src/_util").Valid>} interval
 */
export function calculateTop(interval) {
	const start = interval.start;
	const secondsSinceStartOfDay = start.toSeconds() - start.startOf('day').toSeconds();
	const pxOffset = secondsToPx(secondsSinceStartOfDay);
	const top = pxOffset + externalOffset;
	return top;
}

/**
 * @param {number} seconds - Number of seconds
 * @returns {number} - Number of pixels that equate to that number of seconds
 */
function secondsToPx(seconds) {
	const proportion = seconds / totalSecondsInDay;
	return proportion * bodyHeightPx;
}

/**
 * @param {Interval} interval - The interval of time to display
 * @param {number} top - Pixel distance between top of view and start of this overlay
 */
export function calculateHeight(interval, top) {
	const requiredPx = secondsToPx(interval.length('seconds'));
	const remainingPx = screenHeightPx - top + externalOffset;

	/**
	 * Aim to use the required px but resort to
	 * displaying only for the remaining pixels left
	 * for that day.
	 *
	 * Otherwise overlay will spill over out of the
	 * day.
	 *
	 * TODO - Handle the case when time spills over
	 * into a new day.
	 */
	return Math.min(requiredPx, remainingPx);
}

/**
 * @param {Interval<import("luxon/src/_util").Valid>[]} intervals
 * @param {DateTime[]} daysToDisplay
 * @return {Position[]}
 */
export function calculatePositions(intervals, daysToDisplay) {
	return intervals.map((interval) => {
		const dayIndex = findDayIndex(daysToDisplay, interval.start);
		const left = cellWidth * (dayIndex + 1);
		const top = calculateTop(interval);
		const height = calculateHeight(interval, top);
		return {
			top,
			left,
			height
		};
	});
}
