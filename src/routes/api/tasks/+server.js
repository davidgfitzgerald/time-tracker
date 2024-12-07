import { json } from '@sveltejs/kit';
import pool from '../../../db/pool';
/**
 * @typedef {import('@sveltejs/kit').RequestEvent} RequestEvent
 */

/**
 * Handle a GET request.
 * 
 * @returns {Promise<Response>} The response object.
 */
export async function GET() {
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
        console.log("Retrieving tasks...")
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
 * @param {RequestEvent} request - The request event object.
 * @returns {Promise<Response>} The response object.
 */
export async function POST({ request }) {
    const { startTime } = await request.json();
    // console.log(`startTime: ${startTime}`)
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
        
        // console.debug("Backend: Inserting row")
        const res = await pool.query(query, values)
        // console.debug("Backend: Inserted row")
        const row = res.rows[0]
        // console.debug(`Backend: startTime: ${row.startTime}`)
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
    const { taskId, category, timeSpent, endTime } = await request.json();

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
        let values = [category, timeSpent, endTime, taskId]
        // console.debug(`Backend: Updating row ID=${taskId}`)
        const res = await pool.query(query, values)
        // console.debug(`Backend: Updated row ID=${taskId}`)
        const row = res.rows[0]
        // console.debug(`Backend: Task: ${row}`)
        return json({ task: row})
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
        // console.log("Clearing DB")
        const query = 'DELETE FROM tasks'
        await pool.query(query);
        // console.log("Cleared DB")

        return json({ message: 'All tasks deleted successfully' });
    } catch (error) {
        return json({ error: 'Failed to delete tasks' }, { status: 500 });
    }
}