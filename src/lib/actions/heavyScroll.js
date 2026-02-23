/**
 * Heavy momentum scroll for desktop.
 * Tiny inputs move the page immediately but acceleration is slow,
 * giving a weighty, cinematic feel. Uses a flywheel model:
 * each wheel tick adds a small impulse; velocity decays gradually.
 */
export function heavyScroll(node) {
	// Only activate on desktop (no coarse pointer, no reduced-motion)
	if (typeof window === 'undefined') return {};
	const isTouch = window.matchMedia('(pointer: coarse)').matches;
	const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	if (isTouch || prefersReduced) return {};

	let velocity = 0;
	let currentY = window.scrollY;
	let targetY = currentY;
	let rafId;
	let active = true;
	let lastDirection = 0;      // Track scroll direction: 1 = down, -1 = up

	// Tuning knobs
	const IMPULSE = 0.14;       // How much each wheel tick adds (lower = heavier)
	const FRICTION = 0.92;      // Velocity decay per frame (higher = more coast)
	const LERP_FACTOR = 0.06;   // How fast position catches velocity (lower = heavier)
	const LERP_REVERSAL = 0.18; // Faster lerp when direction changes (snappier correction)
	const MIN_VELOCITY = 0.5;   // Stop threshold
	const MAX_VELOCITY = 120;   // Speed cap per frame

	function getMaxScroll() {
		return Math.max(0, document.body.scrollHeight - window.innerHeight);
	}

	function clamp(val, min, max) {
		return Math.min(Math.max(val, min), max);
	}

	function onWheel(e) {
		e.preventDefault();

		// Normalize delta across browsers/trackpads
		let delta = e.deltaY;
		if (e.deltaMode === 1) delta *= 40;  // lines
		if (e.deltaMode === 2) delta *= window.innerHeight; // pages

		// Detect direction change — kill opposing momentum fast
		const direction = delta > 0 ? 1 : -1;
		if (direction !== lastDirection && lastDirection !== 0) {
			// User reversed: cut existing velocity hard so correction is snappy
			velocity *= 0.3;
		}
		lastDirection = direction;

		// Add impulse (scaled down for heavy feel)
		velocity += delta * IMPULSE;
		velocity = clamp(velocity, -MAX_VELOCITY, MAX_VELOCITY);
	}

	function loop() {
		if (!active) return;

		// Apply friction
		velocity *= FRICTION;

		// Update target
		targetY += velocity;
		targetY = clamp(targetY, 0, getMaxScroll());

		// Lerp current position toward target
		// Use faster lerp when direction just reversed for snappier correction
		const currentDirection = velocity > 0 ? 1 : velocity < 0 ? -1 : 0;
		const scrollDelta = targetY - currentY;
		const movingOpposite = (scrollDelta > 0 && currentDirection < 0) || (scrollDelta < 0 && currentDirection > 0);
		const lerp = movingOpposite ? LERP_REVERSAL : LERP_FACTOR;
		currentY += scrollDelta * lerp;

		// Snap when close enough
		if (Math.abs(targetY - currentY) < 0.5) {
			currentY = targetY;
		}

		// Kill micro-velocity
		if (Math.abs(velocity) < MIN_VELOCITY) {
			velocity = 0;
		}

		// Apply
		window.scrollTo(0, currentY);

		rafId = requestAnimationFrame(loop);
	}

	// Sync if user scrolls via scrollbar or keyboard
	function onNativeScroll() {
		// Only sync if we're not driving — detect scrollbar drags
		const diff = Math.abs(window.scrollY - currentY);
		if (diff > 2 && Math.abs(velocity) < 1) {
			currentY = window.scrollY;
			targetY = currentY;
		}
	}

	// Sync on resize
	function onResize() {
		targetY = clamp(targetY, 0, getMaxScroll());
		currentY = clamp(currentY, 0, getMaxScroll());
	}

	// Prevent native smooth scroll from fighting us
	document.documentElement.style.scrollBehavior = 'auto';

	window.addEventListener('wheel', onWheel, { passive: false });
	window.addEventListener('scroll', onNativeScroll, { passive: true });
	window.addEventListener('resize', onResize, { passive: true });
	rafId = requestAnimationFrame(loop);

	return {
		destroy() {
			active = false;
			cancelAnimationFrame(rafId);
			window.removeEventListener('wheel', onWheel);
			window.removeEventListener('scroll', onNativeScroll);
			window.removeEventListener('resize', onResize);
			document.documentElement.style.scrollBehavior = '';
		}
	};
}
