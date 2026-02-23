<script>
	import { fade } from 'svelte/transition';
	import { tracks } from '$lib/data/tracks';

	export let standalone = true;

	let currentTrackId = '';
	let audioPlayer;
	let activePlatform = 'spotify';

	const platforms = [
		{ id: 'spotify', label: 'Spotify', icon: '&#9679;', src: 'https://open.spotify.com/embed/artist/01NenrwmvXUVYyRz03WU50?utm_source=generator&theme=0' },
		{ id: 'apple', label: 'Apple Music', icon: '&#9834;', src: 'https://embed.music.apple.com/us/album/feels-like-goodbye-ep/1860117978' },
		{ id: 'youtube', label: 'YouTube Music', icon: '&#9654;', src: 'https://www.youtube.com/embed?listType=playlist&list=OLAK5uy_kJEVF2fwe2dMkBcVFtGuXnLmW4pDHA_Mc&color=white' }
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
		if (audioPlayer) {
			audioPlayer.currentTime = 0;
		}
		currentTrackId = '';
	}
</script>

<section class="soundtrack-section" class:stand-alone={standalone} id="soundtrack" data-bg="#101512">
	<div class="vinyl-decoration vinyl-1" aria-hidden="true"></div>
	<div class="vinyl-decoration vinyl-2" aria-hidden="true"></div>
	<div class="vinyl-decoration vinyl-3" aria-hidden="true"></div>

	<div class="soundtrack-container" transition:fade={{ duration: 400 }}>
		<div class="soundtrack-hero">
			<h2 class="soundtrack-main-title">A Book with a Soundtrack?</h2>
			<h3 class="soundtrack-sub-title">How Novel!</h3>
			<div class="soundtrack-description">
				<div class="soundtrack-columns">
					<div class="soundtrack-panel">
						<p class="soundtrack-intro drop-cap">
							<span class="drop-cap-letter">I</span> didn't only write journal entries during my separation and divorce—I wrote full songs, I wrote poems and turned them into verses.
						</p>
						<p class="soundtrack-intro body-text">
							With the help of some very patient audio engineers, AI and a generous sprinkling of autotune, I took those verses and put them to music, and I sang. I sang and I learned and I made mistakes, and while not perfect, it's an expression of my feelings and this book in another form.
						</p>
					</div>
					<div class="soundtrack-panel">
						<p class="soundtrack-intro confession">
							The bloopers—they're mostly gasps, sighs and sobbing as my voice cracks because this was probably one of the hardest things I have ever had to do.
						</p>
						<p class="soundtrack-intro invitation">Please enjoy this expression of emotion in music form.</p>
					</div>
				</div>
			</div>
		</div>

		<div class="track-collection">
			{#each tracks as track}
				<div class={`track-card ${currentTrackId === track.id ? 'playing' : ''}`}>
					<div class="track-visual">
						<div class="album-cover">
							<img src={track.albumArt} alt={`${track.title} cover`} loading="lazy" />
						</div>
					<div class={`vinyl-record ${currentTrackId === track.id ? 'spinning' : ''}`}>
							<div class="vinyl-label">
								<span class="track-number">{track.number}</span>
							</div>
							<div class="vinyl-grooves"></div>
						</div>
					</div>
					<div class="track-info">
						<h3 class="track-title">{track.title}</h3>
						<p class="track-description">{track.description}</p>
						<button class={`play-btn ${currentTrackId === track.id ? 'playing' : ''}`} type="button" onclick={() => togglePlay(track)}>
							<span class="play-icon">{currentTrackId === track.id && audioPlayer && !audioPlayer.paused ? '⏸' : '▶'}</span>
						</button>
					</div>
				</div>
			{/each}
		</div>

		<div class="streaming-player">
			<h3 class="streaming-title">Stream the full EP</h3>
			<p class="streaming-subtitle">Listen on your preferred platform</p>
			<div class="platform-tabs">
				{#each platforms as platform}
					<button
						type="button"
						class={`platform-tab ${activePlatform === platform.id ? 'active' : ''}`}
						onclick={() => (activePlatform = platform.id)}
					>
						<span class="platform-icon">{@html platform.icon}</span>
						{platform.label}
					</button>
				{/each}
			</div>
			<div class="player-embed">
				{#each platforms as platform}
					{#if activePlatform === platform.id}
						<iframe
							title={`${platform.label} player`}
							src={platform.src}
							width="100%"
							height={platform.id === 'youtube' ? '360' : '352'}
							frameborder="0"
							allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
							loading="lazy"
							style={platform.id === 'apple' ? 'border-radius: 10px;' : 'border-radius: 12px;'}
						></iframe>
					{/if}
				{/each}
			</div>
		</div>

		<audio bind:this={audioPlayer} onended={handleEnded} style="display: none;" preload="none"></audio>
	</div>
</section>
