<script>
	import { convertUTCToLocal, formatDuration } from '$lib/utils/time';
    import { times } from '$lib/stores';

    let error = $times.error

    times.update(t => {
        t.error = ''
        return t
    })

    // Helper function to handle null or undefined values
    /**
	 * @param {string | number | null} value
	 * @param {(arg0: any) => string} formatter
	 */
    function formatValue(value, formatter) {
        return value != null ? formatter(value) : '';
    }
</script>

<style>
    table {
        width: 100%;
        border-collapse: collapse;
    }
    
    th, td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
    }
    
    th {
        background-color: #f4f4f4;
    }
</style>

<h1>Task List</h1>

{#if error}
    <p>{error}</p>
{:else if $times.tasks.length === 0}
    <p>No tasks found.</p>
{:else}
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Category</th>
                <th>Time Spent</th>
                <th>Start</th>
                <th>End</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            {#each $times.tasks as task}
                <tr>
                    <td>{task.id}</td>
                    <td>{task.category || null}</td>
                    <td>{formatValue(task.timeSpent, formatDuration)}</td>
                    <td>{formatValue(task.start, convertUTCToLocal)}</td>
                    <td>{formatValue(task.endTime, convertUTCToLocal)}</td>
                    <td>{task.status}</td>
                </tr>
            {/each}
        </tbody>
    </table>
{/if}
