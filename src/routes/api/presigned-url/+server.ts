import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { ACCESS_ID, BUCKET, REGION, SECRET_KEY } from '$env/static/private';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { generatePseudoRandomId } from '$lib/utilities/generatePseudoRandomId';


export const POST: RequestHandler = async ({ request }) => {
    const a = await request.formData();
    const file = a.get('file') as File;
    console.log('a', file.name)

    const client = new S3Client({ credentials: { accessKeyId: ACCESS_ID, secretAccessKey: SECRET_KEY }, region: REGION })
    const s3Params = {
        Bucket: BUCKET,
        Key: generatePseudoRandomId(4) + file.name, //some randomness in the file storage
        ContentType: file.type
        // ACL: 'public-read'
    };
    const command = new PutObjectCommand(s3Params)
    const uploadUrl = await getSignedUrl(client, command, { expiresIn: 360 })

    return json({ uploadUrl: uploadUrl.slice(0, uploadUrl.indexOf('?')) });
};

