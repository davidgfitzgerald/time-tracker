<script>
	import { DateTime } from 'luxon';
	const now = DateTime.now();
	
	const numDays = 30;
	
	let dates = [];
	for (let i = 0; i < numDays; i++) {
		let dayPrior = now.minus({ days: i }).toISODate();
		dates.push(dayPrior);
	}
	const observer = new IntersectionObserver((entries) => {
		console.log(entries)
	})
	
    /**
	 * @type {HTMLUListElement}
	 */
    let ULElement;

    $effect(()=> {
		// const halfWay = (ULElement.scrollWidth - ULElement.clientWidth) / 2
		// ULElement.scrollBy({left: halfWay, behavior: 'smooth'})
		observer.observe()
    })
</script>

<h1>Test</h1>
<ul class="horizontal-squares" bind:this={ULElement}>
	{#each dates as date}
		<li>{date}</li>
	{/each}
</ul>

<style>
	/* ul {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 10px;
        padding: 0;
        list-style-type: none;
    }
    li {
        border: 1px solid #000;
        padding: 10px;
        height: 7rem;
        width: 7rem;
    } */

	/* Single-row horizontal squares list with scrollbar */
	.horizontal-squares {
		display: flex;
		overflow-x: auto; /* Enable horizontal scrolling */
		overflow-y: hidden; /* Hide vertical scrollbar */
		gap: 10px; /* Space between items */
		padding: 10px; /* Padding to prevent item clipping */
		list-style-type: none;
		scroll-snap-type: x mandatory; /* Smooth scrolling behavior */
		-webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
		scrollbar-width: thin; /* Thin scrollbar for Firefox */
		scrollbar-color: #888 #f1f1f1; /* Scrollbar color */
		background-color: #f0f0f0; /* Light background to distinguish the scrollable area */
	}

	/* Individual square styling */
	.horizontal-squares li {
		flex: 0 0 auto; /* Prevent items from growing or shrinking */
		width: 150px; /* Fixed width for each square */
		height: 150px; /* Fixed height for each square */
		scroll-snap-align: center; /* Snap items to center when scrolling */

		display: flex;
		align-items: center;
		justify-content: center;

		background-color: #3498db;
		color: white;
		text-align: center;

		transition:
			transform 0.3s ease,
			background-color 0.3s ease;
	}

	/* Hover effect */
	.horizontal-squares li:hover {
		transform: scale(1.05);
		background-color: #2980b9;
		cursor: pointer;
	}

	/* Custom scrollbar for WebKit browsers (Chrome, Safari) */
	.horizontal-squares::-webkit-scrollbar {
		height: 10px; /* Horizontal scrollbar height */
	}

	.horizontal-squares::-webkit-scrollbar-track {
		background: #f1f1f1;
	}

	.horizontal-squares::-webkit-scrollbar-thumb {
		background: #888;
		border-radius: 5px;
	}

	.horizontal-squares::-webkit-scrollbar-thumb:hover {
		background: #555;
	}
</style>
