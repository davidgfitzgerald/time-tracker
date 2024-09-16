<script>
	import { formatTime } from '$lib/utils/time';
    import { times } from '$lib/stores';
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

{#if $times.error}
    <p>{$times.error}</p>
{:else if $times.tasks.length === 0}
    <p>No tasks found.</p>
{:else}
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Category</th>
                <th>Time Spent</th>
                <th>Timestamp</th>
            </tr>
        </thead>
        <tbody>
            {#each $times.tasks as task}
                <tr>
                    <td>{task.id}</td>
                    <td>{task.category}</td>
                    <td>{formatTime(task.time_spent)}</td>
                    <td>{task.timestamp}</td>
                </tr>
            {/each}
        </tbody>
    </table>
{/if}
