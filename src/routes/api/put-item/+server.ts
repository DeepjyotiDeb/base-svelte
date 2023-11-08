import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { putItem } from '../../../database/dynamo';

export const POST: RequestHandler = async ({ request }) => {
	const res = await request.json();
	const newRes = await putItem({
		DownloadUrl: res.DownloadUrl,
		ContentType: res.ContentType,
		ViewUrl: res.ViewUrl
	});
	return json({ ...newRes });
};
