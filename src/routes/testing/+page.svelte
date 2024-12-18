<h1>Testing</h1>

<div class="container">
	<div class="centered">Text One</div>
	<div class="centered">Text Two</div>
</div>

<style>
	.container {
		display: flex;
		gap: 1rem;
	}
	.centered {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 200px;
		width: 200px;
		border: 1px solid black;
	}

	.container:hover .centered {
		cursor: pointer;
		transition: all 0.1s ease;
		border: 15px solid lightgrey;
		box-sizing: border-box;
	}
</style>
