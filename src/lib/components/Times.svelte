<script>
	import { convertUTCToLocal, formatDuration } from '$lib/utils/time';
    import { times } from '$lib/stores';

    let error = $times.error

    times.update(t => {
        t.error = ''
        return t
    })
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
            </tr>
        </thead>
        <tbody>
            {#each $times.tasks as task}
                <tr>
                    <td>{task.id}</td>
                    <td>{task.category}</td>
                    <td>{formatDuration(task.timeSpent)}</td>
                    <td>{convertUTCToLocal(task.start)}</td>
                    <td>{convertUTCToLocal(task.endTime)}</td>
                </tr>
            {/each}
        </tbody>
    </table>
{/if}
