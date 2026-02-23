<script>
	import { fade } from 'svelte/transition';
	import bioRaw from '$lib/assets/mathew-bio.txt?raw';
	import { journeyHighlights } from '$lib/data/journey';
	export let standalone = true;

	const paragraphs = bioRaw.replace(/\r\n/g, '\n').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
	const heroStatement = paragraphs[0];
</script>

<section class="hero about-section" class:stand-alone={standalone} id="about" data-bg="#0f0f0f">
	<div class="hero-layer background"></div>
	<div class="hero-layer couch"></div>
	<div class="hero-layer subject"></div>
	<div class="hero-content about-hero-content" transition:fade={{ duration: 400 }}>
		<h2 class="about-hero-title visible">About Mathew Moslow</h2>
		<p class="about-statement">{heroStatement}</p>
	</div>
</section>

<section class="about-section" class:stand-alone={standalone} id="about-content" data-bg="#0f0f0f">
	<div class="about-container">
		<div class="journey-container">
		{#each journeyHighlights as item, index}
			<div
				class={`journey-section-timeline visible ${item.side}`}
				data-animate="timeline"
				transition:fade={{ duration: 350, delay: index * 120 }}
			>
				<div class="section-number visible" data-animate-child="number" data-animate-delay="120">{item.number}</div>
				<div class="section-content">
					<h3 class="section-title">{item.title}</h3>
					<p class="section-location">{item.location}</p>
					<p class="section-description">{item.description}</p>
				</div>
			</div>
		{/each}
		</div>
	</div>
</section>
