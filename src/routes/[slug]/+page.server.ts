import { getRow } from '../../database/dynamo.js';

export async function load({ params }) {
	const dbRes = await getRow(params.slug);
	return { dbRes };
}
