import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ACCESS_ID, BUCKET, REGION, SECRET_KEY } from '$env/static/private';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { batchWrite, putItem } from '../../../database/dynamo';
import type { BatchWriteProps } from '../../../lib/batchWriteProps';

const client = new S3Client({
	region: REGION,
	credentials: { accessKeyId: ACCESS_ID, secretAccessKey: SECRET_KEY }
});

interface RequestFileProp {
	s3Url: string;
	ContentType: string;
	filename: string;
}

export const POST: RequestHandler = async ({ request }) => {
	const { fileProps, sessionId, expiresIn } = await request.json();
	// console.log('body', body);
	const timestamp = new Date().getTime() + 1 * 1 * Number(expiresIn) * 60 * 1000;
	const TTL = Math.floor(timestamp / 1000);

	const promises = fileProps.map(async (file: RequestFileProp) => {
		const command = new GetObjectCommand({
			Bucket: BUCKET,
			Key: `${sessionId}/${file.filename}`,
			ResponseContentDisposition: `attachment; filename="${file.filename}"`
		});
		const DownloadUrl = await getSignedUrl(client, command, { expiresIn: Number(expiresIn) * 60 });
		return {
			DownloadUrl,
			ContentType: file.ContentType,
			ShortUrl: sessionId,
			TTL,
			id: crypto.randomUUID()
		};
	});

	const uploadedFilesData = await Promise.all(promises);

	const items = [...uploadedFilesData];

	// console.log('uploaded files data', uploadedFilesData);
	const res = await batchWrite({ items });
	if (res === 200) {
		return json(sessionId);
	}
	return json({ error: 'error' });
	// const DownloadUrl = await getSignedUrl(client, command, { expiresIn });
	// const dbRes = await putItem({
	// 	TTL_minutes: Number(expiresIn),
	// 	ShortUrl: sessionId,
	// 	ContentType,
	// 	DownloadUrl
	// });
	return json({ success: 'YEA!' });
};
