import { Interval } from 'luxon';

export const HRS_IN_DAY = 24;
export const SECS_IN_HR = 60 * 60;
export const SECS_IN_DAY = HRS_IN_DAY * SECS_IN_HR;

/**
 * Convert duration (s) to HH:MM:SS format
 *
 * @param {number} duration (secs)
 * @returns {string} duration in HH:MM:SS format
 */
export function formatDuration(duration) {
	const hours = String(Math.floor(duration / 3600)).padStart(2, '0');
	const minutes = String(Math.floor((duration % 3600) / 60)).padStart(2, '0');
	const seconds = String(duration % 60).padStart(2, '0');
	return `${hours}:${minutes}:${seconds}`;
}

/**
 * Get the current time in YYYY-MM-DD HH:MM:SS format.
 *
 * @returns {string} - The current time in YYYY-MM-DD HH:MM:SS format
 */
export function getCurrentTime() {
	const date = new Date();

	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
	const day = String(date.getDate()).padStart(2, '0');
	const hours = String(date.getHours()).padStart(2, '0');
	const minutes = String(date.getMinutes()).padStart(2, '0');
	const seconds = String(date.getSeconds()).padStart(2, '0');

	const local = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

	return local;
}

/**
 * Convert a UTC date/time string to local time.
 *
 * @param {string} utcDateStr The UTC date/time string in YYYY-MM-DD HH:MM:SS format
 * @returns {string} The local date/time string in YYYY-MM-DD HH:MM:SS format
 */
export function convertUTCToLocal(utcDateStr) {
	const date = new Date(utcDateStr);

	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
	const day = String(date.getDate()).padStart(2, '0');
	const hours = String(date.getHours()).padStart(2, '0');
	const minutes = String(date.getMinutes()).padStart(2, '0');
	const seconds = String(date.getSeconds()).padStart(2, '0');

	const local = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

	return local;
}

/**
 * @param {string} startTime
 * @returns {number} Duration in seconds
 * Calculate duration between start time and now.
 */
export function calculateDuration(startTime) {
	const now = new Date();
	const startDate = new Date(startTime);
	return Math.floor((now.valueOf() - startDate.valueOf()) / 1000);
}

/**
 *
 * @param {number} secs
 * @returns
 */
export function sleep(secs) {
	const ms = secs * 1000;
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Split an interval up by days.
 *
 * If you provided an interval spanning 
 * multiple days such as:
 * 
 *  [2000-01-30 6pm - 2000-01-31 3pm]
 *
 * this would split that interval up at midnight
 * into two sub-intervals:
 * 
 * 	[2000-01-30 6pm - 2000-01-31 00:00am] and
 * 	[2000-01-31 00:00am - 2000-01-31 3pm]
 * 
 * If an does not span multiple days, then the 
 * original interval is returned as the only 
 * element in an array.
 * @param {Interval<import('luxon/src/_util').Valid>} interval
 * @returns {Interval[]}
 */
export function splitIntervalByDays(interval) {
	let intervals = [];
	let startPointer = interval.start;

	while (startPointer.day != interval.end.day) {
		let endPointer = startPointer.plus({ days: 1 }).startOf('day');
		intervals.push(Interval.fromDateTimes(startPointer, endPointer));
		startPointer = endPointer;
	}
	intervals.push(Interval.fromDateTimes(startPointer, interval.end));

	return intervals;
}
