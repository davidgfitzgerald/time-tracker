<script>
    import Times from "$lib/components/Times.svelte";
    import Controls from "$lib/components/Controls.svelte";
    import Clock from "$lib/components/Clock.svelte";
    
    import { times } from "$lib/stores.js";

    // The load function in +page.server.js automatically
    // returns data.
    export let data;
    times.set(data)
</script>

<style>
    .title {
        font-size: 2em;
        margin: 20px;
        text-align: center;
    }
</style>

<div class="title">
    <h1>Time Tracker</h1>
</div>

<Clock/>
<Controls/>
<Times/>