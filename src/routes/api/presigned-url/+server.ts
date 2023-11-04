import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {
	ACCESS_ID,
	BUCKET,
	DEMO_BUCKET,
	REGION,
	SECRET_KEY,
	SUPER_ID,
	SUPER_SECRET
} from '$env/static/private';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { generatePseudoRandomId } from '$lib/utilities/generatePseudoRandomId';

export const POST: RequestHandler = async ({ request }) => {
	const a = await request.formData();
	const file = a.get('file') as File;

	const client = new S3Client({
		// apiVersion: "2006-03-01",
		credentials: { accessKeyId: ACCESS_ID, secretAccessKey: SECRET_KEY },
		region: REGION
	});

	const command = new PutObjectCommand({
		Bucket: BUCKET,
		Key: file.name,
		ContentType: file.type
	});
	const uploadUrl = await getSignedUrl(client, command, { expiresIn: 1000 });
	console.log('uploadUrl', uploadUrl);
	return json({ uploadUrl });
};
