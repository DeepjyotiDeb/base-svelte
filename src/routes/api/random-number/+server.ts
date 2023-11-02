import { error, json } from '@sveltejs/kit';
/** @type {import('./$types').RequestHandler} */
export function GET({ url }) {
	const min = Number(url.searchParams.get('min') ?? '0');
	const max = Number(url.searchParams.get('max') ?? '1');
	const d = max - min;
	if (isNaN(d) || d < 0) {
		throw error(400, 'min and max must be numbers, and min must be less than max');
	}
	const random = min + Math.random() * d;
	return new Response(String(random));
}

export async function POST({ request }) {
	const { a, b } = await request.json();
	if (isNumeric(a) && isNumeric(b)) return json(Number(a) + Number(b));
	else return json('number not sent');
}

function isNumeric(value: string) {
	return /^-?\d+$/.test(value);
}
