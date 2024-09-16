// src/lib/database.js
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Open and configure the SQLite database
export const db = await open({
    filename: 'src/lib/db/app.db', // Path to the SQLite database file
    driver: sqlite3.Database
});

// Load SQL schema from the file
const schemaPath = resolve('src/lib/db/schema.sql');
const schemaSQL = readFileSync(schemaPath, 'utf-8');

// Initialize the tasks table if it doesn't exist
export async function initializeDB() {
    try {
        await db.exec(schemaSQL);
    } catch (error) {
        console.error('Failed to initialize the database:', error);
    }
}
