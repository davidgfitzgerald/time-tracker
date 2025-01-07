import { HRS_IN_DAY, SECS_IN_DAY } from '$lib/utils/time';

/**
 * @typedef {import('luxon').Interval<IsValid>} Interval
 * @template {boolean} [IsValid=import("luxon/src/_util").Valid]
 * @typedef {import("luxon/src/_util").Valid} Valid === true
 * @typedef {import('luxon').DateTime} DateTime
 */


/**
 * Position of an overlay on the calendar.
 * @typedef {Object} Position
 * @property {number} top
 * @property {number} left
 * @property {number} height
 * @property {number} width
 */

/**
 * @typedef {Object} TaskAndIntervals
 * @property {import('$lib/stores').Task} task - Single task
 * @property {Interval<Valid>[]} intervals - Intervals of the task, split by day
 */

/**
 * @typedef {Object} TaskAndPositions
 * @property {import('$lib/stores').Task} task - Single task
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
 * @param {Interval<Valid>} interval
 * @param {number} cellHeight - Height of a cell in pixels
 * @param {number} headerRowHeight - Additional height to offset (to take into account header row)
*/
export function calculateTop(interval, cellHeight, headerRowHeight) {
	const start = interval.start;
	const secondsSinceMidnight = start.toSeconds() - start.startOf('day').toSeconds();
	const pxSinceMidnight = secondsToPx(secondsSinceMidnight, cellHeight);
	const top = pxSinceMidnight + headerRowHeight;
	return top;
}

/**
 * @param {number} seconds - Number of seconds
 * @param {number} cellHeight - Height of a cell in pixels
 * @returns {number} - Number of pixels that equate to that number of seconds
 */
function secondsToPx(seconds, cellHeight) {
	const bodyHeightPx = HRS_IN_DAY * cellHeight;
	const proportion = seconds / SECS_IN_DAY;
	return proportion * bodyHeightPx;
}

/**
 * @param {Interval<Valid>} interval - The interval of time to display
 * @param {number} top - Pixel distance between top of view and start of this overlay
 * @param {number} cellHeight - Height of a cell in pixels
 * @param {number} headerRowHeight - Additional height to offset (to take into account header row)
 */
export function calculateHeight(interval, top, cellHeight, headerRowHeight) {
	const proposedPx = secondsToPx(interval.length('seconds'), cellHeight);
	
	const screenHeightPx = secondsToPx(SECS_IN_DAY, cellHeight);
	const remainingPx = screenHeightPx - top + headerRowHeight;

	/**
	 * Aim to use the proposed px but resort to
	 * displaying only the remaining pixels left
	 * for that day.
	 *
	 * Otherwise overlay could spill out of the
	 * day.
	 */
	return Math.min(proposedPx, remainingPx);
}

/**
 * @param {Interval<Valid>[]} intervals
 * @param {number} cellHeight - Height of a cell in pixels
 * @param {number} cellWidth - Width of a cell in pixels
 * @param {number} headerRowHeight - Additional height to offset (to take into account header row)
 * @param {number} headerColWidth
 * @param {DateTime[]} daysToDisplay
 * @return {Position[]}
 */
export function calculatePositions(
	intervals,
	cellHeight,
	cellWidth,
	headerRowHeight,
	headerColWidth,
	daysToDisplay
) {
	return intervals.map((interval) => {
		const dayIndex = findDayIndex(daysToDisplay, interval.start);
		const left = headerColWidth + (cellWidth * dayIndex);
		const top = calculateTop(interval, cellHeight, headerRowHeight);
		const height = calculateHeight(interval, top, cellHeight, headerRowHeight);
		return {
			top,
			left,
			height,
			width: cellWidth
		};
	});
}
