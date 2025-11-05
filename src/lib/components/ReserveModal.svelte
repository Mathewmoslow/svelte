<script>
	import { createEventDispatcher } from 'svelte';
	import Modal from './Modal.svelte';

	export let open = false;
	export let bookTitle = 'Beyond The Reach Of Justice';

	const dispatch = createEventDispatcher();

	let loading = false;
	let success = false;
	let error = '';

	let name = '';
	let email = '';
	let format = '';
	let message = '';

	$: if (!open) {
		loading = false;
		success = false;
		error = '';
		name = '';
		email = '';
		format = '';
		message = '';
	}

	async function handleSubmit(event) {
		event.preventDefault();
		loading = true;
		error = '';

		try {
			const response = await fetch('/api/contact', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					type: 'reserve',
					bookTitle,
					name,
					email,
					format,
					message
				})
			});

			if (!response.ok) {
				throw new Error('Unable to send your reservation at the moment.');
			}

			success = true;
		} catch (err) {
			error = err.message || 'Something went wrong.';
		} finally {
			loading = false;
		}
	}

	function close() {
		dispatch('close');
	}
</script>

<Modal open={open} on:close={close} contentClass="reserve-modal">
	<h2 style="color: #4a7c59; margin-bottom: 30px; font-family: 'Playfair Display', serif; text-align: center;">
		Reserve Your Copy
	</h2>
	<p style="margin-bottom: 30px; text-align: center; color: rgba(232, 213, 183, 0.8);">
		Be among the first to receive <em>{bookTitle}</em> when it's released.
	</p>

	{#if success}
		<p style="color: #4a7c59; text-align: center; font-size: 1.05rem;">Thank you! You're on the list.</p>
	{:else}
		<form class="reserve-form" onsubmit={handleSubmit}>
			<label>
				<span>Your Name</span>
				<input type="text" bind:value={name} required />
			</label>
			<label>
				<span>Your Email</span>
				<input type="email" bind:value={email} required />
			</label>
			<label>
				<span>Format Preference (optional)</span>
				<select bind:value={format}>
					<option value="">Select format</option>
					<option value="hardcover">Hardcover</option>
					<option value="paperback">Paperback</option>
					<option value="ebook">eBook</option>
					<option value="audiobook">Audiobook</option>
				</select>
			</label>
			<label>
				<span>Message (optional)</span>
				<textarea rows="3" bind:value={message}></textarea>
			</label>
			{#if error}
				<p style="color: #d96a6a; font-size: 0.9rem;">{error}</p>
			{/if}
			<button type="submit" class="book-action" disabled={loading}>
				{#if loading}
					Sending…
				{:else}
					Snag My Copy
				{/if}
			</button>
		</form>
	{/if}
</Modal>
