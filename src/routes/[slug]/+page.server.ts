import { getBatchItem } from '../../database/dynamo.server.js';

export async function load({ params }) {
	const dbRes = await getBatchItem(params.slug);
	return { dbRes };
}
