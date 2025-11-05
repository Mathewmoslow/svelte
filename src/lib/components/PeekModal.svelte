<script>
	import { createEventDispatcher } from 'svelte';
	import Modal from './Modal.svelte';

	export let open = false;
	export let book = null;

	const dispatch = createEventDispatcher();

	let pageIndex = 0;

	const chunkSize = 3;

	const chunkParagraphs = (paragraphs = []) => {
		const chunks = [];
		for (let i = 0; i < paragraphs.length; i += chunkSize) {
			chunks.push(paragraphs.slice(i, i + chunkSize));
		}
		return chunks;
	};

	$: pageChunks = book?.peek?.pages ? chunkParagraphs(book.peek.pages) : [];
	$: totalPages = pageChunks.length;
	$: currentChunk = totalPages ? pageChunks[Math.min(pageIndex, totalPages - 1)] : [];

	$: if (!open) {
		pageIndex = 0;
	}

	function close() {
		dispatch('close');
	}

	function next() {
		if (pageIndex < totalPages - 1) {
			pageIndex += 1;
		}
	}

	function prev() {
		if (pageIndex > 0) {
			pageIndex -= 1;
		}
	}
</script>

<Modal open={open} on:close={close} contentClass="peek-modal">
	{#if book}
		<div id="flipbook-container">
			<h2 id="bookTitle">{book.peek?.title ?? book.title} — Sneak Peek</h2>
			<div id="book">
				<div class="page">
					{#each currentChunk as paragraph}
						<p>{paragraph}</p>
					{/each}
				</div>
			</div>
			<div class="flipbook-controls">
				<button class="flipbook-btn" onclick={prev} disabled={pageIndex === 0}>
					← Previous
				</button>
				<span class="page-counter">Page {pageIndex + 1} of {totalPages || 1}</span>
				<button class="flipbook-btn" onclick={next} disabled={pageIndex >= totalPages - 1}>
					Next →
				</button>
			</div>
		</div>
	{:else}
		<p style="color: #e8d5b7; text-align: center;">Preview unavailable.</p>
	{/if}
</Modal>
