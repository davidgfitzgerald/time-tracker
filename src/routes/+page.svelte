<script>
    import Stopwatch from "$lib/components/Stopwatch.svelte";
    import Times from "$lib/components/Times.svelte";
    export let data;

    import { times } from "$lib/stores.js";
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

<Stopwatch/>
<Times/>