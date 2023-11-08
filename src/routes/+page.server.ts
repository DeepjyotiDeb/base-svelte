import type { Actions } from '@sveltejs/kit';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ACCESS_ID, BUCKET, REGION, SECRET_KEY } from '$env/static/private';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import axios from 'axios';
import { putItem } from '../database/dynamo';
import { uploadProgress } from './data.server';
import * as fs from 'fs';

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const file = data.get('no-user-file') as File;
		const url = data.get('url');
		if (typeof url === 'string') {
			try {
				// const res = await fetch(url, {
				// 	method: 'PUT',
				// 	body: file
				// });
				// const fStream = fs.createReadStream(file.webkitRelativePath);
				const fStream = await file.stream();
				// console.log('fstream', fStream, file.webkitRelativePath);
				const res = await axios.put(url, file, {
					onUploadProgress: (progressEvent) => {
						const { loaded, total } = progressEvent;
						const percent = Math.floor((loaded * 100) / (total || 100));
						uploadProgress(percent);
					}
				});
				// console.log('res', res);
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
					console.log('res', signedUrl);
					return { url: signedUrl, success: true };
				}
			} catch (error) {
				console.log(error);
				return { url: '', success: false };
			}

			return { url: '', success: false };
		}

		return { url: '', success: false };
	}
} satisfies Actions;
