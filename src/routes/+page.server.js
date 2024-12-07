/**
 * @type {import("$lib/stores").Task[]}
 */
let tasks = [];
let error = '';

// This always loads data from DB on initial page hydration on the server
// and automatically passes it back to the client in +page.svelte.
export async function load({ fetch }) {
    try {
        console.log("Fetching tasks from API endpoint")
        const res = await fetch('/api/tasks');
        if (res.ok) {
            tasks = await res.json();
        } else {
            error = 'Failed to fetch tasks';
            console.error(error)
        }
    } catch (err) {
        console.error(err)
        error = 'An error occurred while fetching tasks';
    }
    return {tasks, error}
}