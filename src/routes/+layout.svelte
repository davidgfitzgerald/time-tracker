<script>
	import NavBar from "$lib/components/NavBar.svelte";

    let userPassword = '';
    let isLoggedIn = false;

    let actualPassword = import.meta.env.VITE_APP_PASSWORD
    let offlineMode = actualPassword === undefined
    console.log(`Offline mode? ${offlineMode}`)

    function login() {
        if (userPassword === import.meta.env.VITE_APP_PASSWORD) {
        isLoggedIn = true;
        } else {
        alert("Incorrect password");
        }
    }
</script>

<style>
    @import '../app.css';
</style>


{#if !isLoggedIn && !offlineMode}
<input type="password" bind:value={userPassword} placeholder="Enter password" />
<button on:click={login}>Login</button>
{/if}

{#if isLoggedIn || offlineMode}
<div>
    <NavBar/>
    <div class="content">
        <slot></slot>
    </div>
</div>
{/if}
