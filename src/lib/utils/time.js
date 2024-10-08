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
 * Get the current time in 'YYYY-MM-DD HH:MM:SS' format.
 * 
 * @returns {string} - The current time in the specified format.
 */
export function getCurrentTime() {
    const date = new Date();

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
 * Convert a UTC date/time string to local time.
 * 
 * @param {string} utcDateStr - The UTC date/time string in 'YYYY-MM-DD HH:MM:SS' format.
 * @returns {string} - The local date/time string in 'YYYY-MM-DD HH:MM:SS' format.
 */
export function convertUTCToLocal(utcDateStr) {
    const date = new Date(utcDateStr)
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    const local = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`

    return local;
}
