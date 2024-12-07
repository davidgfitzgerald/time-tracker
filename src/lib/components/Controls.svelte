<script>
    import { times } from "$lib/stores";

    // Function to deleteTasks
	async function clearDB() {
		const res = await fetch('/api/tasks', {
			method: 'DELETE'
		});

		if (res.ok) {
			const result = await res.json();

			times.update(() => {
				return {
					tasks: [result.task], // Reset the tasks to just a new one
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

	.controls {
		font-size: 2em;
		margin: 20px;
		text-align: center;
	}
</style>

<div class="controls">
	<button on:click={clearDB} class="warn-button">Clear DB</button>
</div>