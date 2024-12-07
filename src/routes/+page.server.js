/**
 * @type {import("$lib/stores").Task[]}
 */
let tasks = [];
let error = '';

/** 
 * @type {import('./$types').PageServerLoad}
 * This always loads data from DB on initial page hydration via the server
 * and automatically passes it back to the client in +page.svelte.
 */
export async function load({ fetch }) {
    try {
        console.log("Page loaded!")
        const res = await fetch('/api/tasks');
        if (res.ok) {
            tasks = await res.json();
            if (tasks.length == 0) {
                console.log("No tasks found.")
                await createTask(fetch);
            }
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

/**
 * 
 * @param {typeof fetch} fetch 
 */
async function createTask(fetch) {
    const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const { task } = await res.json();
    console.log(`Task ${task.id} created`);
    tasks = [task];
}
