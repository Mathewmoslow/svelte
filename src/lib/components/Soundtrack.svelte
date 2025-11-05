<script>
	import { fade } from 'svelte/transition';
	import { tracks } from '$lib/data/tracks';

	let currentTrackId = '';
	let audioPlayer;

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

<section class="soundtrack-section stand-alone" id="soundtrack" data-bg="#101512">
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

		<audio bind:this={audioPlayer} onended={handleEnded} style="display: none;" preload="none"></audio>
	</div>
</section>
