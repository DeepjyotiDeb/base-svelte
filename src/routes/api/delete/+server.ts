import { json, type RequestHandler } from '@sveltejs/kit';
import { deleteItem } from '../../../database/dynamo.server';

export const POST: RequestHandler = async ({ request }) => {
	const { ShortUrl, Id } = await request.json();
	const res = await deleteItem(ShortUrl, Id);
	return json(res);
};
