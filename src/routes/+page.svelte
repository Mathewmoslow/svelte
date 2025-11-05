<script>
	import Hero from '$lib/components/Hero.svelte';
	import { books } from '$lib/data/books';
	import { tracks } from '$lib/data/tracks';
	import { fade } from 'svelte/transition';
</script>

<svelte:head>
	<title>Mathew Moslow | Stories with a Soundtrack</title>
	<meta
		name="description"
		content="Experience Mathew Moslow's world of memoir, music and transformation. Read the books, stream the soundtrack and explore the journey."
	/>
</svelte:head>

<Hero />

<section class="home-overview" data-bg="#0b0b0b">
	<div class="overview-container">
		<div class="overview-card" transition:fade={{ duration: 400, delay: 100 }}>
			<h2>Read the story</h2>
			<p>
				Dive into memoir and fiction that explore how love, loss and transformation reshape a life.
				Choose a title and unlock sneak peeks, audio previews and behind-the-scenes notes.
			</p>
			<ul>
				{#each books as book}
					<li>
						<strong>{book.title}</strong>
						<span>{book.subtitle}</span>
					</li>
				{/each}
			</ul>
			<a class="book-action" href="/books">Browse books</a>
		</div>

		<div class="overview-card" transition:fade={{ duration: 400, delay: 200 }}>
			<h2>Press play</h2>
			<p>
				An original soundtrack accompanies the words. Queue up lush pop ballads, late-night jams and
				dirty-sweet outros crafted alongside the writing of <em>A Novel Divorce</em>.
			</p>
			<ul>
				{#each tracks.slice(0, 3) as track}
					<li>
						<strong>{track.title}</strong>
						<span>{track.description}</span>
					</li>
				{/each}
			</ul>
			<a class="book-action secondary" href="/soundtrack">Listen now</a>
		</div>

		<div class="overview-card" transition:fade={{ duration: 400, delay: 300 }}>
			<h2>Meet Mathew</h2>
			<p>
				From Montego Bay to Florida, Mathew maps a transformation rooted in radical honesty. Follow the
				journey, tour the visuals and reach out to keep the conversation going.
			</p>
			<ul>
				<li>
					<strong>Visual journey</strong>
					<span>Gallery moments from the writing desk, jungle retreats and studio sessions.</span>
				</li>
				<li>
					<strong>About Mathew</strong>
					<span>Six touchstones that trace the evolution behind every story.</span>
				</li>
				<li>
					<strong>Contact</strong>
					<span>Send a note, request an appearance or reserve the next release.</span>
				</li>
			</ul>
			<div class="overview-actions">
				<a class="book-action" href="/about">About</a>
				<a class="book-action secondary" href="/gallery">Journey</a>
				<a class="book-action tertiary" href="/contact">Contact</a>
			</div>
		</div>
	</div>
</section>
