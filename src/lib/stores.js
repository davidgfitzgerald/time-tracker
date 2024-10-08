import { writable } from "svelte/store";

/**
 * @typedef {Object} Task
 * @property {number} id - The ID of the task
 * @property {string} category - The category of the task
 * @property {number} timeSpent - Time spent on the task in seconds
 * @property {string} startTime - The start timestamp of the task  // TODO rename to startTime
 * @property {string} endTime - The end timestamp of the task
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
