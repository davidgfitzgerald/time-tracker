<script>
	import HoverConnect from "./components/HoverConnect.svelte";
	import Viewport from "./components/Viewport.svelte";
	import ResizableColumns from "./components/ResizableColumns.svelte";
</script>

<h1>Testing</h1>

<p>The following are just random components placed here as experiments.</p>

<HoverConnect></HoverConnect>
<Viewport></Viewport>

<ResizableColumns>
	{#snippet column1(text)}
		<span>Col1: {text}</span>
	{/snippet}
	{#snippet column2(text)}
		<span>Col2: {text}</span>
	{/snippet}
</ResizableColumns>