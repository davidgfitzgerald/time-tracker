<script>
	import Save from './Save.svelte';
	import { formatDuration, getCurrentTimeUTC } from '$lib/utils/time';
	import { times } from '$lib/stores';
	/**
	 * @typedef {import("$lib/stores").Task} Task
	 */

	/**
	 * @type {Save}
	 */
	let Saver; // Reference to the modal component
	let duration = 0;
	/**
	 * @type {number | undefined}
	 */
	let interval;
	let isRunning = false;
	let start = '';
	let endTime = '';
	/**
	 * @type {Task | undefined}
	 */
	let task;

	/**
	 * @returns {Promise<Task | undefined>}
	 */
	async function addTask() {
		// console.log("Frontend: Asking backend to create a task")
		const res = await fetch('/api/tasks', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ start })
		});

		if (res.ok) {
			const result = await res.json();
			const task = result.task;
			// console.log(`Frontend: Task added with ID: ${task.id}`);

			times.update((currentTimes) => {
				return {
					tasks: [...currentTimes.tasks, task], // Append the new task to tasks array
					error: currentTimes.error
				};
			});
			// close();
			return task
		} else {
			console.error(res);
			alert('Failed to add task');
		}
	}

	// Function to start or stop the stopwatch
	async function toggleStartStop() {
		if (isRunning) {
			clearInterval(interval);
			start = '';
		} else {
			interval = setInterval(() => {
				duration += 1;
			}, 1000);
			start = getCurrentTimeUTC();
			task = await addTask();
		}
		isRunning = !isRunning;
	}

	// Function to log the stopwatch
	function log() {
		if (duration == 0) {
			console.error('Frontend: Cannot log 0 time');
		} else {
			endTime = getCurrentTimeUTC();
			Saver.openModal(task?.id, duration, endTime);
			duration = 0;
			start = getCurrentTimeUTC();
		}
	}

	// Function to reset the stopwatch
	function reset() {
		clearInterval(interval);
		duration = 0;
		isRunning = false;
		start = '';
	}

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

<div class="stopwatch">
	<h1>{formatDuration(duration)}</h1>
	<button on:click={toggleStartStop}>
		{isRunning ? 'Stop' : 'Start'}
	</button>
	<button on:click={log}>Log</button>
	<button on:click={reset}>Reset</button>
	<button on:click={clearDB} class="warn-button">Clear DB</button>
</div>

<div class="modal">
	<Save bind:this={Saver} />
</div>

<style>
	.stopwatch {
		font-size: 2em;
		margin: 20px;
		text-align: center;
	}

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
