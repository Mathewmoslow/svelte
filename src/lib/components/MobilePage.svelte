<script>
	import { onMount } from 'svelte';
	import { base } from '$app/paths';
	import { books } from '$lib/data/books';
	import { tracks } from '$lib/data/tracks';
	import { journeyHighlights } from '$lib/data/journey';
	import { visualJourney } from '$lib/data/visual-journey';
	import bioRaw from '$lib/assets/mathew-bio.txt?raw';

	const bio = bioRaw.replace(/\r\n/g, '\n').split(/\n\s*\n/).map(p => p.trim()).filter(Boolean)[0];

	let audioPlayer;
	let currentTrackId = '';
	let activePlatform = 'spotify';

	const platforms = [
		{ id: 'spotify', label: 'Spotify', src: 'https://open.spotify.com/embed/artist/01NenrwmvXUVYyRz03WU50?utm_source=generator&theme=0' },
		{ id: 'apple', label: 'Apple', src: 'https://embed.music.apple.com/us/album/feels-like-goodbye-ep/1860117978' },
		{ id: 'youtube', label: 'YouTube', src: 'https://www.youtube.com/embed?listType=playlist&list=OLAK5uy_kJEVF2fwe2dMkBcVFtGuXnLmW4pDHA_Mc&color=white' }
	];

	function togglePlay(track) {
		if (!audioPlayer) return;
		if (currentTrackId === track.id && !audioPlayer.paused) {
			audioPlayer.pause();
			audioPlayer.currentTime = 0;
			currentTrackId = '';
			return;
		}
		audioPlayer.src = track.src;
		audioPlayer.play();
		currentTrackId = track.id;
	}

	function handleEnded() {
		if (audioPlayer) audioPlayer.currentTime = 0;
		currentTrackId = '';
	}

	// Contact form
	let name = '';
	let email = '';
	let subject = '';
	let message = '';
	let loading = false;
	let success = false;
	let error = '';

	async function handleSubmit(event) {
		event.preventDefault();
		loading = true;
		error = '';
		try {
			const response = await fetch('/api/contact', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ type: 'contact', name, email, subject, message })
			});
			if (!response.ok) throw new Error('Unable to send your message.');
			success = true;
		} catch (err) {
			error = err.message || 'Something went wrong.';
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		window.scrollTo(0, 0);
	});
</script>

<div class="m-page">

	<!-- HERO -->
	<div class="m-screen m-hero" id="home">
		<div class="m-hero-bg" aria-hidden="true"></div>
		<div class="m-hero-content">
			<h1><em class="m-you">You</em> don't have to live through it to learn from it.</h1>
			<p class="m-hero-sub">I have, and here is my story with my take on Relationships, Bad decisions and the patterns behind them. Oh, and of course, Divorce.</p>
			<a class="m-btn" href="#books">Explore the books</a>
			<a class="m-btn m-ghost" href="#soundtrack">Listen to the soundtrack</a>
		</div>
	</div>

	<!-- BOOKS -->
	{#each books as book, i}
		<div class="m-screen m-book" id={i === 0 ? 'books' : `book-${i}`}>
			<img class="m-book-cover" src={book.cover} alt={book.title} loading="lazy" />
			<h2 class="m-book-title">{book.title}</h2>
			<p class="m-book-sub">{book.subtitle}</p>
			<p class="m-book-blurb">{@html book.synopsis[0]}</p>
			<div class="m-book-actions">
				{#if book.cta?.primary?.href}
					<a class="m-btn" href={book.cta.primary.href} target="_blank" rel="noreferrer">{book.cta.primary.label}</a>
				{:else if book.cta?.primary?.action === 'reserve'}
					<a class="m-btn" href="#contact">{book.cta.primary.label}</a>
				{/if}
				{#if book.cta?.secondary}
					<a class="m-btn m-ghost" href={book.cta.primary.href || '#'} target="_blank" rel="noreferrer">{book.cta.secondary.label}</a>
				{/if}
			</div>
		</div>
	{/each}

	<!-- SOUNDTRACK -->
	<div class="m-screen m-soundtrack" id="soundtrack">
		<h2 class="m-section-title">The Soundtrack</h2>
		<div class="m-track-list">
			{#each tracks as track}
				<button class="m-track" type="button" onclick={() => togglePlay(track)}>
					<img class="m-track-art" src={track.albumArt} alt={track.title} loading="lazy" />
					<div class="m-track-info">
						<span class="m-track-name">{track.title}</span>
						<span class="m-track-desc">{track.description}</span>
					</div>
					<span class="m-track-play">{currentTrackId === track.id && audioPlayer && !audioPlayer.paused ? '⏸' : '▶'}</span>
				</button>
			{/each}
		</div>
	</div>

	<!-- STREAMING -->
	<div class="m-screen m-streaming">
		<h2 class="m-section-title">Stream the EP</h2>
		<div class="m-platform-tabs">
			{#each platforms as p}
				<button
					class="m-platform-tab"
					class:active={activePlatform === p.id}
					type="button"
					onclick={() => (activePlatform = p.id)}
				>{p.label}</button>
			{/each}
		</div>
		<div class="m-embed">
			{#each platforms as p}
				{#if activePlatform === p.id}
					<iframe
						title={`${p.label} player`}
						src={p.src}
						width="100%"
						height="352"
						frameborder="0"
						allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
						loading="lazy"
					></iframe>
				{/if}
			{/each}
		</div>
	</div>

	<!-- ABOUT -->
	<div class="m-screen m-about" id="about">
		<div class="m-about-photo" aria-hidden="true"></div>
		<div class="m-about-text">
			<h2 class="m-section-title">About Mathew</h2>
			<p class="m-about-bio">{bio}</p>
		</div>
	</div>

	<!-- JOURNEY HIGHLIGHTS (scrollable single screen) -->
	<div class="m-screen m-journey-scroll" id="about-content">
		<h2 class="m-section-title">The Story So Far</h2>
		<div class="m-journey-list">
			{#each journeyHighlights as item}
				<div class="m-journey-card">
					<span class="m-journey-num">{item.number}</span>
					<h3 class="m-journey-title">{item.title}</h3>
					<span class="m-journey-loc">{item.location}</span>
					<p class="m-journey-desc">{item.description}</p>
				</div>
			{/each}
		</div>
	</div>

	<!-- VISUAL JOURNEY -->
	{#each visualJourney as stop, j}
		<div class="m-screen m-visual-stop" id={j === 0 ? 'visual-journey' : undefined}>
			<img class="m-visual-img" src={stop.image} alt={stop.title} loading="lazy" />
			<span class="m-journey-num">{stop.number}</span>
			<h3 class="m-journey-title">{stop.title}</h3>
			<p class="m-journey-desc">{stop.description}</p>
		</div>
	{/each}

	<!-- CONTACT -->
	<div class="m-screen m-contact" id="contact">
		<h2 class="m-section-title">Get in Touch</h2>
		{#if success}
			<p class="m-success">Thank you! Your message is on its way.</p>
		{:else}
			<form class="m-form" onsubmit={handleSubmit}>
				<input type="text" placeholder="Name" bind:value={name} required />
				<input type="email" placeholder="Email" bind:value={email} required />
				<input type="text" placeholder="Subject" bind:value={subject} required />
				<textarea placeholder="Message" rows="4" bind:value={message} required></textarea>
				{#if error}<p class="m-error">{error}</p>{/if}
				<button class="m-btn m-submit" type="submit" disabled={loading}>
					{loading ? 'Sending…' : 'Send Message'}
				</button>
			</form>
		{/if}
	</div>

	<audio bind:this={audioPlayer} onended={handleEnded} style="display:none;" preload="none"></audio>
</div>

<style>
	/* ── Reset: this component owns every pixel ── */
	.m-page {
		position: fixed;
		inset: 0;
		overflow-y: auto;
		scroll-snap-type: y mandatory;
		-webkit-overflow-scrolling: touch;
		background: #0b0b0b;
		color: #f7f0e3;
		font-family: 'EB Garamond', 'Garamond', Georgia, serif;
		z-index: 10;
	}

	/* ── Each screen = one full viewport ── */
	.m-screen {
		min-height: 100dvh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		text-align: center;
		padding: 60px 24px 32px;
		box-sizing: border-box;
		scroll-snap-align: start;
		scroll-snap-stop: always;
	}

	/* ── HERO ── */
	.m-hero {
		position: relative;
		overflow: hidden;
	}

	.m-hero-bg {
		position: absolute;
		inset: 0;
		background: url('/images/separator-subject.png') center/cover no-repeat,
		            url('/images/separator-mug.png') center/cover no-repeat,
		            url('/images/separator-bg.png') center/cover no-repeat;
		z-index: 0;
	}

	.m-hero-bg::after {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.65) 60%, rgba(11,11,11,1) 100%);
	}

	.m-hero-content {
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}

	.m-hero h1 {
		font-size: 2rem;
		line-height: 1.15;
		margin: 0 0 16px;
		font-family: 'Playfair Display', 'EB Garamond', serif;
		text-shadow: 0 2px 12px rgba(0,0,0,0.5);
	}

	.m-you {
		text-decoration: underline;
		text-decoration-color: rgba(124, 168, 138, 0.6);
		text-underline-offset: 4px;
		font-style: normal;
	}

	.m-hero-sub {
		font-size: 0.95rem;
		line-height: 1.5;
		color: rgba(247, 240, 227, 0.75);
		margin: 0 0 24px;
		max-width: 340px;
	}

	/* ── Buttons ── */
	.m-btn {
		display: block;
		width: 100%;
		max-width: 300px;
		padding: 14px 20px;
		border: 1px solid rgba(124, 168, 138, 0.6);
		border-radius: 999px;
		background: rgba(124, 168, 138, 0.15);
		color: #f7f0e3;
		text-decoration: none;
		text-align: center;
		font-size: 0.9rem;
		letter-spacing: 0.05em;
		margin-bottom: 10px;
		-webkit-tap-highlight-color: transparent;
	}

	.m-btn.m-ghost {
		background: transparent;
		color: rgba(247, 240, 227, 0.7);
	}

	/* ── BOOKS ── */
	.m-book {
		background: #0b0b0b;
		gap: 0;
	}

	.m-book-cover {
		width: 55%;
		max-width: 220px;
		height: auto;
		border-radius: 12px;
		box-shadow: 0 16px 48px rgba(0, 0, 0, 0.6);
		margin-bottom: 16px;
	}

	.m-book-title {
		font-size: 1.5rem;
		margin: 0 0 4px;
		font-family: 'Playfair Display', 'EB Garamond', serif;
		color: #e8d5b7;
	}

	.m-book-sub {
		font-size: 0.7rem;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		color: rgba(247, 240, 227, 0.5);
		margin: 0 0 12px;
	}

	.m-book-blurb {
		font-size: 0.85rem;
		line-height: 1.55;
		color: rgba(247, 240, 227, 0.7);
		margin: 0 0 16px;
		display: -webkit-box;
		-webkit-line-clamp: 5;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.m-book-actions {
		width: 100%;
		max-width: 300px;
	}

	/* ── SOUNDTRACK ── */
	.m-soundtrack {
		background: #070c09;
		padding-top: 60px;
		padding-bottom: 24px;
		overflow-y: auto;
		justify-content: flex-start;
	}

	.m-section-title {
		font-size: 1.4rem;
		font-family: 'Playfair Display', 'EB Garamond', serif;
		color: #e8d5b7;
		margin: 0 0 16px;
	}

	.m-track-list {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.m-track {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 10px 0;
		border: none;
		background: none;
		color: #f7f0e3;
		text-align: left;
		cursor: pointer;
		border-bottom: 1px solid rgba(255, 255, 255, 0.06);
		-webkit-tap-highlight-color: transparent;
		font-family: inherit;
	}

	.m-track-art {
		width: 48px;
		height: 48px;
		border-radius: 6px;
		object-fit: cover;
		flex-shrink: 0;
	}

	.m-track-info {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.m-track-name {
		font-size: 0.95rem;
		font-weight: 600;
	}

	.m-track-desc {
		font-size: 0.75rem;
		color: rgba(247, 240, 227, 0.45);
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
		line-height: 1.4;
	}

	.m-track-play {
		width: 36px;
		height: 36px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(74, 124, 89, 0.3);
		border-radius: 50%;
		font-size: 0.85rem;
		flex-shrink: 0;
	}

	/* ── STREAMING ── */
	.m-streaming {
		background: #070c09;
		justify-content: flex-start;
		padding-top: 60px;
	}

	.m-platform-tabs {
		display: flex;
		gap: 8px;
		margin-bottom: 16px;
	}

	.m-platform-tab {
		padding: 8px 16px;
		border: 1px solid rgba(124, 168, 138, 0.3);
		border-radius: 999px;
		background: transparent;
		color: rgba(247, 240, 227, 0.6);
		font-size: 0.8rem;
		cursor: pointer;
		font-family: inherit;
		-webkit-tap-highlight-color: transparent;
	}

	.m-platform-tab.active {
		background: rgba(124, 168, 138, 0.2);
		color: #f7f0e3;
		border-color: rgba(124, 168, 138, 0.6);
	}

	.m-embed {
		width: 100%;
		border-radius: 12px;
		overflow: hidden;
	}

	.m-embed iframe {
		border-radius: 12px;
	}

	/* ── ABOUT ── */
	.m-about {
		position: relative;
		overflow: hidden;
		padding: 0 !important;
	}

	.m-about-photo {
		position: absolute;
		inset: 0;
		background: url('/images/subject.png') center top/cover no-repeat;
		z-index: 0;
	}

	.m-about-photo::after {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(0deg, rgba(11,11,11,0.95) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 100%);
	}

	.m-about-text {
		position: relative;
		z-index: 1;
		padding: 60px 24px 32px;
		margin-top: auto;
	}

	.m-about-bio {
		font-size: 0.9rem;
		line-height: 1.6;
		color: rgba(247, 240, 227, 0.85);
		max-width: 340px;
		text-shadow: 0 1px 8px rgba(0,0,0,0.4);
	}

	/* ── JOURNEY HIGHLIGHTS (scrollable list) ── */
	.m-journey-scroll {
		background: #0f0f0f;
		justify-content: flex-start;
		padding-top: 60px;
		overflow-y: auto;
	}

	.m-journey-list {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	.m-journey-card {
		text-align: center;
		padding-bottom: 24px;
		border-bottom: 1px solid rgba(255, 255, 255, 0.06);
	}

	.m-journey-card:last-child {
		border-bottom: none;
	}

	.m-journey-num {
		font-size: 1rem;
		color: rgba(124, 168, 138, 0.6);
		letter-spacing: 0.2em;
		display: block;
		margin-bottom: 6px;
	}

	.m-journey-title {
		font-size: 1.2rem;
		font-family: 'Playfair Display', 'EB Garamond', serif;
		margin: 0 0 4px;
		color: #e8d5b7;
	}

	.m-journey-loc {
		font-size: 0.6rem;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: rgba(247, 240, 227, 0.35);
		display: block;
		margin-bottom: 8px;
	}

	.m-journey-desc {
		font-size: 0.85rem;
		line-height: 1.55;
		color: rgba(247, 240, 227, 0.65);
		max-width: 340px;
		margin: 0 auto;
	}

	/* ── VISUAL JOURNEY (with images) ── */
	.m-visual-stop {
		background: #0a0f0c;
		gap: 0;
	}

	.m-visual-img {
		width: 85%;
		max-width: 300px;
		height: auto;
		border-radius: 16px;
		box-shadow: 0 12px 36px rgba(0, 0, 0, 0.5);
		margin-bottom: 16px;
		object-fit: cover;
	}

	/* ── CONTACT ── */
	.m-contact {
		background: #0b0b0b;
		justify-content: flex-start;
		padding-top: 80px;
	}

	.m-form {
		width: 100%;
		max-width: 360px;
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.m-form input,
	.m-form textarea {
		width: 100%;
		padding: 14px 16px;
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 10px;
		background: rgba(255, 255, 255, 0.04);
		color: #f7f0e3;
		font-size: 16px; /* prevents iOS zoom */
		font-family: inherit;
		box-sizing: border-box;
		outline: none;
	}

	.m-form input:focus,
	.m-form textarea:focus {
		border-color: rgba(124, 168, 138, 0.5);
	}

	.m-form textarea {
		resize: none;
	}

	.m-submit {
		margin-top: 4px;
		font-weight: 600;
	}

	.m-submit:disabled {
		opacity: 0.5;
	}

	.m-success {
		color: #4a7c59;
		font-size: 1rem;
	}

	.m-error {
		color: #d96a6a;
		font-size: 0.85rem;
		margin: 0;
	}
</style>
