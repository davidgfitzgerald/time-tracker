import { json } from '@sveltejs/kit';
import pool from '$lib/db/pool';


export async function POST({ request }) {
    const { category, timeSpent, startTime } = await request.json();
    try {
        let query = `
            INSERT INTO tasks(
                category,
                time_spent,
                start
            ) VALUES(
                $1,
                $2,
                $3
            ) RETURNING 
                id,
                category,
                time_spent AS "timeSpent",
                start,
                end_time as "endTime",
                status;
            `
        const values = [category, timeSpent, startTime]
        
        // console.debug("Inserting row")
        const res = await pool.query(query, values)
        // console.debug("Inserted row")
        const row = res.rows[0]
        return json({ task: row });
    } catch (error) {
        console.error(error)
        return json({ error: 'Failed to add task' }, { status: 500 });
    }
}

export async function GET() {
    // console.debug("Getting all tasks")
    const query = `
        SELECT 
            id,
            category,
            time_spent AS "timeSpent",
            start,
            end_time as "endTime",
            status
        FROM tasks;
    `;
    try {
        const tasks = await pool.query(query);
        // console.debug("Got tasks")
        // console.debug(tasks.rows)
        return json(tasks.rows);
    } catch (error) {
        console.error(error)
        return json({ error: 'Failed to fetch tasks' }, { status: 500 });
    }
}

export async function DELETE() {
    try {
        // Delete all tasks from the database
        // console.log("Clearing DB")
        await pool.query('DELETE FROM tasks');
        // console.log("Cleared DB")

        return json({ message: 'All tasks deleted successfully' });
    } catch (error) {
        return json({ error: 'Failed to delete tasks' }, { status: 500 });
    }
}