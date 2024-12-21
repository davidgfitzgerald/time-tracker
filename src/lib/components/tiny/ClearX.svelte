<script>
	/**
	 * @type {{
	 * 	func: (() => void)
	 * }}
	 */
	const { func } = $props();
</script>

<button class="clear-btn" onclick={func} aria-label="Clear input">×</button>

<style>
	.clear-btn {
		position: absolute;
        top: 50%;
		transform: translateY(-100%);
        right: 10px;

		width: 20px;
		height: 20px;
		border-radius: 100%; /* Makes it circular */
		display: flex;
		align-items: center; /* Vertically centers content */
		justify-content: center; /* Horizontally centers content */
		background-color: #f0f0f0; /* Optional background color */
		font-size: 14px; /* Adjust font size as needed */
		/* font-weight: bold; Optional for styling */
		color: inherit; 
        border: none;
	}

	.clear-btn:hover {
		cursor: pointer;
		filter: brightness(95%);
	}
</style>
