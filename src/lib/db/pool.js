import pkg from 'pg'; // Import the default export from the pg package
import 'dotenv/config';

// Destructure Pool from the default export
const { Pool } = pkg;

const port = process.env.POSTGRES_PORT ? parseInt(process.env.POSTGRES_PORT, 10) : 5432;
const user = process.env.POSTGRES_USER ? process.env.POSTGRES_USER : "admin";
const host = process.env.POSTGRES_HOST ? process.env.POSTGRES_HOST : "localhost";
const database = process.env.POSTGRES_DATABASE ? process.env.POSTGRES_DATABASE : "time_tracker";
const password = process.env.POSTGRES_PASSWORD ? process.env.POSTGRES_PASSWORD : "password";

const creds = {
    user,
    host,
    database,
    password,
    port,
    ssl: { rejectUnauthorized: false }  // Add this line to enable SSL and ignore certificate validation
}

// Create a pool instance with your PostgreSQL connection details
const pool = new Pool(creds);

// Export the pool for use in your application
export default pool;
