import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ACCESS_ID, BUCKET, REGION, SECRET_KEY } from '$env/static/private';

const client = new S3Client({
	// apiVersion: "2006-03-01",
	credentials: { accessKeyId: ACCESS_ID, secretAccessKey: SECRET_KEY },
	region: REGION
});

export const POST: RequestHandler = async ({ request }) => {
	const res = await request.formData();
	const file = res.get('file') as File;
	const expiresIn = res.get('expiresIn');
	const sessionId = res.get('sessionId');

	const command = new PutObjectCommand({
		Bucket: BUCKET,
		Key: `${sessionId}/${file.name}`,
		ContentType: file.type
	});
	const uploadUrl = await getSignedUrl(client, command, { expiresIn: Number(expiresIn) });
	// console.log('uploadUrl', uploadUrl);
	return json({ uploadUrl });
};
