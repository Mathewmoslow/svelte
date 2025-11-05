<script>
	import { createEventDispatcher } from 'svelte';

	export let open = false;
	export let closeOnOverlay = true;
	export let contentClass = '';

	const dispatch = createEventDispatcher();

	function close() {
		dispatch('close');
	}

	function handleOverlay(event) {
		if (!closeOnOverlay) return;
		if (event.target === event.currentTarget) {
			close();
		}
	}
</script>

{#if open}
	<div
		class="modal-overlay"
		onclick={handleOverlay}
		onkeydown={(event) => {
			if (event.key === 'Escape') {
				event.preventDefault();
				close();
			}
		}}
		role="button"
		tabindex="0"
		aria-label="Close dialog"
		style="display: flex;"
	>
		<div class={`modal-content ${contentClass}`} role="dialog" aria-modal="true">
			<button class="modal-close" type="button" onclick={close} aria-label="Close dialog">×</button>
			<slot />
		</div>
	</div>
{/if}
