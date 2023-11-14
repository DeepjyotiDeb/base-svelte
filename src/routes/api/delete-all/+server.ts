import { json, type RequestHandler } from '@sveltejs/kit';
import { batchDelete } from '../../../database/dynamo.server';

export const POST: RequestHandler = async ({ request }) => {
	// const a = await request.formData();
	// const file = a.get('file') as File;
	// console.log('a', file.name)
	const { ShortUrl, Ids } = await request.json();
	const res = await batchDelete(ShortUrl, Ids);
	// console.log('res', res);
	return json(res);
};
