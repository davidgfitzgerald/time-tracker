/**
 * Functions extracted out of +layout.svelte in order to keep
 * that file more visually clear of the layout.
 * 
 * These functions mount for the lifetime of the application.
 * The duration store is updated such that the timer always 
 * displays the correct duration.
 */
import { duration } from "$lib/stores";
import { calculateDuration } from "./time";

/**
 * Finds the active task and calculates the elapsed duration.
 * Updates the `duration` store.
 * @param {import("$lib/stores").Task[]} tasks
 */
export function updateDuration(tasks) {
    const activeTask = tasks.find((t) => t.status === "ACTIVE");
    if (activeTask) {
        duration.set(calculateDuration(activeTask.startTime))
    }
}

/**
 * Sets up an interval and a svelte store subscription to update the duration.
 * Returns a teardown function for cleanup.
 * @param {import('svelte/store').Writable<import('$lib/stores').TimesStore>} times
 * @param {Function} updateCallback
 * @returns {() => void} Cleanup function
 */
export function setupClock(times, updateCallback) {
    const intervalId = setInterval(() => updateCallback(), 1000);
    const unsubscribe = times.subscribe(() => updateCallback());

    return () => {
        clearInterval(intervalId);
        unsubscribe();
    };
}
