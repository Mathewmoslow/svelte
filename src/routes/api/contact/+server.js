import { json } from '@sveltejs/kit';
import { getDb } from '$lib/server/db';

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

	const sql = getDb();
	let dbError = null;

	if (sql) {
		try {
			await sql`
				INSERT INTO messages (type, name, email, subject, message, book_title, format_preference, created_at)
				VALUES (
					${type},
					${payload.name.trim()},
					${payload.email.trim()},
					${payload.subject?.trim() || null},
					${payload.message?.trim() || null},
					${payload.bookTitle?.trim() || null},
					${payload.format?.trim() || null},
					${new Date().toISOString()}
				)
			`;
		} catch (err) {
			dbError = err.message;
		}
	}

	const stored = sql ? !dbError : false;
	const responseBody = {
		success: true,
		stored,
		warning: sql && dbError ? 'Database insert failed.' : undefined
	};

	return json(responseBody, { status: dbError ? 202 : 200 });
}
