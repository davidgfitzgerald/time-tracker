import fs from 'fs';
import pkg from 'pg'; // Import the default export from the pg package
import 'dotenv/config';
import _ from 'lodash';


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
let creds = {
    user,
    host,
    database,
    password,
    port,
    ssl: { 
        rejectUnauthorized: true,
        ca: fs.readFileSync('deployment/us-west-2-bundle.pem').toString(),
    }
}

if (host == "localhost") {
    delete creds.ssl
}

// Create a pool instance with your PostgreSQL connection details
const pool = new Pool(creds);

// Validate that the we can connect to (and work with) the DB
await validateDb();


async function validateDb() {
    const query = `
    SELECT 
    table_name
    FROM 
    information_schema.tables
    WHERE 
    table_schema = 'public'
    AND 
    table_type = 'BASE TABLE';
    `;
    
    console.log(`Connection to DB: Pending`)
    const res = await pool.query(query);
    console.log(`Connection to DB: OK`);

    console.log("Checking DB tables: Pending")
    const dbTables = res.rows.map((item) => item.table_name);
    const expectedDbTables = ["tasks"];
    
    if (!_.isEqual(dbTables, expectedDbTables)) {
        console.log("Unexpected DB tables.\n");
        console.log("got", dbTables);
        console.log("expected", expectedDbTables);
        process.exit(1);
    }
    console.log("Checking DB tables: OK")    
}

// Export the pool for use in your application
export default pool;