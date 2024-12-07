<script>
    import { times } from "$lib/stores";

    // Function to deleteTasks
	async function clearDB() {
		const res = await fetch('/api/tasks', {
			method: 'DELETE'
		});

		if (res.ok) {
			const result = await res.json();
			console.log('Frontend: Tasks DB Wiped');

			times.update(() => {
				return {
					tasks: [], // Reset the tasks to empty
					error: ''
				};
			});
		} else {
			console.log(res);
			alert('Failed to delete tasks');
		}
	}
</script>

<style>
	button {
		margin: 10px;
		padding: 10px 20px;
		font-size: 1em;
		cursor: pointer;
		border: 1px;
		border-radius: 1rem;
	}

	.warn-button {
		background-color: rgb(214, 40, 40);
		color: white;
	}
</style>

<div class="stopwatch">
	<button on:click={clearDB} class="warn-button">Clear DB</button>
</div>