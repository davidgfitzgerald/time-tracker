/**
 * @type {import('./$types').LayoutServerLoad}
 * The server always loads task data from DB on initial page hydration
 * and automatically passes it back to the client in +page.svelte.
 */
export async function load({ fetch }) {
	/**
	 * @type {import("$lib/stores").Task[]}
	 */
	let tasks = [];
	let error = '';

	try {
		console.log('Client requesting first page load!');
		console.log('Fetching tasks from backend.');
		const res = await fetch('/api/tasks');
		console.log('Fetched tasks from DB.');
		if (res.ok) {
			tasks = await res.json();
			if (tasks.length == 0) {
				console.log('No tasks found.');
				const task = await createTask(fetch);
				tasks.push(task);
			}
		} else {
			error = 'Server failed to fetch tasks from DB';
			console.error(error);
		}
	} catch (err) {
		console.error(err);
		error = 'An error occurred while fetching tasks';
	}

	return { tasks, error };
}

/**
 * @param {typeof fetch} fetch
 * @returns {Promise<import("$lib/stores").Task>}
 */
async function createTask(fetch) {
	const res = await fetch('/api/tasks', { method: 'POST' });
	const { task } = await res.json();
	return task;
}
