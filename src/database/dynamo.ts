import { ACCESS_ID, AWS_DEFAULT_REGION, SECRET_KEY, TABLENAME } from '$env/static/private';
import {
	BillingMode,
	CreateTableCommand,
	DeleteItemCommand,
	DeleteTableCommand,
	DescribeTableCommand,
	DynamoDBClient,
	GetItemCommand,
	waitUntilTableExists
} from '@aws-sdk/client-dynamodb';
import {
	DeleteCommand,
	DynamoDBDocumentClient,
	GetCommand,
	PutCommand,
	ScanCommand
} from '@aws-sdk/lib-dynamodb';
import { generatePseudoRandomId } from '../lib/utilities/generatePseudoRandomId';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { env } from '$env/dynamic/private';

const client = new DynamoDBClient({
	region: env.AWS_DEFAULT_REGION,
	credentials: { accessKeyId: env.ACCESS_ID, secretAccessKey: env.SECRET_KEY }
});
const dynamoDocClient = DynamoDBDocumentClient.from(client);

// export const createTable = async () => {
// 	const createTableCommand = new CreateTableCommand({
// 		TableName: 'will-delete',
// 		BillingMode: BillingMode.PAY_PER_REQUEST,
// 		AttributeDefinitions: [
// 			{ AttributeName: 'shortUrl', AttributeType: 'S' }
// 			// { AttributeName: 'longUrl', AttributeType: 'S' }
// 		],
// 		KeySchema: [
// 			{ AttributeName: 'shortUrl', KeyType: 'HASH' }
// 			// { AttributeName: 'longUrl', KeyType: 'RANGE' }
// 		]
// 	});
// 	console.log('Creating a table.');
// 	const tableResponse = await client.send(createTableCommand);
// 	console.log(`Table created: ${JSON.stringify(tableResponse.TableDescription)}`);
// 	const res = await waitUntilTableExists({ client, maxWaitTime: 30 }, { TableName });
// 	console.log('res', res);
// 	// const command = new DescribeTableCommand({
// 	// 	TableName
// 	// });
// 	// const response = await client.send(command);
// 	// console.log(`TABLE NAME: ${response?.Table?.TableName}`);
// 	// console.log(`TABLE ITEM COUNT: ${response?.Table?.ItemCount}`);
// };

export const getRow = async (key: string) => {
	const row = new GetItemCommand({
		TableName: env.TABLENAME,
		Key: { ShortUrl: { S: key } }
	});
	const { Item } = await dynamoDocClient.send(row);
	if (Item) return unmarshall(Item);
	return Item;
};

export const getRows = async () => {
	// const ncommand = new DescribeTableCommand({
	// 	TableName: 'will-delete'
	// });

	// const nresponse = await client.send(ncommand);
	// console.log(`TABLE NAME: ${nresponse?.Table?.TableName}`);
	const command = new ScanCommand({
		ProjectionExpression: '#shortUrl, longUrl',
		ExpressionAttributeNames: { '#shortUrl': 'shortUrl' },
		TableName: 'will-delete'
	});

	const response = await dynamoDocClient.send(command);
	if (!response?.Items?.length) return;
	console.log('response: ', response.Items);
	return response;
};

export const putItem = async ({
	DownloadUrl = '',
	ViewUrl = '',
	TTL_days = 1,
	TTL_hours = 1,
	TTL_minutes = 10,
	ContentType = 'text/plain'
}) => {
	//* upload media to s3, push to a queue?, retrieve s3 url
	//* create a random 6 digit string representing a short url
	//* push both the s3 url and the short url as an item in dynamo db

	//* lambda will only have few things -> access s3 object, delete it!
	const ShortUrl = generatePseudoRandomId(5);
	const timestamp = new Date().getTime() + TTL_days * TTL_hours * TTL_minutes * 60 * 1000;
	const TTL = Math.floor(timestamp / 1000);
	// const putCom = new Bat
	const command = new PutCommand({
		TableName: TABLENAME,
		Item: { ShortUrl, DownloadUrl, TTL, ContentType, ViewUrl }
	});

	const response = await dynamoDocClient.send(command);
	return { response, ShortUrl, DownloadUrl };
};

export const deleteItem = async () => {
	try {
		const ncommand = new DescribeTableCommand({
			TableName: 'will-delete'
		});
		const nresponse = await client.send(ncommand);
		// console.log(`TABLE NAME`, JSON.stringify(nresponse));

		const command = new DeleteCommand({
			TableName: 'will-delete',
			Key: { shortUrl: 'short-item-1' }
		});
		const response = await dynamoDocClient.send(command);
		console.log('delete item', response);
		return nresponse;
	} catch (error) {
		console.log(error);
	}
};

export const deleteTable = async () => {
	const command = new DeleteTableCommand({
		TableName: 'will-delete'
	});

	const response = await dynamoDocClient.send(command);
	console.log(response);
	return response;
};
