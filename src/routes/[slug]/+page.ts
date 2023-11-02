import { error } from '@sveltejs/kit';
/** @type {import('./$types').PageLoad} */
export async function load({ params, fetch }) {
	let val = '';
	const res = await fetch('/api/random-number', {
		method: 'GET'
	});
	if (res.ok) {
		val = await res.json();
	}

	if (params.slug === 'hello-world')
		return {
			title: 'Hello world!',
			content: 'Welcome to our blog. Lorem ipsum dolor sit amet...',
			val
		};
	if (params.slug === 'show-error') throw error(404, 'Not found');
	return { title: 'wut world!', content: 'wut wut...', val };
}

export const ssr = false;
export const csr = true;
