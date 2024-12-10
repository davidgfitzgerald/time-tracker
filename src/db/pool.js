import fs from 'fs';
import pkg from 'pg'; // Import the default export from the pg package
import 'dotenv/config';


// Destructure Pool from the default export
const { Pool } = pkg;

const port = process.env.POSTGRES_PORT ? parseInt(process.env.POSTGRES_PORT, 10) : 5432;
const user = process.env.POSTGRES_USER ? process.env.POSTGRES_USER : "admin";
const host = process.env.POSTGRES_HOST ? process.env.POSTGRES_HOST : "localhost";
const database = process.env.POSTGRES_DATABASE ? process.env.POSTGRES_DATABASE : "time_tracker";
const password = process.env.POSTGRES_PASSWORD ? process.env.POSTGRES_PASSWORD : "password";

console.log("\nDatabase Connection:")
console.log("    port", port)
console.log("    user", user)
console.log("    host", host)
console.log("    database", database, "\n")

/**
 * @type {pkg.PoolConfig}
 */
const DB_CREDS = {
    user,
    host,
    database,
    password,
    port,
    ssl: { 
        rejectUnauthorized: true,
        ca: fs.readFileSync('src/db/us-west-2-bundle.pem').toString(),
    }
}

// If we run docker locally then we do not need AWS SSL config
const LOCAL_DEV = process.env.LOCAL_DEV ? process.env.LOCAL_DEV : false;
console.log("    LOCAL_DEV", LOCAL_DEV, "\n")
if (LOCAL_DEV) {
    delete DB_CREDS.ssl
}

// Create a pool instance with your PostgreSQL connection details
const POOL = new Pool(DB_CREDS);

// Export the pool for use in your application
export default POOL;