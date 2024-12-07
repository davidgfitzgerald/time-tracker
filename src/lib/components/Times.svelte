<script>
	import { times } from '$lib/stores.js';
	import { convertUTCToLocal, formatDuration } from '$lib/utils/time';

    let error = $times.error

    // Wipe the error or else we'll keep seeing it
    // TODO Determine if necessary
    // if (error) {
    //     times.update(t => {
    //         t.error = '';
    //         return t;
    //     })
    // }

    /**
    * @param {string | number | null} value
    * @param {(arg0: any) => string} formatter
    * Helper function to handle null or undefined values
    */
    function handleNull(value, formatter) {
        return value == null ? 'TBC' : formatter(value);
    }
</script>

<style>
    table {
        width: 100%;
        border-collapse: collapse;
    }

    th,td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
    }

    th {
        background-color: #f4f4f4;
    }
</style>

<h1>Task List</h1>

<div>
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
				<th>Start Time</th>
				<th>End Time</th>
				<th>Status</th>
			</tr>
		</thead>
		{#each $times.tasks as time}
			<tr>
				<td>{time.id}</td>
				<td>{time.category || "TBC"}</td>
				<td>{handleNull(time.timeSpent, formatDuration)}</td>
				<td>{handleNull(time.startTime, convertUTCToLocal)}</td>
				<td>{handleNull(time.endTime, convertUTCToLocal)}</td>
				<td>{time.status}</td>
			</tr>
		{/each}
	</table>
{/if}
</div>

