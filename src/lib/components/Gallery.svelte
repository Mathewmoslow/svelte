<script>
	import { fade } from 'svelte/transition';
	import { visualJourney } from '$lib/data/visual-journey';
	export let standalone = true;
</script>

<section class="journey-section" class:stand-alone={standalone} id="visual-journey" data-bg="#101512">
	<div class="journey-container">
		<h2 class="section-title visible" data-animate="title" transition:fade={{ duration: 400 }}>The Visual Journey</h2>

		{#each visualJourney as stop, index}
			<div
				class={`journey-section-timeline visible ${stop.side}`}
				data-animate="timeline"
				transition:fade={{ duration: 350, delay: index * 120 }}
			>
				<div class="journey-number" data-animate-child="number" data-animate-delay="120">{stop.number}</div>
				<div class="journey-content-area">
					{#if stop.side === 'left'}
						<div class="journey-image-wrapper">
							<img src={stop.image} alt={`${stop.title} visual`} loading="lazy" />
						</div>
						<div class="journey-content">
							<h3 class="journey-title">{stop.title}</h3>
							<p class="section-description">{stop.description}</p>
						</div>
					{:else}
						<div class="journey-content">
							<h3 class="journey-title">{stop.title}</h3>
							<p class="section-description">{stop.description}</p>
						</div>
						<div class="journey-image-wrapper">
							<img src={stop.image} alt={`${stop.title} visual`} loading="lazy" />
						</div>
					{/if}
				</div>
			</div>
		{/each}
	</div>
</section>
