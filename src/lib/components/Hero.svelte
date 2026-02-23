<script>
	import { fade } from 'svelte/transition';
	import { base } from '$app/paths';
</script>

<section class="hero home-hero" id="home" data-bg="#0b0b0b">
	<div class="section-separator" aria-hidden="true">
		<div class="separator-layer separator-bg"></div>
		<div class="separator-layer separator-mug"></div>
		<div class="separator-layer separator-subject"></div>
	</div>

	<div class="hero-content" transition:fade={{ duration: 600 }}>
		<h1><em class="hero-you">You</em> don't have to live through it to learn from it.</h1>
		<p class="hero-subtext">
			<span class="hero-author-line">I have, and here is my story with my take on</span>
			Relationships, Bad decisions and the patterns behind them. Oh, and of course, Divorce.
		</p>
		<div class="hero-actions">
			<a class="book-action" href={`${base}/#books`}>Explore the books</a>
			<a class="book-action secondary" href={`${base}/#soundtrack`}>Listen to the A Novel Divorce soundtrack</a>
		</div>
	</div>
</section>
