<script>
	import { times } from '$lib/stores.js';
	import { convertUTCToLocal, formatDuration } from '$lib/utils/time';

	/**
	 * @param {string | number | null} value
	 * @param {(arg0: any) => string} formatter
	 * Helper function to handle null or undefined values
	 */
	function handleNull(value, formatter) {
		return value == null ? 'TBC' : formatter(value);
	}
</script>

<h1>Task List</h1>

<table>
	<tr>
		<th>ID</th>
		<th>Category</th>
		<th>Time Spent</th>
		<th>Start Time</th>
		<th>End Time</th>
	</tr>
	{#each $times.tasks as time}
		<tr>
			<td>{time.id}</td>
			<td>{time.category || 'TBC'}</td>
			<td>{handleNull(time.timeSpent, formatDuration)}</td>
			<td>{handleNull(time.startTime, convertUTCToLocal)}</td>
			<td>{handleNull(time.endTime, convertUTCToLocal)}</td>
		</tr>
	{/each}
</table>

<style>
	table {
		width: 100%;
		overflow-x: auto;
		border-collapse: collapse;
	}

	th,
	td {
		border: 1px solid #ddd;
		padding: 8px;
		text-align: left;
	}

	th {
		background-color: #f4f4f4;
	}
</style>
