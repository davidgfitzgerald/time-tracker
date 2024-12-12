import { json } from '@sveltejs/kit';
import POOL from '../../../../db/pool';
import { calculateDuration, getCurrentTime } from '$lib/utils/time';
/**
 * @typedef {import('@sveltejs/kit').RequestEvent} RequestEvent
 */

/**
 * Handle a GET request for a task.
 *
 * @param {RequestEvent} request - The request event object.
 * @returns {Promise<Response>} The response object.
 */
export async function GET({ params }) {
	const { id } = params;

	console.log('Fetching task from DB');
	const query = `
        SELECT 
            id,
            category,
            time_spent AS "timeSpent",
            start_time AS "startTime",
            end_time as "endTime",
            status
        FROM tasks
        WHERE id = $1;
    `;
	try {
		const values = [id];
		const task = await POOL.query(query, values);
		if (task.rowCount != 1) {
			throw new Error('Duplicate task ID found in database!');
		}
		return json({ task: task.rows[0] });
	} catch (error) {
		console.error(error);
		return json({ error: `Failed to fetch task ${id}` }, { status: 500 });
	}
}

/**
 * Handle a PUT request.
 *
 * Update a task with the given category. The duration of the task
 * and end time is calculated and updated on the task. The task
 * is automatically moved to COMPLETED state and the next ACTIVE
 * task is created.
 *
 * It seems overloaded for this endpoint to be responsible for creating
 * the new ACTIVE task so it is worth looking into in future to
 * perhaps add a trigger onto the database that automatically creates
 * a new ACTIVE task when the last one gets moved to COMPLETED.
 *
 * @param {RequestEvent} request - The request event object.
 * @returns {Promise<Response>} The response object.
 */
export async function PUT({ params, request, fetch }) {
	const { id } = params;
	const { category } = await request.json();

	try {
		const res = await fetch(`/api/tasks/${id}`);
		const { task } = await res.json();

		let query = `
            UPDATE tasks 
            SET (
                category,
                time_spent,
                end_time,
                status
            ) = (
                $1,
                $2,
                $3,
                'COMPLETE'
            )
            WHERE 
                id = $4
            RETURNING
                id,
                category,
                time_spent AS "timeSpent",
                start_time AS "startTime",
                end_time AS "endTime",
                status;
        `;
		let endTime = getCurrentTime();
		const timeSpent = calculateDuration(task.startTime);
		let values = [category, timeSpent, endTime, id];

		// TODO - make updating existing row AND creating the
		// new row atomic. This is a potential bug.
		const result = await POOL.query(query, values);
		const updatedTask = result.rows[0];

		// Create one new task - we always have at least one active
		const response = await fetch(`/api/tasks`, {
			method: 'POST'
		});
		const { task: newTask } = await response.json();

		return json({ updatedTask, newTask });
	} catch (error) {
		console.error(error);
		return json({ error: 'Failed to update task' }, { status: 500 });
	}
}
