<script>
	import { onDestroy, onMount } from 'svelte';
	import { base } from '$app/paths';
import { page } from '$app/stores';
import { afterNavigate } from '$app/navigation';
import favicon from '$lib/assets/favicon.svg';
import { floatingQuotes } from '$lib/data/quotes';
import { heavyScroll } from '$lib/actions/heavyScroll';

let menuOpen = false;
let quotes = [];
let scrollY = 0;
let windowHeight = 1;
let cleanupEnhancements;

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

	function setupEnhancements() {
		if (typeof window === 'undefined') return () => {};

		const htmlEl = document.documentElement;
		const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
		const prefersReducedMotion = reduceMotionQuery.matches;

		if (prefersReducedMotion) {
			htmlEl.classList.add('no-anim');
			return () => {};
		}

		htmlEl.classList.remove('no-anim');

		const stage = document.getElementById('stage-bg');
		const heroOverlay = document.getElementById('hero-overlay');
		const panels = Array.from(document.querySelectorAll('section[id]'));
		const heroLayers = Array.from(document.querySelectorAll('.section-separator .separator-layer'));
		const bookSections = Array.from(document.querySelectorAll('.book-section-timeline'));
		const animatedNodes = Array.from(document.querySelectorAll('[data-animate]'));

		panels.forEach((panel) => panel.setAttribute('data-soft-panel', ''));

		const resetChildVisibility = (node) => {
			if (node.dataset.animate === 'timeline') {
				node.querySelectorAll('[data-animate-child]').forEach((child) => {
					child.classList.remove('visible');
				});
			}
		};

		animatedNodes.forEach((node) => {
			node.classList.remove('visible');
			resetChildVisibility(node);
		});

		const addVisibleClass = (node, delay = 0) => {
			if (!node) return;
			if (delay > 0) {
				setTimeout(() => node.classList.add('visible'), delay);
			} else {
				node.classList.add('visible');
			}
		};

		const revealObserver = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (!entry.isIntersecting) return;

					const target = entry.target;
					const delay = Number(target.dataset.animateDelay || 0);

					addVisibleClass(target, delay);

					if (target.dataset.animate === 'timeline') {
						target.querySelectorAll('[data-animate-child]').forEach((child) => {
							const childDelay = Number(child.dataset.animateDelay || 0);
							addVisibleClass(child, childDelay);
						});
					}

					revealObserver.unobserve(target);
				});
			},
			{
				threshold: 0.25,
				rootMargin: '0px 0px -100px 0px'
			}
		);

		animatedNodes.forEach((node) => revealObserver.observe(node));

		const getPanelColor = (panel) =>
			panel?.getAttribute('data-bg') || window.getComputedStyle(panel).backgroundColor || '#0b0b0b';

		if (panels[0] && stage) {
			stage.style.backgroundColor = getPanelColor(panels[0]);
		}

		const backgroundObserver = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (!entry.isIntersecting) return;
					if (!stage) return;
					stage.style.backgroundColor = getPanelColor(entry.target);
				});
			},
			{
				threshold: 0.45,
				rootMargin: '0px 0px -20% 0px'
			}
		);

		panels.forEach((panel) => backgroundObserver.observe(panel));

		let rafId;
		const HEAVY_FACTOR = 0.25;

		const applyScrollEffects = () => {
			const actualScroll = window.scrollY || 0;
			const viewportHeight = window.innerHeight || 1;

			const perceivedScroll = actualScroll * HEAVY_FACTOR;

			heroLayers.forEach((layer, index) => {
				const speed = 0.35 + index * 0.2;
				layer.style.transform = `translate3d(0, ${perceivedScroll * speed}px, 0)`;
			});

			if (heroOverlay) {
			const intensity = Math.min(perceivedScroll / (viewportHeight * 0.85), 1);
			heroOverlay.style.background = `rgba(0, 0, 0, ${0.15 * intensity})`;
			}

			bookSections.forEach((section, index) => {
				const rect = section.getBoundingClientRect();
				if (rect.bottom < 0 || rect.top > viewportHeight) {
					section.style.transform = '';
					return;
				}
				const pressure = index % 2 === 0 ? 0.15 : -0.15;
				const offset = (viewportHeight - rect.top) * pressure * HEAVY_FACTOR;
				section.style.transform = `translateY(${offset}px)`;
			});

			rafId = requestAnimationFrame(applyScrollEffects);
		};

		const requestUpdate = () => {
			cancelAnimationFrame(rafId);
			rafId = requestAnimationFrame(applyScrollEffects);
		};

		rafId = requestAnimationFrame(applyScrollEffects);

		window.addEventListener('scroll', requestUpdate, { passive: true });
		window.addEventListener('resize', requestUpdate);

		const handleReduceMotionChange = (event) => {
			if (event.matches) {
				revealObserver.disconnect();
				backgroundObserver.disconnect();
				window.removeEventListener('scroll', handleMotion);
				window.removeEventListener('resize', handleMotion);
			}
		};

		reduceMotionQuery.addEventListener('change', handleReduceMotionChange);

		return () => {
			revealObserver.disconnect();
			backgroundObserver.disconnect();
			window.removeEventListener('scroll', requestUpdate);
			window.removeEventListener('resize', requestUpdate);
			reduceMotionQuery.removeEventListener('change', handleReduceMotionChange);
			cancelAnimationFrame(rafId);
			bookSections.forEach((section) => {
				section.style.transform = '';
			});
			heroLayers.forEach((layer) => {
				layer.style.transform = '';
			});
			if (heroOverlay) {
				heroOverlay.style.background = 'rgba(0, 0, 0, 0)';
			}
		};
	}

	onMount(() => {
		// Scroll to top on initial load (prevents mobile landing mid-page)
		if (!window.location.hash) {
			window.scrollTo(0, 0);
		}

		windowHeight = window.innerHeight || 1;
		regenerateQuotes();
		handleScroll();

		window.addEventListener('scroll', handleScroll, { passive: true });
		window.addEventListener('resize', handleResize);

		cleanupEnhancements = setupEnhancements();

		updateRouteClass(route);

		afterNavigate(({ to }) => {
			if (!to) return;
			updateRouteClass(to.url.pathname);
			closeMenu();
			regenerateQuotes();
			handleScroll();
			cleanupEnhancements?.();
			cleanupEnhancements = setupEnhancements();
		});

		return () => {
			window.removeEventListener('scroll', handleScroll);
			window.removeEventListener('resize', handleResize);
			cleanupEnhancements?.();
		};
	});

	onDestroy(() => {
		if (typeof document !== 'undefined') {
			delete document.body.dataset.route;
		}
		cleanupEnhancements?.();
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
		<a href={`${base}/`} class="logo" onclick={closeMenu}>Mathew Moslow</a>
		<button class="hamburger" class:active={menuOpen} onclick={toggleMenu} aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={menuOpen}>
			<span></span>
			<span></span>
			<span></span>
		</button>
		<ul class="nav-links" class:active={menuOpen} id="navLinks">
			<li>
				<a href={`${base}/#books`} onclick={closeMenu}>Books</a>
			</li>
			<li>
				<a href={`${base}/#soundtrack`} onclick={closeMenu}>Soundtrack</a>
			</li>
			<li>
				<a href={`${base}/#about`} onclick={closeMenu}>About</a>
			</li>
			<li>
				<a href={`${base}/#visual-journey`} onclick={closeMenu}>Journey</a>
			</li>
			<li>
				<a href={`${base}/#contact`} onclick={closeMenu}>Contact</a>
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

<main class="page-shell" use:heavyScroll>
	<slot />
</main>
