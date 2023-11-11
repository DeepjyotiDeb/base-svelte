import { getBatchItem } from '../../database/dynamo.js';

export async function load({ params }) {
	const dbRes = await getBatchItem(params.slug);
	console.log('dbRes: ', dbRes);
	return { dbRes };
}
