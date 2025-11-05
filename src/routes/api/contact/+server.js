import { json } from '@sveltejs/kit';
import { createSupabaseClient } from '$lib/server/supabase';

const requirements = {
	contact: ['name', 'email', 'subject', 'message'],
	reserve: ['name', 'email', 'bookTitle']
};

export async function POST({ request }) {
	let payload;

	try {
		payload = await request.json();
	} catch (err) {
		return json({ success: false, error: 'Invalid JSON payload.' }, { status: 400 });
	}

	const type = payload.type && requirements[payload.type] ? payload.type : 'contact';
	const requiredFields = requirements[type];

	for (const field of requiredFields) {
		if (!payload[field] || typeof payload[field] !== 'string' || !payload[field].trim()) {
			return json({ success: false, error: `Missing required field: ${field}` }, { status: 400 });
		}
	}

	const supabase = createSupabaseClient();
	let supabaseError = null;

	if (supabase) {
		const { error } = await supabase.from('messages').insert({
			type,
			name: payload.name.trim(),
			email: payload.email.trim(),
			subject: payload.subject?.trim() || null,
			message: payload.message?.trim() || null,
			book_title: payload.bookTitle?.trim() || null,
			format_preference: payload.format?.trim() || null,
			created_at: new Date().toISOString()
		});

		supabaseError = error?.message ?? null;
	}

	const stored = supabase ? !supabaseError : false;
	const responseBody = {
		success: true,
		stored,
		warning: supabase && supabaseError ? 'Stored locally only. Supabase insert failed.' : undefined
	};

	return json(responseBody, { status: supabaseError ? 202 : 200 });
}
