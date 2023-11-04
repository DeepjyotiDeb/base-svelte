import { presignedUrl } from '$lib/store';
import type { Actions } from '@sveltejs/kit';
import { onDestroy } from 'svelte';
import { get } from 'svelte/store';
import https from 'https';
import Axios from 'axios';
import axios from 'axios';
export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		console.log('form data', data.get('no-user-file'));
		const file = data.get('no-user-file') as File;
		const url = data.get('url');
		// const options = {
		//     onUploadProgress: (progressEvent: { loaded: number; total: number; }) => {
		//         const { loaded, total } = progressEvent;
		//         const percent = Math.floor((loaded * 100) / total);
		//         console.log('percent ', percent, '%')
		//     }
		// };

		console.log('url', { url, somefile: file });
		const formData = new FormData();
		formData.append('file', file);
		if (typeof url === 'string') {
			// const myHeaders = new Headers({ 'Content-Type': file.type });
			try {
				const res = await fetch(url, {
					method: 'PUT',
					body: file
				});
				// const response = await axios.put(url, file, { headers: { 'Content-Type': null } });
				console.log('res', res);
			} catch (error) {
				console.log(error);
			}

			return { success: true, name: 'hello', url };
		}

		return { success: true, name: 'out hello', url };
	}
} satisfies Actions;
