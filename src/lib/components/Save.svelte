<script>
	import { formatTime } from '$lib/utils/time';
	import { writable } from 'svelte/store';
  import { times } from '$lib/stores';

	export let isOpen = writable(false);

  let time = 0
	let category = '';

	/**
	 * @param {number} incomingTime
	 */
	export function openModal(incomingTime) {
		isOpen.set(true);
    time = incomingTime
	}

	function close() {
		isOpen.set(false);
    time = 0
	}

	async function submitTask() {
		const res = await fetch('/api/tasks', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ category, time_spent: time })
		});

		if (res.ok) {
			const result = await res.json();
			const task = result.task;
			console.log(`Task added with ID: ${task.id}`);

      times.update((currentTimes) => {
        return {
            tasks: [...currentTimes.tasks, task], // Append the new task to tasks array
            error: currentTimes.error
        };
    });
			close();
		} else {
      console.log(res);
			alert('Failed to add task');
		}
	}

</script>

<!-- Modal HTML -->
{#if $isOpen}
	<div class="modal-background" on:click={close}>
		<div class="modal-content" on:click|stopPropagation>
			<h2>Track Time</h2>
			<p>You are about to track {formatTime(time)}.</p>
			<!-- <button class="close-btn" on:click={closeModal}>Save</button> -->

			<form on:submit|preventDefault={submitTask}>
				<label>
					Task Category:
					<input type="text" bind:value={category} required />
				</label>

				<label>
					<input type="number" bind:value={time} min="1" required hidden />
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
