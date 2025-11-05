<script>
	import { onDestroy, onMount, tick } from 'svelte';
	import { books } from '$lib/data/books';
	import { tracks } from '$lib/data/tracks';
	import { visualJourney } from '$lib/data/visual-journey';

	const featuredBook = books[0];
	const highlightTracks = tracks.slice(0, 3);
	const whispers = [
		{ text: 'What if divorce could be generous?', speed: 0.25 },
		{ text: 'Stories scored with their own soundtrack.', speed: 0.18 },
		{ text: 'Love, loss and the long walk back home.', speed: 0.32 },
		{ text: 'Every chapter starts with radical honesty.', speed: 0.14 }
	];

	let scroller; // element we translate for faux scroll
	let smoothScrollEnabled = false;
	let smoothCleanup;
	let nativeCleanup;
	let resizeCleanup;
	let rafId;
	let currentY = 0;
	let targetY = 0;
	let maxScroll = 0;
	let sectionOffsets = [];
	let shellHeight = 0;
	$: journeyHeight = smoothScrollEnabled ? `${shellHeight}px` : 'auto';

	const lerp = (start, end, factor) => start + (end - start) * factor;
	const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

	function measureSections() {
		if (typeof window === 'undefined' || !scroller) return;
		const previousTransform = scroller.style.transform;
		scroller.style.transform = 'translate3d(0, 0, 0)';
		sectionOffsets = Array.from(scroller.querySelectorAll('[data-section]')).map((section) => {
			const rect = section.getBoundingClientRect();
			const top = rect.top + window.scrollY;
			return { id: section.dataset.section, top, height: rect.height };
		});
		shellHeight = scroller.scrollHeight;
		maxScroll = Math.max(0, shellHeight - window.innerHeight);
		targetY = clamp(targetY, 0, maxScroll);
		scroller.style.transform = previousTransform;
	}

	function getSectionProgress(id) {
		if (typeof window === 'undefined') return 0;
		const info = sectionOffsets.find((entry) => entry.id === id);
		if (!info) return 0;
		const viewport = window.innerHeight || 1;
		const start = info.top - viewport * 0.5;
		const end = info.top + info.height;
		const raw = (currentY - start) / (end - start);
		return clamp(raw, 0, 1);
	}

	function startSmoothScroll() {
		if (!scroller || smoothScrollEnabled) return () => {};
		smoothScrollEnabled = true;
		targetY = window.scrollY;
		currentY = targetY;

		const handleScroll = () => {
			targetY = clamp(window.scrollY || 0, 0, maxScroll);
		};

		window.addEventListener('scroll', handleScroll, { passive: true });
		handleScroll();

		function loop() {
			currentY = lerp(currentY, targetY, 0.08);
			if (Math.abs(targetY - currentY) < 0.1) {
				currentY = targetY;
			}
			scroller.style.transform = `translate3d(0, ${-currentY}px, 0)`;
			rafId = requestAnimationFrame(loop);
		}

		loop();

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}

	function enableNativeScrollFallback() {
		if (nativeCleanup) return nativeCleanup;
		const onScroll = () => {
			currentY = window.scrollY || 0;
		};
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	}

	onMount(async () => {
		await tick();
		measureSections();

		const handleResize = () => measureSections();
		window.addEventListener('resize', handleResize);
		resizeCleanup = () => window.removeEventListener('resize', handleResize);

		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const pointerCoarse = window.matchMedia('(pointer: coarse)').matches;

		if (!prefersReducedMotion && !pointerCoarse) {
			smoothCleanup = startSmoothScroll();
		} else {
			nativeCleanup = enableNativeScrollFallback();
		}
	});

	onDestroy(() => {
		if (smoothScrollEnabled) {
			cancelAnimationFrame(rafId);
			scroller.style.transform = 'translate3d(0, 0, 0)';
		}
		smoothCleanup?.();
		nativeCleanup?.();
		resizeCleanup?.();
});
</script>

<div class="immersive-journey" style={`height: ${journeyHeight}`}>
	<div class="scroll-shell" class:smooth={smoothScrollEnabled} bind:this={scroller}>
		<section class="immersive-hero" data-section="hero">
			<div class="hero-whispers">
				{#each whispers as whisper, index}
					<span
						style={`transform: translate3d(0, ${currentY * whisper.speed}px, 0); opacity: ${0.2 + (index + 1) * 0.1};`}
					>
						{whisper.text}
					</span>
				{/each}
			</div>
			<div class="hero-card">
				<p class="eyebrow">Mathew Moslow</p>
				<h1>Stories that refuse to stay on the page.</h1>
				<p>
					Memoir, music and radical reinvention stitched into a single scroll. Take the long way through the
					books, soundtrack and visual journey so every beat lands with intention.
				</p>
				<div class="hero-actions">
					<a href="/books">Explore the books</a>
					<a class="ghost" href="/soundtrack">Listen to the soundtrack</a>
				</div>
			</div>
		</section>

		<section class="book-focus" data-section="book">
			<div class="book-art" style={`transform: translateY(${getSectionProgress('book') * -40}px);`}>
				<img src={featuredBook.cover} alt={`${featuredBook.title} cover`} loading="lazy" />
			</div>
			<div class="book-copy">
				<p class="eyebrow">{featuredBook.subtitle}</p>
				<h2>{featuredBook.title}</h2>
				{#each featuredBook.synopsis.slice(0, 2) as paragraph}
					<p>{paragraph}</p>
				{/each}
				<div class="button-row">
					<button type="button" onclick={() => (window.location.href = '/books')}>Get My Copy</button>
					<button type="button" class="ghost" onclick={() => (window.location.href = '/soundtrack')}>
						Have a Listen
					</button>
				</div>
			</div>
		</section>

		<section class="soundtrack" data-section="soundtrack">
			<div class="soundtrack-intro">
				<p class="eyebrow">How Novel!</p>
				<h2>I wrote the memoir and then I scored it.</h2>
				<p>
					Full songs, wobbly takes, bloopers and sighs—every track is a chapter we couldn’t fit on the page.
					Scroll slow, queue a song and linger for a beat.
				</p>
			</div>
			<div class="track-grid">
				{#each highlightTracks as track}
					<article
						class="track-card"
						style={`transform: translateY(${(1 - getSectionProgress('soundtrack')) * 40}px); opacity: ${0.4 + getSectionProgress('soundtrack') * 0.6};`}
					>
						<span class="track-number">{track.number}</span>
						<div class="track-body">
							<h3>{track.title}</h3>
							<p>{track.description}</p>
						</div>
					</article>
				{/each}
			</div>
		</section>

		<section class="timeline" data-section="timeline">
			<div class="timeline-rail"></div>
			{#each visualJourney as stop}
				<div class={`timeline-stop ${stop.side}`}>
					<div class="stop-number">{stop.number}</div>
					<div class="stop-media" style={`transform: translateY(${(1 - getSectionProgress('timeline')) * 30}px);`}>
						<img src={stop.image} alt={stop.title} loading="lazy" />
					</div>
					<div class="stop-copy">
						<h3>{stop.title}</h3>
						<p>{stop.description}</p>
					</div>
				</div>
			{/each}
		</section>

		<section class="closing-cta" data-section="cta">
			<p class="eyebrow">What’s next?</p>
			<h2>Reserve the next chapter or send a note.</h2>
			<p>
				Book clubs, soundtrack drops, speaking dates—everything new lands with the list first. Reach out and
				let’s plan the next release together.
			</p>
			<div class="button-row">
				<a href="/contact">Contact Mathew</a>
				<a class="ghost" href="/books">Reserve a Copy</a>
			</div>
		</section>
	</div>
</div>

<style>
	.immersive-journey {
		position: relative;
	}

	.scroll-shell {
		position: relative;
		will-change: transform;
	}

	.scroll-shell.smooth {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		min-height: 100vh;
	}

	section {
		min-height: 100vh;
		padding: clamp(4rem, 8vw, 8rem) clamp(1.5rem, 8vw, 10rem);
		color: #f7f0e3;
	}

	.immersive-hero {
		display: grid;
		place-items: center;
		text-align: center;
		background: radial-gradient(circle at top, rgba(21, 41, 33, 0.8), #050505 70%);
		position: relative;
		overflow: hidden;
	}

	.hero-whispers {
		position: absolute;
		inset: 0;
		font-family: 'Playfair Display', serif;
		font-size: clamp(2rem, 5vw, 4rem);
		color: rgba(125, 170, 142, 0.2);
		pointer-events: none;
	}

	.hero-whispers span {
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		white-space: nowrap;
	}

	.hero-whispers span:nth-child(1) {
		top: 15%;
	}
	.hero-whispers span:nth-child(2) {
		top: 35%;
	}
	.hero-whispers span:nth-child(3) {
		top: 55%;
	}
	.hero-whispers span:nth-child(4) {
		top: 75%;
	}

	.hero-card {
		max-width: 640px;
		backdrop-filter: blur(14px);
		background: rgba(0, 0, 0, 0.55);
		border: 1px solid rgba(247, 240, 227, 0.15);
		padding: clamp(2rem, 4vw, 3rem);
		border-radius: 32px;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.45);
	}

	.eyebrow {
		text-transform: uppercase;
		letter-spacing: 0.2em;
		font-size: 0.85rem;
		color: #b1c8b0;
		margin-bottom: 1rem;
	}

	.hero-card h1 {
		font-size: clamp(2.5rem, 6vw, 4.5rem);
		line-height: 1.1;
		margin-bottom: 1.5rem;
	}

	.hero-card p {
		font-size: 1.1rem;
		line-height: 1.6;
		color: rgba(247, 240, 227, 0.9);
	}

	.hero-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		justify-content: center;
		margin-top: 2rem;
	}

	.hero-actions a,
	.button-row a,
	.button-row button {
		border: 1px solid rgba(124, 168, 138, 0.8);
		padding: 0.85rem 1.8rem;
		border-radius: 999px;
		text-decoration: none;
		color: inherit;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		font-size: 0.85rem;
		background: rgba(124, 168, 138, 0.15);
		transition: background 0.3s ease, color 0.3s ease;
		cursor: pointer;
	}

	.hero-actions a:hover,
	.button-row a:hover,
	.button-row button:hover {
		background: rgba(124, 168, 138, 0.35);
	}

	.book-focus {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
		gap: clamp(2rem, 6vw, 5rem);
		align-items: center;
		background: radial-gradient(circle at 30% 20%, rgba(68, 103, 78, 0.25), transparent 50%),
			linear-gradient(135deg, #050505, #0f0f0f);
	}

	.book-art {
		text-align: center;
	}

	.book-art img {
		width: min(320px, 70%);
		box-shadow: 0 30px 80px rgba(0, 0, 0, 0.5);
		border-radius: 18px;
	}

	.book-copy h2 {
		font-size: clamp(2rem, 4vw, 3.3rem);
		margin-bottom: 1.5rem;
	}

	.book-copy p {
		font-size: 1.05rem;
		color: rgba(247, 240, 227, 0.85);
		line-height: 1.7;
		margin-bottom: 1rem;
	}

	.button-row {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		margin-top: 2rem;
	}

	.button-row .ghost,
	.hero-actions .ghost,
	.button-row button.ghost {
		background: transparent;
		color: rgba(247, 240, 227, 0.85);
	}

	.soundtrack {
		background: radial-gradient(circle at right, rgba(132, 179, 144, 0.25), transparent 55%), #070c09;
	}

	.soundtrack-intro h2 {
		font-size: clamp(2rem, 4vw, 3.5rem);
		margin-bottom: 1rem;
	}

	.track-grid {
		margin-top: 3rem;
		display: grid;
		gap: 1.5rem;
	}

	.track-card {
		padding: 1.5rem;
		border-radius: 24px;
		background: rgba(0, 0, 0, 0.55);
		border: 1px solid rgba(124, 168, 138, 0.2);
		box-shadow: 0 15px 40px rgba(0, 0, 0, 0.35);
		transition: transform 0.4s ease;
	}

	.track-card:hover {
		transform: translateY(-6px);
	}

	.track-number {
		font-family: 'Adventures Unlimited', 'Playfair Display', serif;
		font-size: 1.2rem;
		color: rgba(124, 168, 138, 0.9);
	}

	.track-card h3 {
		margin-top: 0.5rem;
		margin-bottom: 0.5rem;
		font-size: 1.6rem;
	}

	.timeline {
		background: linear-gradient(180deg, #050505 0%, #07100a 100%);
		position: relative;
		padding-block: clamp(6rem, 12vw, 10rem);
	}

	.timeline-rail {
		position: absolute;
		left: 50%;
		top: 5%;
		bottom: 5%;
		width: 2px;
		background: linear-gradient(180deg, rgba(124, 168, 138, 0.2), rgba(124, 168, 138, 0.6));
		transform: translateX(-50%);
	}

	.timeline-stop {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		gap: 2rem;
		align-items: center;
		margin-bottom: clamp(3rem, 8vw, 6rem);
		position: relative;
	}

	.timeline-stop.left {
		padding-right: 20%;
	}

	.timeline-stop.right {
		padding-left: 20%;
	}

	.stop-number {
		font-size: 1.25rem;
		letter-spacing: 0.3em;
		color: rgba(124, 168, 138, 0.6);
	}

	.stop-media img {
		width: 100%;
		border-radius: 24px;
		box-shadow: 0 25px 60px rgba(0, 0, 0, 0.45);
	}

	.stop-copy h3 {
		font-size: 1.8rem;
		margin-bottom: 1rem;
	}

	.stop-copy p {
		color: rgba(247, 240, 227, 0.8);
		line-height: 1.7;
	}

	.closing-cta {
		background: radial-gradient(circle at center, rgba(124, 168, 138, 0.25), rgba(5, 5, 5, 0.95));
		text-align: center;
	}

	.closing-cta h2 {
		font-size: clamp(2.2rem, 4vw, 3.7rem);
		margin-bottom: 1rem;
	}

	.closing-cta p {
		max-width: 720px;
		margin-inline: auto;
		color: rgba(247, 240, 227, 0.85);
		line-height: 1.7;
	}

	@media (max-width: 900px) {
		.hero-actions,
		.button-row {
			justify-content: center;
		}

		.timeline-stop {
			padding: 0;
		}

		.timeline-rail {
			display: none;
		}
	}
</style>
