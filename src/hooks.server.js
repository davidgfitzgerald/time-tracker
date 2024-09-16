// src/hooks.server.js
import { initializeDB } from '$lib/db/init.js';

// TODO find better way to handle this

// This function is called every time the server handles a request.
export async function handle({ event, resolve }) {
    // Initialize the database if it's not already initialized
    await initializeDB();

    // Continue with the rest of the request handling
    const response = await resolve(event);
    return response;
}
