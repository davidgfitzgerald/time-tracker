<script>
	const { daysToDisplay, children } = $props();
	const hoursInDay = 24;

	let hours = [];
	for (let i = 0; i < hoursInDay; i++) {
		hours.push(`${i.toString().padStart(2, '0')}:00`);
	}
</script>

<div class="column">
	<div class="header">
		{@render children()}
	</div>
	{#each hours as hour}
		<div class="cell">{hour}</div>
	{/each}
</div>
{#each daysToDisplay as day}
	<div class="column">
		<div class="header">
			{day.toFormat('ccc dd')}
		</div>
		{#each hours}
			<div class="cell"></div>
		{/each}
	</div>
{/each}

<style>
	.header {
		text-align: center;
		justify-content: center;
		border-bottom: 1px solid hsl(0, 0%, 80%);
		height: calc(var(--header-height) * 1px);
		width: calc(var(--header-width) * 1px);
	}

	.column {
		position: relative;
	}

	.cell {
		border-bottom: 1px solid hsl(0, 0%, 80%);
		height: calc(var(--cell-height) * 1px);
		width: calc(var(--cell-width) * 1px);
	}
</style>
