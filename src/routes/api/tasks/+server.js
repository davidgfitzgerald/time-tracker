import { json } from '@sveltejs/kit';
import pool from '../../../db/pool';
import { getCurrentTime } from '$lib/utils/time';
/**
 * @typedef {import('@sveltejs/kit').RequestEvent} RequestEvent
 */

/**
 * Handle a GET request.
 * 
 * @returns {Promise<Response>} The response object.
 */
export async function GET() {
    console.log("Fetching tasks from DB")
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
        const tasks = await pool.query(query);
        return json(tasks.rows);
    } catch (error) {
        console.error(error)
        return json({ error: 'Failed to fetch tasks' }, { status: 500 });
    }
}


/**
 * Handle a POST request.
 * 
 * @returns {Promise<Response>} The response object.
 */
export async function POST() {
    const startTime = getCurrentTime()
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
            `
        const values = [startTime]
        
        const res = await pool.query(query, values)
        const row = res.rows[0]
        console.log(`Task ${row.id} created`);
        return json({ task: row });
    } catch (error) {
        console.error(error)
        return json({ error: 'Failed to add task' }, { status: 500 });
    }
}

/**
 * Handle a PUT request.
 * 
 * @param {RequestEvent} request - The request event object.
 * @returns {Promise<Response>} The response object.
 */
export async function PUT({ request }) {
    const { id, category, timeSpent, endTime } = await request.json();

    try {
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
        `
        let values = [category, timeSpent, endTime, id]
        // console.debug(`Backend: Updating row ID=${id}`)
        const result = await pool.query(query, values)
        // console.debug(`Backend: Updated row ID=${id}`)
        const row = result.rows[0]
        
        // Create one new task - we always have at least one active
        const response = await POST()
        const data = await response.json()

        // console.debug(`Backend: Task: ${row}`)
        return json({ tasks: {updated: row, new: data.task}})
    } catch (error) {
        console.error(error)
        return json({ error: 'Failed to update task' }, { status: 500 });
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
        await pool.query('DELETE FROM tasks');
        console.log("Cleared DB")
        
        // Create one new task - we always have at least one active
        const res = await POST()
        const data = await res.json()

        return json({ task: data.task, message: 'All tasks deleted successfully' });
    } catch (error) {
        console.error(error)
        return json({ error: 'Failed to delete tasks' }, { status: 500 });
    }
}