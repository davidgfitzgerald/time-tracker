<script>
	import NavBar from "$lib/components/NavBar.svelte";
    import { onMount, onDestroy } from "svelte";
    import { times, duration } from "$lib/stores";

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
            duration.set(
                Math.floor((now.valueOf() - startDate.valueOf()) / 1000)
            )
		}
	}
</script>

<style>
    @import '../app.css';
</style>

<div>
    <NavBar/>
    <div class="content">
        <slot></slot>
    </div>
</div>