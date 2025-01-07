import fs from 'fs';
import pkg from 'pg'; // Import the default export from the pg package

// Destructure Pool from the default export
const { Pool } = pkg;

for (const name of ['POSTGRES_PORT', 'POSTGRES_USER', 'POSTGRES_HOST', 'POSTGRES_PASSWORD', 'POSTGRES_DB']) {
	if (process.env[name] === undefined) {
		throw new Error(`${name} is undefined/empty. Check .env file?`)
	}
}

const port = process.env.POSTGRES_PORT ? parseInt(process.env.POSTGRES_PORT) : NaN;
const user = process.env.POSTGRES_USER
const host = process.env.POSTGRES_HOST
const database = process.env.POSTGRES_DB
const password = process.env.POSTGRES_PASSWORD

console.log('\nDatabase Connection:');
console.log('    port', port);
console.log('    user', user);
console.log('    host', host);
console.log('    database', database, '\n');

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
		ca: fs.readFileSync('src/db/us-west-2-bundle.pem').toString()
	}
};

// If we run docker locally then we do not need AWS SSL config
const LOCAL_DEV = process.env.LOCAL_DEV ? process.env.LOCAL_DEV : false;
console.log('    LOCAL_DEV', LOCAL_DEV, '\n');
if (LOCAL_DEV) {
	delete DB_CREDS.ssl;
}

// Create a pool instance with your PostgreSQL connection details
const POOL = new Pool(DB_CREDS);

// Export the pool for use in your application
export default POOL;
