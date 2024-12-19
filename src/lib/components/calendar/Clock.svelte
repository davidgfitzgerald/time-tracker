<script>
	import { formatDuration } from '$lib/utils/time';
	import { times, duration } from '$lib/stores';
	import ClearX from '../tiny/ClearX.svelte';
	let modalOpen = $state(false);
	let category = $state('');

	/**
	 * @type {import("$lib/stores").Task | undefined}
	 */
	let activeTask;

	/**
	 * Toggle the modal.
	 */
	function toggleModal() {
		modalOpen = !modalOpen;
	}

	function clearInput() {
		category = '';
	}

	/**
	 * Function to log the stopwatch
	 */
	async function updateTask() {
		activeTask = $times.tasks?.find((t) => t.status === 'ACTIVE');
		if (!activeTask) {
			alert('Please try again.');
			console.error('Active task expected but not found');
			return;
		}
		try {
			const res = await fetch(`/api/tasks/${activeTask.id}`, {
				method: 'PUT',
				body: JSON.stringify({ category })
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

		category = ''; // Disable pre-population next time
		toggleModal(); // Close the time log modal
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
</script>

<div class="stopwatch">
	<button class="submit button" onclick={toggleModal}>{formatDuration($duration)}</button>
</div>

<!-- TODO add aria a11y stuff -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
{#if modalOpen}
	<div class="modal-background" onclick={toggleModal}>
		<div class="modal-content" onclick={(e) => e.stopPropagation()}>
			<p>You are about to track {formatDuration($duration)}.</p>
			<form
				onsubmit={(e) => {
					e.preventDefault();
					updateTask();
				}}
			>
				<div class="category">
					<div>
						<input type="text" placeholder="Category" bind:value={category} required />
						{#if category}
							<ClearX func={clearInput}></ClearX>
						{/if}
					</div>
				</div>
				<button class="add-task button" type="submit">Add Task</button>
			</form>
		</div>
	</div>
{/if}

<style>
	.stopwatch {
		width: 100%;
		height: 75%;
	}

	/* Button applies both in and out of the modal. */
	.button {
		font-size: 1rem;
		cursor: pointer;
		width: 100%;
		height: 100%;
		border: 1px solid rgb(42, 185, 66);
		border-radius: 5px;
		box-shadow: 1px 1px 1px rgb(70, 194, 91);
		transform: translate3d(0, 0, 0); /* Hack to fix poor box-shadow rendering on iOS*/
	}

	.submit {
		background-color: rgb(53, 226, 79);
		color: white;
		width: 100%;
		height: 100%;
	}

	.modal-background {
		z-index: 999;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 20px; /* Make modal at least 20px away from edge of screen */
		box-sizing: border-box;
	}

	.modal-content {
		background-color: white;
		padding: 50px;
		border-radius: 5px;
		max-width: 500px;
		width: 100%;
	}

	.add-task {
		cursor: pointer;
		background-color: #0ccf61;
		color: white;
		border: none;
		padding: 5px 10px;
		margin-left: auto;
		border-radius: 3px;
		min-height: 3rem;
		font-size: 1.5rem;
	}

	.category {
		padding-bottom: 20px;
		position: relative;
	}

	.category input {
		min-height: 50px;
		width: 100%;
		box-sizing: border-box;
		padding-left: 10px; /* Adds 10px space between text and left boundary */

	}
</style>
