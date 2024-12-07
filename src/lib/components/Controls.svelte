<script>
	import { times, duration } from '$lib/stores';
	import { formatDuration } from '$lib/utils/time';

	let modalOpen = false;
	let category = '';

	/**
	 * @type {import("$lib/stores").Task | undefined}
	 */
	let activeTask;

	/**
	 * Function to log the stopwatch
	 */
	function openModal() {
		if ($duration == 0) {
			console.error('Frontend: Cannot log 0 time');
			return;
		}
		modalOpen = true;
	}

	async function updateTask() {
		activeTask = $times.tasks.find((t) => t.status === 'ACTIVE');
		if (!activeTask) {
			alert('Please try again.');
			console.error('Active task expected but not found');
			return;
		}
		const id = activeTask.id;
		const timeSpent = $duration;

		try {
			const res = await fetch('/api/tasks', {
				method: 'PUT',
				body: JSON.stringify({ id, category, timeSpent })
			});
			if (res.ok) {
				const { updatedTask, newTask } = await res.json();
				updateTaskStore(updatedTask, newTask);
			} else {
				alert('Failed to add task');
			}
		} catch (error) {
			console.error(error);
		}

		modalOpen = false;
	}

	/**
	 * @param {import("$lib/stores").Task} updatedTask
	 * @param {import("$lib/stores").Task} newTask
	 */
	function updateTaskStore(updatedTask, newTask) {
		times.update((current) => {
			let newTasks = current.tasks.map((task) => {
				if (task.id === updatedTask.id) {
					return {
						...task,
						...updatedTask // Merge current with new properties
					};
				}
				// Return unchanged task if ID's don't match
				return task;
			});
			newTasks.push(newTask);
			return {
				tasks: newTasks,
				error: current.error
			};
		});
	}

	/**
	 * Function to delete tasks
	 */
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

<div class="controls">
	<button on:click={openModal}>Log</button>
	<button on:click={clearDB} class="warn-button">Clear DB</button>
</div>

{#if modalOpen}
	<div class="modal-background">
		<div class="modal-content" on:click|stopPropagation>
			<h2>Track Time</h2>
			<p>You are about to track {formatDuration($duration)}.</p>

			<form on:submit|preventDefault={updateTask}>
				<label>
					Task Category:
					<input type="text" bind:value={category} required />
				</label>

				<!-- <label>
				<input type="number" bind:value={$duration} min="1" required hidden />
			</label> -->

				<button class="add-task" type="submit">Add Task</button>
			</form>
		</div>
	</div>
{/if}

<style>
	/* Buttons */
	button {
		margin: 10px;
		padding: 10px 20px;
		font-size: 1em;
		cursor: pointer;
		border: 1px;
		border-radius: 1rem;
	}

	/* Warning buttons */
	.warn-button {
		background-color: rgb(214, 40, 40);
		color: white;
	}

	/* Controls container */
	.controls {
		font-size: 2em;
		margin: 20px;
		text-align: center;
	}

	/* Modal background */
	.modal-background {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
	}

	/* Modal content */
	.modal-content {
		background-color: white;
		padding: 20px;
		border-radius: 5px;
		max-width: 500px;
		width: 100%;
	}
	/* Close button */
	.add-task {
		cursor: pointer;
		background-color: #0ccf61;
		color: white;
		border: none;
		padding: 5px 10px;
		margin-left: auto;
		border-radius: 3px;
	}
</style>
