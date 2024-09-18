<script>
	import Save from './Save.svelte';
	import { formatDuration, getCurrentTime } from '$lib/utils/time';
	import { times } from '$lib/stores';
	import { onDestroy, onMount } from 'svelte';
	/**
	 * @typedef {import("$lib/stores").Task} Task
	 */


	/**
	 * @type {Save}
	 */
	let Saver; // Reference to the modal component
	let start = '';
	let duration = 0;
	/**
	 * @type {number | undefined}
	 */
	let intervalId;
	let endTime = '';

	/**
	 * @type {Task | undefined}
	 */
	let activeTask;

	/**
	 * @param {string} start
	 */
	function calculateDuration(start) {
		const now = new Date();
		const startDate = new Date(start);
		return Math.floor((now.valueOf() - startDate.valueOf()) / 1000);
	}

	onMount(async () => {
		activeTask = $times.tasks.find((t) => t.status === 'ACTIVE');

		if (activeTask) {
			start = activeTask.start;
		} else {
			start = getCurrentTime();
			activeTask = await Saver.addTask(start);
		}

		duration = calculateDuration(start);
		intervalId = setInterval(() => {
			duration = calculateDuration(start);
		}, 1000);
	});

	onDestroy(() => {
		if (intervalId) {
			clearInterval(intervalId)
		}
	})


	// Function to log the stopwatch
	function log() {
		if (duration == 0) {
			console.error('Frontend: Cannot log 0 time');
		} else {
			endTime = getCurrentTime();
			start = endTime;
			activeTask = $times.tasks.find((t) => t.status === 'ACTIVE');
			Saver.openModal(activeTask?.id, duration, endTime);
			duration = 0;
		}
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
	<button on:click={log}>Log</button>
	<button on:click={clearDB} class="warn-button">Clear DB</button>
</div>

<div class="modal">
	<Save bind:this={Saver} />  
	<!-- TODO see if I can just pass props through the component rather than the method -->
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
