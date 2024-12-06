/**
 * @type {import("$lib/stores").Task[]}
 */
let tasks = [];
let error = '';

export async function load({ fetch }) {
    try {
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