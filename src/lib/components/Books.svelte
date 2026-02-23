<script>
	import { fade } from 'svelte/transition';
	import CassettePlayer from './CassettePlayer.svelte';
	import PeekModal from './PeekModal.svelte';
	import ReserveModal from './ReserveModal.svelte';
	import { books } from '$lib/data/books';

	export let standalone = true;

	let activeCassette = '';
	let cassetteAutoplayToken = 0;
	let peekBook = null;
	let reserveOpen = false;
	let reserveBookTitle = '';

	function toggleCassette(bookId) {
		const nextCassette = activeCassette === bookId ? '' : bookId;
		activeCassette = nextCassette;
		if (nextCassette) {
			cassetteAutoplayToken += 1;
		}
	}

	function openPeek(book) {
		peekBook = book;
	}

	function openReserve(title) {
		reserveBookTitle = title;
		reserveOpen = true;
	}
</script>

<section class="books-section" class:stand-alone={standalone} id="books" data-bg="#0b0b0b">
	<div class="books-container">
		<h2 class="section-title visible" data-animate="title">Books</h2>

		{#each books as book, index (book.id)}
			{@const isLeft = index % 2 === 0}
			<div class={`book-section-timeline visible ${isLeft ? 'left' : 'right'}`} data-animate="timeline">
				<div class="book-content-area" transition:fade={{ duration: 300, delay: index * 150 }}>
					{#if isLeft}
						<div class="book-cover-wrapper visible" data-animate-child="cover">
							<img src={book.cover} alt={`${book.title} Book Cover`} loading="lazy" />
						</div>
					{/if}

					<div class="book-content">
						<h3 class="book-title">{book.title}</h3>
						<p class="book-subtitle">{book.subtitle}</p>
						<div class="book-synopsis">
							{#each book.synopsis as paragraph}
								<p>{@html paragraph}</p>
							{/each}
						</div>
						<div class="book-meta">
							{#if book.cta?.primary?.href}
								<a class="book-action" href={book.cta.primary.href} rel="noreferrer">{book.cta.primary.label}</a>
							{:else if book.cta?.primary?.action === 'reserve'}
								<button type="button" class="book-action" onclick={() => openReserve(book.title)}>
									{book.cta.primary.label}
								</button>
							{/if}
							{#if book.cta?.secondary}
								<button
									type="button"
									class="book-action secondary"
									onclick={() => openPeek(book)}
								>
									{book.cta.secondary.label}
								</button>
							{/if}
							{#if book.cta?.tertiary}
								<button
									type="button"
									class="book-action tertiary"
									onclick={() => toggleCassette(book.id)}
								>
									{book.cta.tertiary.label}
								</button>
							{/if}
						</div>

						<CassettePlayer
							book={book}
							open={activeCassette === book.id}
							autoplayKey={activeCassette === book.id ? cassetteAutoplayToken : 0}
						/>
					</div>

					{#if !isLeft}
						<div class="book-cover-wrapper visible" data-animate-child="cover">
							<img src={book.cover} alt={`${book.title} Book Cover`} loading="lazy" />
						</div>
					{/if}
				</div>
			</div>
		{/each}
	</div>
</section>

<PeekModal open={Boolean(peekBook)} book={peekBook} on:close={() => (peekBook = null)} />
<ReserveModal open={reserveOpen} bookTitle={reserveBookTitle} on:close={() => (reserveOpen = false)} />
