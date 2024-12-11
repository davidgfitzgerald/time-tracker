import { json } from '@sveltejs/kit';
import POOL from '../../../db/pool';
import { calculateDuration, getCurrentTime } from '$lib/utils/time';
/**
 * @typedef {import('@sveltejs/kit').RequestEvent} RequestEvent
 */

/**
 * Handle a GET request for all tasks.
 *
 * @returns {Promise<Response>} The response object.
 */
export async function GET() {
	console.log('Fetching tasks from DB');
	const query = `
        SELECT 
            id,
            category,
            time_spent AS "timeSpent",
            start_time AS "startTime",
            end_time as "endTime",
            status
        FROM tasks;
    `;
	try {
		const tasks = await POOL.query(query);
		return json(tasks.rows);
	} catch (error) {
		console.error(error);
		return json({ error: 'Failed to fetch tasks' }, { status: 500 });
	}
}

/**
 * Handle a POST request.
 *
 * @returns {Promise<Response>} The response object.
 */
export async function POST() {
	const startTime = getCurrentTime();
	try {
		const query = `
            INSERT INTO tasks (
                start_time
            ) VALUES (
                $1
            ) RETURNING
                id,
                category,
                time_spent AS "timeSpent",
                start_time AS "startTime",
                end_time AS "endTime",
                status;
            `;
		const values = [startTime];

		const res = await POOL.query(query, values);
		const row = res.rows[0];
		console.log(`Task ${row.id} created`);
		return json({ task: row });
	} catch (error) {
		console.error(error);
		return json({ error: 'Failed to add task' }, { status: 500 });
	}
}

/**
 * Handle a DELETE request.
 *
 * @returns {Promise<Response>} The response object.
 */
export async function DELETE() {
	try {
		// Delete all tasks from the database
		await POOL.query('DELETE FROM tasks');
		console.log('Cleared DB');

		// Create one new task - we always have at least one active
		const res = await POST();
		const data = await res.json();

		return json({ task: data.task, message: 'All tasks deleted successfully' });
	} catch (error) {
		console.error(error);
		return json({ error: 'Failed to delete tasks' }, { status: 500 });
	}
}
