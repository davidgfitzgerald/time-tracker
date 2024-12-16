import { writable } from 'svelte/store';

/**
 * @typedef {Object} Task
 * @property {number} id - The ID of the task
 * @property {string | null} category - The category of the task
 * @property {number | null} timeSpent - Time spent on the task in seconds
 * @property {string} startTime - The start timestamp of the task
 * @property {string | null} endTime - The end timestamp of the task
 * @property {string} status - The status of the task, either 'ACTIVE' or 'COMPLETE'
 */

/**
 * @typedef {Object} TimesStore
 * @property {Task[]} tasks - Array of tasks
 * @property {string} error - Error message, if any
 */

/**
 * @type {import('svelte/store').Writable<TimesStore>}
 */
export let times = writable({
	tasks: [],
	error: ''
});

/**
 * @type {import('svelte/store').Writable<number>}
 */
export let duration = writable(0);
