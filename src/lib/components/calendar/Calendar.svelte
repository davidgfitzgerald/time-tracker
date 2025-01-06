<script>
	const { daysToDisplay, clock } = $props();
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
{#each daysToDisplay as day}
	<div>
		<div class="cell header-row">
			{day.toFormat('ccc dd')}
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
		text-align: center
	}
	.header-column {
		
		/* 
		Header column cells have:
		
		- the header col width
		*/
		width: calc(var(--header-col-width) * 1px) !important;
	}

</style>
