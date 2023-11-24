import { json } from '@sveltejs/kit';

export const GET = () => {
	return json({ status: 200, message: 'Site is live!' });
};
