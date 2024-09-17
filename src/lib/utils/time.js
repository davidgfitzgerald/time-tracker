// Function to format the time (hh:mm:ss)
/**
 * @param {number} time
 */
export function formatDuration(time) {
    const hours = String(Math.floor(time / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((time % 3600) / 60)).padStart(2, '0');
    const seconds = String(time % 60).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}


/**
 * Get the current time in 'YYYY-MM-DD HH:MM:SS' format (UTC).
 * 
 * @returns {string} - The current time in the specified format.
 */
export function getCurrentTimeUTC() {
    const now = new Date();
    
    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(now.getUTCDate()).padStart(2, '0');
    const hours = String(now.getUTCHours()).padStart(2, '0');
    const minutes = String(now.getUTCMinutes()).padStart(2, '0');
    const seconds = String(now.getUTCSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * Convert a UTC date/time string to local time.
 * 
 * @param {string} utcDateStr - The UTC date/time string in 'YYYY-MM-DD HH:MM:SS' format.
 * @returns {string} - The local date/time string in 'YYYY-MM-DD HH:MM:SS' format.
 */
export function convertUTCToLocal(utcDateStr) {
    const date = parseUTCDate(utcDateStr)
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    const local = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`

    return local;
}

/**
 * @param {string} utcDateStr - e.g 2024-09-17T18:00:00.000Z or 2024-09-17T18:00:00.000
 * @returns {Date} - Date object
 */
export function parseUTCDate(utcDateStr) {
    if (!utcDateStr.endsWith("Z")) {
        utcDateStr += 'Z'
    }
    return new Date(Date.parse(utcDateStr));
}