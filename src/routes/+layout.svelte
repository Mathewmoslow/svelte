<script>
	import { onDestroy, onMount } from 'svelte';
	import { page } from '$app/stores';
	import { afterNavigate } from '$app/navigation';
	import favicon from '$lib/assets/favicon.svg';
	import { floatingQuotes } from '$lib/data/quotes';

	let menuOpen = false;
	let quotes = [];
	let scrollY = 0;
	let windowHeight = 1;

	const backgrounds = {
		'/': '#0b0b0b',
		'/books': '#0b0b0b',
		'/soundtrack': '#101512',
		'/about': '#0f0f0f',
		'/gallery': '#101512',
		'/contact': '#0b0b0b'
	};

	const colorMap = {
		gold: '232, 213, 183',
		green: '74, 124, 89'
	};

	const duplicatesPerQuote = 4;

	let route = $page.url.pathname;
	let backgroundColor = backgrounds[route] ?? '#0b0b0b';

	$: route = $page.url.pathname;
	$: backgroundColor = backgrounds[route] ?? '#0b0b0b';

	function toggleMenu() {
		menuOpen = !menuOpen;
	}

	function closeMenu() {
		menuOpen = false;
	}

	function handleOverlayKey(event) {
		if (event.key === 'Escape' || event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			closeMenu();
		}
	}

	function updateRouteClass(path) {
		if (typeof document === 'undefined') return;
		const normalized = path === '/' ? 'home' : path.replace(/^\//, '').replace(/\//g, '-');
		document.body.dataset.route = normalized || 'home';
	}

	function randomBetween(min, max) {
		return Math.random() * (max - min) + min;
	}

	function regenerateQuotes() {
		if (typeof document === 'undefined') return;

		const docHeight = Math.max(
			document.body.scrollHeight,
			document.body.offsetHeight,
			document.documentElement.clientHeight,
			document.documentElement.scrollHeight,
			document.documentElement.offsetHeight
		);

		let id = 0;
		quotes = floatingQuotes.flatMap((text) => {
			return Array.from({ length: duplicatesPerQuote }, () => {
				const depth = Math.random();
				const baseOpacity = 0.08 + depth * 0.35;
				const color = Math.random() < 0.5 ? 'gold' : 'green';
				const blur = Math.max(0, 3 - depth * 2.5);
				return {
					id: `${text}-${id++}`,
					text,
					top: randomBetween(0, docHeight * 0.9),
					left: randomBetween(5, 95),
					rotation: randomBetween(-8, 8),
					speed: 0.03 + depth * 0.15,
					baseOpacity,
					fontSize: 0.6 + depth * 3.4,
					color,
					blur: blur > 0.5 ? blur : 0
				};
			});
		});
	}

	function handleScroll() {
		scrollY = window.scrollY || 0;
	}

	function handleResize() {
		windowHeight = window.innerHeight || 1;
	}

	onMount(() => {
		windowHeight = window.innerHeight || 1;
		regenerateQuotes();
		handleScroll();

		window.addEventListener('scroll', handleScroll, { passive: true });
		window.addEventListener('resize', handleResize);

		updateRouteClass(route);

		afterNavigate(({ to }) => {
			if (!to) return;
			updateRouteClass(to.url.pathname);
			closeMenu();
			regenerateQuotes();
			handleScroll();
		});

		return () => {
			window.removeEventListener('scroll', handleScroll);
			window.removeEventListener('resize', handleResize);
		};
	});

	onDestroy(() => {
		if (typeof document !== 'undefined') {
			delete document.body.dataset.route;
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div id="stage-bg" aria-hidden="true" style={`background: ${backgroundColor}`}></div>
<div id="hero-overlay" aria-hidden="true"></div>

<div class="quote-layer" aria-hidden="true">
	{#each quotes as quote (quote.id)}
		{@const fade = Math.min(1, (scrollY / windowHeight) * 1.8)}
		{@const opacity = Math.min(1, fade * quote.baseOpacity)}
		<div
			class="floating-quote"
			style={`top: ${quote.top}px; left: ${quote.left}%; transform: translateY(${-scrollY * quote.speed}px) rotate(${quote.rotation}deg); opacity: ${opacity}; font-size: ${quote.fontSize}rem; color: rgba(${colorMap[quote.color]}, ${opacity}); ${quote.blur ? `filter: blur(${quote.blur}px);` : ''}`}
		>
			{quote.text}
		</div>
	{/each}
</div>

<header class="header" data-menu-open={menuOpen}>
	<nav class="nav-container">
		<a href="/" class="logo" onclick={closeMenu}>Mathew Moslow</a>
		<button class="hamburger" class:active={menuOpen} onclick={toggleMenu} aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={menuOpen}>
			<span></span>
			<span></span>
			<span></span>
		</button>
		<ul class="nav-links" class:active={menuOpen} id="navLinks">
			<li>
				<a href="/books" class:active={route?.startsWith('/books')} onclick={closeMenu}>Books</a>
			</li>
			<li>
				<a href="/soundtrack" class:active={route?.startsWith('/soundtrack')} onclick={closeMenu}>Soundtrack</a>
			</li>
			<li>
				<a href="/about" class:active={route?.startsWith('/about')} onclick={closeMenu}>About</a>
			</li>
			<li>
				<a href="/gallery" class:active={route?.startsWith('/gallery')} onclick={closeMenu}>Journey</a>
			</li>
			<li>
				<a href="/contact" class:active={route?.startsWith('/contact')} onclick={closeMenu}>Contact</a>
			</li>
		</ul>
	</nav>
</header>

<div
	class="nav-overlay"
	class:active={menuOpen}
	onclick={closeMenu}
	onkeydown={handleOverlayKey}
	role="button"
	tabindex={menuOpen ? '0' : '-1'}
	aria-hidden={!menuOpen}
></div>

<main class="page-shell">
	<slot />
</main>
