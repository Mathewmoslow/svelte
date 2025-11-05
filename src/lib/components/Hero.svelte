<script>
	import { fade } from 'svelte/transition';
</script>

<section class="hero home-hero stand-alone" id="home" data-bg="#0b0b0b">
	<div class="section-separator stand-alone" aria-hidden="true">
		<div class="separator-layer separator-bg"></div>
		<div class="separator-layer separator-mug"></div>
		<div class="separator-layer separator-subject"></div>
	</div>

	<div class="hero-content" transition:fade={{ duration: 600 }}>
		<h1>Stories that refuse to stay on the page.</h1>
		<p>
			Author Mathew Moslow invites you into memoirs scored with original music, thrillers born from
			Jamaican roots and the radical honesty that fuels every chapter.
		</p>
		<div class="hero-actions">
			<a class="book-action" href="/books">Explore the books</a>
			<a class="book-action secondary" href="/soundtrack">Listen to the soundtrack</a>
		</div>
	</div>
</section>
