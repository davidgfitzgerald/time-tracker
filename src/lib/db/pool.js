import pkg from 'pg'; // Import the default export from the pg package
import dotenv from 'dotenv';

// Destructure Pool from the default export
const { Pool } = pkg;

// Load environment variables from .env file
dotenv.config();

const port = process.env.POSTGRES_PORT ? parseInt(process.env.POSTGRES_PORT, 10) : 5432;


// Create a pool instance with your PostgreSQL connection details
const pool = new Pool({
  user: process.env.POSTGRES_USER || 'admin',
  host: process.env.POSTGRES_HOST || 'localhost',
  database: process.env.POSTGRES_DB || 'taskdb',
  password: process.env.POSTGRES_PASSWORD || 'password',
  port: port,
});

// Export the pool for use in your application
export default pool;
