<script>
	import { DateTime } from 'luxon';

	/** 
	 * @type {{ 
	 * 	daysToDisplay: DateTime[],
	 * 	clock: any,
	 * 	leftArrow: any,
	 * 	rightArrow: any,
	 * }} */
	let { daysToDisplay, clock, leftArrow, rightArrow } = $props();

	const daysWithSnippets = $derived(
		daysToDisplay.map((day, index) => {
			let snippet = null;
			if (index == 0) {
				snippet = 'left'
			} else if (index == daysToDisplay.length - 1) {
				snippet = 'right'
			}
			return {day, snippet}
		})
	)
	const hoursInDay = 24;

	let hours = [];
	for (let i = 0; i < hoursInDay; i++) {
		hours.push(`${i.toString().padStart(2, '0')}:00`);
	}
</script>

<div>
	<div class="cell header-column header-row">
		{@render clock()}
	</div>
	{#each hours as hour}
		<div class="cell header-column">{hour}</div>
	{/each}
</div>
{#each daysWithSnippets as {day, snippet}}
	<div>
		<div class="cell header-row">
			<div>
				{day.toFormat('ccc dd')}
			</div>
				{#if snippet == "left"}
					{@render leftArrow()}
				{:else if snippet == "right"}
					{@render rightArrow()}
				{/if}
		</div>
		{#each hours}
			<div class="cell"></div>
		{/each}
	</div>
{/each}

<style>
	.cell {
		/*
		All cells have: 
	
		- a bottom border
		- a default height and width
		*/
		border-bottom: 1px solid hsl(0, 0%, 80%);
		box-sizing: border-box;
		width: calc(var(--cell-width) * 1px);
		height: calc(var(--cell-height) * 1px);
	}

	.header-row {
		/* 
		Header row cells have:
		
		- the header row height
		- the text aligned to the center
		*/
		height: calc(var(--header-row-height) * 1px) !important;
		text-align: center;
	}
	.header-column {
		/* 
		Header column cells have:
		
		- the header col width
		*/
		width: calc(var(--header-col-width) * 1px) !important;
	}
</style>
