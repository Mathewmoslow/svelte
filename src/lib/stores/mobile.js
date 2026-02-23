import { writable } from 'svelte/store';

const initial = typeof window !== 'undefined'
	? window.matchMedia('(pointer: coarse)').matches
	: false;

function createMobileStore() {
	const { subscribe, set } = writable(initial);

	if (typeof window !== 'undefined') {
		const query = window.matchMedia('(pointer: coarse)');
		query.addEventListener('change', (e) => set(e.matches));
	}

	return { subscribe };
}

export const isMobile = createMobileStore();
