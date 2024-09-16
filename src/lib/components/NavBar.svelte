<script>
    // Add any logic or links you need here
    let links = [
        { name: 'Home', href: '/' },
        { name: 'About', href: '/about' },
        { name: 'Contact', href: '/contact' }
    ];
</script>

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

<nav>
    <div class="navbar">
        <div class="logo">MyApp</div>
        <div class="menu">
            {#each links as link}
                <a href={link.href}>{link.name}</a>
            {/each}
        </div>
    </div>
</nav>
