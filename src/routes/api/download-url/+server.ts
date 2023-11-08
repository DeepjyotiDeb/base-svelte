import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ACCESS_ID, BUCKET, REGION, SECRET_KEY } from '$env/static/private';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const client = new S3Client({
	region: REGION,
	credentials: { accessKeyId: ACCESS_ID, secretAccessKey: SECRET_KEY }
});

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();
	// console.log('body', body);
	const viewCommand = new GetObjectCommand({
		Bucket: BUCKET,
		Key: body
	});
	const viewUrl = await getSignedUrl(client, viewCommand, { expiresIn: 1800 });

	const command = new GetObjectCommand({
		Bucket: BUCKET,
		Key: body,
		ResponseContentDisposition: `attachment; filename="${body}"`
	});
	const downloadUrl = await getSignedUrl(client, command, { expiresIn: 1800 });
	// const viewUrl = downloadUrl.replace(/&?response-content-disposition=[^&]*/, '');
	return json({ downloadUrl, viewUrl });
};
