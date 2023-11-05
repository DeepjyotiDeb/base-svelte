import type { Actions } from '@sveltejs/kit';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ACCESS_ID, BUCKET, REGION, SECRET_KEY } from '$env/static/private';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import axios from 'axios';
import { putItem } from '../database/dynamo';

export const actions = {
	default: async ({ request, fetch }) => {
		const data = await request.formData();
		// console.log('form data', data.get('no-user-file'));
		const file = data.get('no-user-file') as File;
		const url = data.get('url');
		// const options = {
		//     onUploadProgress: (progressEvent: { loaded: number; total: number; }) => {
		//         const { loaded, total } = progressEvent;
		//         const percent = Math.floor((loaded * 100) / total);
		//         console.log('percent ', percent, '%')
		//     }
		// };

		// console.log('url', { url, somefile: file });
		const formData = new FormData();
		formData.append('file', file);
		if (typeof url === 'string') {
			// const myHeaders = new Headers({ 'Content-Type': file.type });
			try {
				const res = await fetch(url, {
					method: 'PUT',
					body: file
				});
				// const res = await axios.put(url, file);
				if (res.status) {
					const client = new S3Client({
						region: REGION,
						credentials: { accessKeyId: ACCESS_ID, secretAccessKey: SECRET_KEY }
					});
					const command = new GetObjectCommand({
						Bucket: BUCKET,
						Key: file.name,
						ResponseContentDisposition: `attachment; filename="${file.name}"`
					});
					const signedUrl = await getSignedUrl(client, command, { expiresIn: 600 });
					// console.log('res', dbResponse);
					return { url: signedUrl, success: true };
				}
			} catch (error) {
				console.log(error);
				return { url: '', success: false };
			}

			return { url, success: false };
		}

		return { success: false, url: '' };
	}
} satisfies Actions;
