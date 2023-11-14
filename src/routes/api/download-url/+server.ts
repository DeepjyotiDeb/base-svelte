import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ACCESS_ID, BUCKET, REGION, SECRET_KEY } from '$env/static/private';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { batchWrite } from '../../../database/dynamo.server';

const client = new S3Client({
	region: REGION,
	credentials: { accessKeyId: ACCESS_ID, secretAccessKey: SECRET_KEY }
});

interface RequestFileProp {
	s3Url: string;
	ContentType: string;
	filename: string;
	size: string;
}

export const POST: RequestHandler = async ({ request }) => {
	const { fileProps, sessionId, expiresIn } = await request.json();
	// console.log('body', body);
	const timestamp = new Date().getTime() + 1 * 1 * Number(expiresIn) * 60 * 1000;
	const TTL = Math.floor(timestamp / 1000);
	let promises = [];

	try {
		promises = fileProps.map(async (file: RequestFileProp) => {
			const command = new GetObjectCommand({
				Bucket: BUCKET,
				Key: `${sessionId}/${file.filename}`,
				ResponseContentDisposition: `attachment; filename="${file.filename}"`
			});
			const DownloadUrl = await getSignedUrl(client, command, {
				expiresIn: Number(expiresIn) * 60
			});
			return {
				Id: crypto.randomUUID(),
				filename: file.filename,
				// s3Url: file.s3Url,
				DownloadUrl,
				ContentType: file.ContentType,
				ShortUrl: sessionId,
				TTL,
				size: file.size
			};
		});
	} catch (error) {
		// console.log(error);
		return json(error);
	}

	const uploadedFilesData = await Promise.all(promises);

	const items = [...uploadedFilesData];

	// console.log('uploaded files data', uploadedFilesData);
	//* saving the download url and session id into the db
	const res = await batchWrite({ items });
	if (res?.status) return json({ sessionId, ...res });
	return json({ ...res });
};
