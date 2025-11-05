<script>
	export let book;
	export let open = false;

	let audioElement;
	let spinning = false;

	$: if (!open && audioElement) {
		audioElement.pause();
		audioElement.currentTime = 0;
		spinning = false;
	}

	function handlePlay() {
		spinning = true;
	}

	function handlePause() {
		spinning = false;
	}
</script>

{#if open}
	<div class="cassette-container" id={`cassette-${book.id}`}>
		<div class="cassette-tape">
			<div class="cassette-label">
				<h4>{book.audioPreview?.title ?? book.title}</h4>
				<p>{book.audioPreview?.description ?? 'Audio Preview'}</p>
			</div>
			<div class="cassette-reels">
				<div class={`cassette-reel ${spinning ? 'spinning' : ''}`}></div>
				<div class={`cassette-reel ${spinning ? 'spinning' : ''}`}></div>
			</div>
			<div class="cassette-controls">
				<audio
					bind:this={audioElement}
					controls
					preload="none"
					onplay={handlePlay}
					onpause={handlePause}
					onended={handlePause}
				>
					{#if book.audioPreview?.src}
						<source src={book.audioPreview.src} type="audio/mpeg" />
					{/if}
					Your browser does not support the audio element.
				</audio>
			</div>
		</div>
	</div>
{/if}
