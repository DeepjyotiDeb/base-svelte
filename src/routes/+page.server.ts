import { presignedUrl } from '$lib/store';
import type { Actions } from '@sveltejs/kit';
import { onDestroy } from 'svelte';
import { get } from 'svelte/store';
import https from 'https';
import Axios from 'axios'
export const actions = {
    default: async ({ request, fetch }) => {
        const data = await request.formData();
        console.log('form data', data.get('no-user-file'))
        const somefile = data.get('no-user-file') as File
        const url = data.get('url')
        // const options = {
        //     onUploadProgress: (progressEvent: { loaded: number; total: number; }) => {
        //         const { loaded, total } = progressEvent;
        //         const percent = Math.floor((loaded * 100) / total);
        //         console.log('percent ', percent, '%')
        //     }
        // };

        console.log('url', { url, somefile })
        if (typeof url === 'string') {
            // const myHeaders = new Headers({ 'Content-Type': 'image/*' });
            const response = await fetch(url, {
                method: 'PUT',
                // headers: myHeaders,
                body: somefile
            });
            // const response = await Axios.put(url, somefile,
            //     {
            //         headers: {
            //             'Content-Type': 'application/octet-stream'
            //         }
            //     }
            // );
            // console.log('response', { response })
            // const response = await put({ url, data: file })
            console.log('res', response)
            return { success: true, name: 'hello', url }
        }

        return { success: true, name: 'out hello', url };
    },
} satisfies Actions;