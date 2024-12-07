<script>
    import { times } from "$lib/stores";
	import { formatDuration, getCurrentTime } from "$lib/utils/time";
	import { onDestroy, onMount } from "svelte";

    let duration = 0;
	let modalOpen = false;
	let category = '';

    /**
     * @type {import("$lib/stores").Task | undefined}
     */
    let activeTask;
    
    /**
     * @type {number | NodeJS.Timeout | undefined}
     */
	 let intervalId;

	/** 
	 * @type {import('svelte/store').Unsubscriber | undefined} 
	 * */
	let unsubscribe;

	onMount(async () => {
		/**
		 * Start two approaches of repeatedly updating 
		 * the clock display.
		 * 
		 * Firstly, the interval updates the clock
		 * every second.
		 * 
		 * Secondly, observed changes in the times store
		 * immediately update the clock.
		*/
		intervalId = setInterval(() => {
			updateDuration()
		}, 1000)

		unsubscribe = times.subscribe(()=> {
			updateDuration()
		})
	});

	onDestroy(() => {
		/**
		 * Teardown both the interval and times
		 * store subscriber initialised in onMount.
		*/
		if (intervalId) {
			clearInterval(intervalId)
		}
		if (unsubscribe) {
			unsubscribe();
		}
	})

	function updateDuration() {
		activeTask = $times.tasks.find((t) => t.status == 'ACTIVE');
		if (activeTask) {
			const now = new Date();
			const startDate = new Date(activeTask.startTime);
			duration = Math.floor((now.valueOf() - startDate.valueOf()) / 1000);
		}
	}

	/**
	 * Function to log the stopwatch
	 */
	function openModal() {
		if (duration == 0) {
			console.error('Frontend: Cannot log 0 time');
			return
		} 
		
		modalOpen = true
	}
	
	async function updateTask() {
		activeTask = $times.tasks.find((t) => t.status === 'ACTIVE');
		if (!activeTask) {
			alert("Please try again.")
			console.error("Active task expected but not found")
			return
		}
		let endTime = getCurrentTime();
		const id = activeTask.id
		const timeSpent = duration

		const res = await fetch('/api/tasks', {
			method: 'PUT',
			headers: {'Content-Type': 'application/json'}, // TODO confirm whether header required or provided by default
			body: JSON.stringify({ id, category, timeSpent, endTime }),
		});

		if (res.ok) {
			const { tasks: { updated: updatedTask, new: newTask } } = await res.json();

			times.update((current) => {
				let newTasks = current.tasks.map((task) => {
						if (task.id === id) {
							return {
								...task,
								...updatedTask // Merge current with new properties
							};
						}
						// Return unchanged task if ID's don't match
						return task;
					})
				newTasks.push(newTask)
				return {
					tasks: newTasks,
					error: current.error
				};
			})
		} else {
			console.log(res);  // TODO debugging only
			alert("Failed to add task");
		}
		modalOpen = false;
	}

	/**
	 * Function to deleteTasks
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

<div class="controls">
	<button on:click={openModal}>Log</button>
	<button on:click={clearDB} class="warn-button">Clear DB</button>
</div>

{#if modalOpen}
<div class="modal-background">
	<div class="modal-content" on:click|stopPropagation>
		<h2>Track Time</h2>
		<p>You are about to track {formatDuration(duration)}.</p>

		<form on:submit|preventDefault={updateTask}>
			<label>
				Task Category:
				<input type="text" bind:value={category} required />
			</label>

			<!-- <label>
				<input type="number" bind:value={duration} min="1" required hidden />
			</label> -->

			<button class="add-task" type="submit">Add Task</button>
		</form>
	</div>
</div>
{/if}