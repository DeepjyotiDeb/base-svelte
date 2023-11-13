import { json, type RequestHandler } from '@sveltejs/kit';
import { deleteItem } from '../../../database/dynamo.server';

export const POST: RequestHandler = async ({ request }) => {
	// const a = await request.formData();
	// const file = a.get('file') as File;
	// console.log('a', file.name)
	const { ShortUrl, Id } = await request.json();
	const res = await deleteItem(ShortUrl, Id);
	// console.log('res', res);
	return json(res);
	// const command = new DeleteObjectCommand({
	//     Bucket: "stream-bin",
	//     Key: "photomode_09102023_181349.png",
	// });

	// try {
	//     const client = new S3Client({ credentials: { accessKeyId: ACCESS_ID, secretAccessKey: SECRET_KEY }, region: REGION })
	//     const response = await client.send(command);
	//     console.log('rdeltete', response);
	//     return json('response')
	// } catch (err) {
	//     console.error(err);
	// }
	// // const options = {
	// //     onUploadProgress: (progressEvent: { loaded: number; total: number; }) => {
	// //         const { loaded, total } = progressEvent;
	// //         let percent = Math.floor((loaded * 100) / total);
	// //     }
	// // };

	// // const res = await fetch()

	// return json('res');
};
