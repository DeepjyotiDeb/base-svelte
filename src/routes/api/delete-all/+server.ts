import { json, type RequestHandler } from '@sveltejs/kit';
import { batchDelete } from '../../../database/dynamo.server';

export const POST: RequestHandler = async ({ request }) => {
	const { ShortUrl, Ids } = await request.json();
	const res = await batchDelete(ShortUrl, Ids);
	return json(res);
};
