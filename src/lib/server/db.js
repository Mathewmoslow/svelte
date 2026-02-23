import { neon } from '@neondatabase/serverless';
import { env } from '$env/dynamic/private';

export function getDb() {
	const { DATABASE_URL } = env;
	if (!DATABASE_URL) return null;
	return neon(DATABASE_URL);
}
