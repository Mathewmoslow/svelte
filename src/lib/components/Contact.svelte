<script>
	import { fade } from 'svelte/transition';
	export let standalone = true;

	let name = '';
	let email = '';
	let subject = '';
	let message = '';
	let loading = false;
	let success = false;
	let error = '';

	async function handleSubmit(event) {
		event.preventDefault();
		loading = true;
		error = '';

		try {
			const response = await fetch('/api/contact', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					type: 'contact',
					name,
					email,
					subject,
					message
				})
			});

			if (!response.ok) {
				throw new Error('Unable to send your message at the moment.');
			}

			success = true;
		} catch (err) {
			error = err.message || 'Something went wrong.';
		} finally {
			loading = false;
		}
	}
</script>

<section class="contact-section" class:stand-alone={standalone} id="contact" data-bg="#0b0b0b">
	<div class="contact-container" transition:fade={{ duration: 400 }}>
		<h2 class="section-title visible">Get in Touch</h2>
		<p class="contact-subtitle">Have thoughts on the books? Questions about the writing? Send them my way.</p>

		{#if success}
			<p style="color: #4a7c59; font-size: 1.1rem; text-align: center;">Thank you! Your message is on its way.</p>
		{:else}
			<form class="contact-form" onsubmit={handleSubmit}>
				<div class="form-group">
					<label for="name">Name</label>
					<input id="name" type="text" bind:value={name} required />
				</div>
				<div class="form-group">
					<label for="email">Email</label>
					<input id="email" type="email" bind:value={email} required />
				</div>
				<div class="form-group">
					<label for="subject">Subject</label>
					<input id="subject" type="text" bind:value={subject} required />
				</div>
				<div class="form-group">
					<label for="message">Message</label>
					<textarea id="message" rows="6" bind:value={message} required></textarea>
				</div>
				{#if error}
					<p style="color: #d96a6a; font-size: 0.9rem;">{error}</p>
				{/if}
				<button type="submit" class="form-submit" disabled={loading}>
					{#if loading}
						Sending…
					{:else}
						Send Message
					{/if}
				</button>
			</form>
		{/if}
	</div>
</section>
