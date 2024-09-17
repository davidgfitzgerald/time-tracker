<script>
	import Save from './Save.svelte';
	import { formatDuration, getCurrentTimeUTC } from '$lib/utils/time';
    import { times } from '$lib/stores';

	/**
	 * @type {Save}
	 */
	let Saver; // Reference to the modal component
	let time = 0;
	/**
	 * @type {number | undefined}
	 */
	let interval;
	let isRunning = false;
    let start = '';

	// Function to start or stop the stopwatch
	function toggleStartStop() {
		if (isRunning) {
			clearInterval(interval);
            start = ''
		} else {
			interval = setInterval(() => {
				time += 1;
			}, 1000);
            start = getCurrentTimeUTC()
		}
		isRunning = !isRunning;
	}

	// Function to log the stopwatch
	function log() {
		if (time == 0) {
			console.error('Cannot log 0 time');
		} else {
			Saver.openModal(time, start);
			time = 0;
            start = getCurrentTimeUTC();
		}
	}

	// Function to reset the stopwatch
	function reset() {
		clearInterval(interval);
		time = 0;
		isRunning = false;
        start = ''
	}

	// Function to deleteTasks
	async function clearDB() {
		const res = await fetch('/api/tasks', {
			method: 'DELETE'
		});

		if (res.ok) {
			const result = await res.json();
			console.log('Tasks DB Wiped');

			times.update(() => {
				return {
					tasks: [], // Reset the tasks to empty
					error: ''
				};
			});
			// close();
		} else {
			console.log(res);
			alert('Failed to delete tasks');
		}
	}
</script>

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
        border-radius: 1rem
    }

    .warn-button {
        background-color: rgb(214, 40, 40);
        color: white;
    }
</style>

<div class="stopwatch">
	<h1>{formatDuration(time)}</h1>
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
