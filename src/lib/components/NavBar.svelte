<script>
	/**
	 * @typedef {Object} Link
	 * @property {string} name - Name of the link
	 * @property {string} href - The URL the link points to
	 */
	/**
	 * @type {Link[]}
	 */
	let links = [
		// { name: 'Home', href: '/' },
		// { name: 'About', href: '/about' },
		// { name: 'Contact', href: '/contact' }
	];
</script>

<nav>
	<div class="navbar">
		<div class="logo">Time Tracker</div>
		<div class="menu">
			{#each links as link}
				<a href={link.href}>{link.name}</a>
			{/each}
		</div>
	</div>
</nav>

<style>
	nav {
		background-color: #333;
		color: white;
		padding: 1rem;
	}

	.navbar {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.logo {
		font-size: 1.5rem;
		font-weight: bold;
	}

	.menu {
		display: flex;
		gap: 1rem;
	}

	.menu a {
		color: white;
		text-decoration: none;
		padding: 0.5rem 1rem;
		border-radius: 4px;
		transition: background-color 0.3s;
	}

	.menu a:hover {
		background-color: #555;
	}
</style>
