import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { read } from '$lib/utils/file';

const SQLITE_DB = 'src/lib/db/app.db'

// Open and configure the SQLite database
export const db = await open({
    filename: SQLITE_DB, // Path to the SQLite database file
    driver: sqlite3.Database
});

// Initialize the DB tables if they don't exist
export async function initializeDB() {
    try {
        await db.exec(read('src/lib/db/schema.sql'));
    } catch (error) {
        console.error('Failed to initialize the database:', error);
    }
}
