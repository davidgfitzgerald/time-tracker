<script>
	import { formatDuration, getCurrentTime } from '$lib/utils/time';
	import { writable } from 'svelte/store';
	import { times } from '$lib/stores';

	export let isOpen = writable(false);

	let timeSpent = 0;
	let endTime = ''; // Timestamp in 'YYYY-MM-DD HH:MM:SS' format.
	let category = '';
	/**
	 * @type {number | undefined} taskId
	 */
	let taskId;


	/**
	 * @returns {Promise<import("$lib/stores").Task | undefined>}
	 * @param {string} startTime
	 */
	export async function addTask(startTime) {
		// console.log("Frontend: Asking backend to create a task")
		const res = await fetch('/api/tasks', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ start: startTime })
		});

		if (res.ok) {
			const result = await res.json();
			const task = result.task;
			console.log(`Frontend: Task added with ID: ${task.id}`);

			times.update((currentTimes) => {
				return {
					tasks: [...currentTimes.tasks, task], // Append the new task to tasks array
					error: currentTimes.error
				};
			});
			// close();
			return task;
		} else {
			console.error(res);
			alert('Failed to add task');
		}
	}

	/**
	 * @param {number | undefined} incomingTaskId
	 * @param {number} duration
	 * @param {string} incomingEndTime
	 */
	export function openModal(incomingTaskId, duration, incomingEndTime) {
    if (!incomingTaskId) {
      console.error("Couldn't open modal because incomingTaskId is not defined.")
      return
    }
		isOpen.set(true);
		taskId = incomingTaskId;
		timeSpent = duration;
		endTime = incomingEndTime;
	}

	/**
	 * @param {string} newStartTime
	 */
	async function closeModal(newStartTime) {
    await addTask(newStartTime)
		isOpen.set(false);
		timeSpent = 0;
		endTime = '';
	}

	async function updateTask() {
		// console.log(`Frontend: Updating task with ID: ${taskId}`);
		const res = await fetch('/api/tasks', {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ taskId, category, timeSpent, endTime })
		});
    // console.log(`Frontend: res is ${JSON.stringify(res)}`)

		if (res.ok) {
			const result = await res.json();
      // console.log(`Frontend: result is ${JSON.stringify(result)}`)
			const updatedTask = result.task;
			// console.log(`Frontend: Task updated with ID: ${updatedTask.id}`);

			times.update((currentTimes) => {
				return {
					tasks: currentTimes.tasks.map((task) => {
						if (task.id === taskId) {
							// Return a new task object with updated properties
							return {
								...task,
								...updatedTask // Assuming updatedTask contains the new properties
							};
						}
						// Return the task unchanged if ID doesn't match
						return task;
					}),
					error: currentTimes.error
				};
			});
			await closeModal(endTime);
		} else {
			console.log(res);
			alert('Failed to add task');
		}
	}
</script>

<!-- Modal HTML -->
{#if $isOpen}
	<div class="modal-background">
		<div class="modal-content" on:click|stopPropagation>
			<h2>Track Time</h2>
			<p>You are about to track {formatDuration(timeSpent)}.</p>

			<form on:submit|preventDefault={updateTask}>
				<label>
					Task Category:
					<input type="text" bind:value={category} required />
				</label>

				<label>
					<input type="number" bind:value={timeSpent} min="1" required hidden />
				</label>

				<button class="add-task" type="submit">Add Task</button>
			</form>
		</div>
	</div>
{/if}

<style>
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
