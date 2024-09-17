import { readFileSync } from 'fs';
import { resolve } from 'path';


/**
 * @param {string} filePath
 */
export function read(filePath) {
    // Load contents from a file
    return readFileSync(resolve(filePath), 'utf-8');
}