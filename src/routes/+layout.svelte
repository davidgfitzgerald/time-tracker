<script>
	import NavBar from "$lib/components/NavBar.svelte";
</script>

<style>
    @import '../app.css';
</style>

<div>
    <NavBar/>
    <div class="content">
        <slot></slot>
    </div>
</div>