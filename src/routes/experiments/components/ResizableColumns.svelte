<script>
	let { column1, column2 } = $props();

	let column1Width = $state(300); // Initial width of the first column (in pixels)
	const minWidth = 150; // Minimum width for a column (in pixels)
	const maxWidth = 600; // Maximum width for a column (in pixels)
	let isDragging = $state(false);

	const startDragging = () => isDragging = true
	const stopDragging = () => isDragging = false

	/**
	 * @param {UIEvent} e
	 */
	 const handleMove = (e) => {
		// Prevent default touch actions for better touch behavior
		let clientX;
		if (e instanceof TouchEvent) {
			e.preventDefault();
			clientX = e.touches[0].clientX
		} else if (e instanceof MouseEvent) {
			e.preventDefault();
			clientX = e.clientX
		} else {
			throw new Error(`Unexpected event: ${e.type}`)
		}

		if (isDragging) {
			const newWidth = Math.min(Math.max(clientX, minWidth), maxWidth);
			column1Width = newWidth;
		}
	};
</script>

<svelte:window 
  onmousemove={handleMove} 
  onmouseup={stopDragging}
  ontouchmove={handleMove} 
  ontouchend={stopDragging}
/>

<div class="resizable-container">
	<div class="column" style="width: {column1Width}px">
		{@render column1("Some text")}
	</div>
	<div
		class="divider"
		role="button"
		tabindex="0"
		onmousedown={startDragging}
		onmouseup={stopDragging}
		ontouchstart={startDragging}
		ontouchend={stopDragging}
	></div>
	<div class="column" style="flex: 1">
		{@render column2()}
	</div>
</div>

<style>
	.resizable-container {
		display: flex;
		width: 100%;
		height: 100vh;
	}

	.column {
		height: 100%;
		overflow: auto;
	}

	.divider {
		cursor: ew-resize;
		background-color: #ccc;
		user-select: none;
	}

	@media (max-width: 500px) {
		.divider {
			width: 20px;
		}
	}

	@media (min-width: 500px) {
		.divider {
			width: 5px;
		}
	}

	.divider:hover {
		background-color: #aaa;
	}
</style>
