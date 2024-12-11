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

<div class="container">
	<table>
		<thead>
			<tr>
				<th>Category</th>
				<th>Time Spent</th>
				<th>Start Time</th>
				<th>End Time</th>
			</tr>
		</thead>
		<tbody>
			{#each $times.tasks as time}
				<tr>
					<td data-cell="category">{time.category || 'TBC'}</td>
					<td data-cell="timeSpent">{handleNull(time.timeSpent, formatDuration)}</td>
					<td data-cell="startTime">{handleNull(time.startTime, convertUTCToLocal)}</td>
					<td data-cell="endTime">{handleNull(time.endTime, convertUTCToLocal)}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	.container {
		max-width: 100%;
		overflow-x: auto;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.9em;
		box-shadow: 5px 5px 5px rgb(92, 92, 92);
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
	}

	th:first-child {
		border-top-left-radius: 10px;
	}

	th:last-child {
		border-top-right-radius: 10px;
	}

	th,
	td {
		padding: 0.5rem;
		text-align: left;
	}

	th {
		background-color: #333;
		color: white;

	}
	table tbody tr {
		border-bottom: 1px solid #dddddd;
	}

	table tbody tr:nth-of-type(even) {
		background-color: hsl(0 0% 0% / 0.05)
	}

	table tbody tr:last-of-type {
		border-bottom: 2px solid #cccdcd;
	}
</style>
