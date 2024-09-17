import { json } from '@sveltejs/kit';
import { db } from '../../../../db/init';  // TODO


export async function POST({ request }) {
    const { category, timeSpent, startTime } = await request.json();
    try {
        // Insert the row into the database
        const result = await db.run(
            'INSERT INTO tasks (category, time_spent, start) VALUES (?, ?, ?)',
            [category, timeSpent, startTime]
        );

        const query = `
            SELECT 
                id,
                category,
                time_spent AS timeSpent,
                start,
                end
            FROM tasks
            WHERE id = ?;
        `;

        // Query the inserted row using the ID
        const row = await db.get(query, [result.lastID]);  // TODO check
        return json({ task: row });
    } catch (error) {
        return json({ error: 'Failed to add task' }, { status: 500 });
    }
}

export async function GET() {
    // console.log("Getting all tasks")
    const query = `
        SELECT 
            id,
            category,
            time_spent AS timeSpent,
            start,
            end
        FROM tasks;
    `;
    try {
        const tasks = await db.all(query);  // TODO check
        return json(tasks);
    } catch (error) {
        return json({ error: 'Failed to fetch tasks' }, { status: 500 });
    }
}

export async function DELETE() {
    try {
        // Delete all tasks from the database
        await db.run('DELETE FROM tasks');  // TODO check

        return json({ message: 'All tasks deleted successfully' });
    } catch (error) {
        return json({ error: 'Failed to delete tasks' }, { status: 500 });
    }
}