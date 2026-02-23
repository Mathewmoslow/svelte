<script>
	import { isMobile } from '$lib/stores/mobile';
	import Hero from '$lib/components/Hero.svelte';
	import Books from '$lib/components/Books.svelte';
	import Soundtrack from '$lib/components/Soundtrack.svelte';
	import About from '$lib/components/About.svelte';
	import Gallery from '$lib/components/Gallery.svelte';
	import Contact from '$lib/components/Contact.svelte';
	import MobilePage from '$lib/components/MobilePage.svelte';
</script>

<svelte:head>
	<title>Mathew Moslow | Stories with a Soundtrack</title>
	<meta
		name="description"
		content="Experience Mathew Moslow's world of memoir, music and transformation. Read the books, stream the soundtrack and explore the journey."
	/>
</svelte:head>

{#if $isMobile}
	<MobilePage />
{:else}
	<Hero />
	<Books standalone={false} />
	<Soundtrack standalone={false} />
	<About standalone={false} />
	<Gallery standalone={false} />
	<Contact standalone={false} />
{/if}
