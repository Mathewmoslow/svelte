import { env } from '$env/dynamic/private';
import { createClient } from '@supabase/supabase-js';

let client = null;

export function createSupabaseClient() {
	const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = env;

	if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
		return null;
	}

	if (!client) {
		client = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
			auth: {
				autoRefreshToken: false,
				persistSession: false
			}
		});
	}

	return client;
}
