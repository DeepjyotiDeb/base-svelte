import { TABLENAME } from '$env/static/private';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
	BatchWriteCommand,
	DeleteCommand,
	DynamoDBDocumentClient,
	QueryCommand
} from '@aws-sdk/lib-dynamodb';
import { env } from '$env/dynamic/private';
import type { BatchWriteProps } from '../lib/batchWriteProps';

const client = new DynamoDBClient({
	region: env.REGION,
	credentials: { accessKeyId: env.ACCESS_ID, secretAccessKey: env.SECRET_KEY }
});
const dynamoDocClient = DynamoDBDocumentClient.from(client);
const BATCH_MAX = 25;

export const getBatchItem = async (key: string) => {
	const command = new QueryCommand({
		TableName: TABLENAME,
		KeyConditionExpression: `ShortUrl = :shortUrl`,
		ExpressionAttributeValues: {
			':shortUrl': key
		},
		ConsistentRead: true
	});
	const res = await dynamoDocClient.send(command);
	// console.log('res', res);
	return res.Items;
};

export const batchWrite = async ({ items }: BatchWriteProps) => {
	const BATCHES = Math.floor((items.length + BATCH_MAX - 1) / BATCH_MAX);
	try {
		for (let batch = 0; batch < BATCHES; batch++) {
			const itemsArray = [];
			for (let i = 0; i < BATCH_MAX; i++) {
				const index = batch * BATCH_MAX + i;
				if (index >= items.length) break;
				itemsArray.push({
					PutRequest: {
						Item: items[index]
					}
				});
			}
			const params = {
				RequestItems: {
					[TABLENAME]: itemsArray
				}
			};
			const command = new BatchWriteCommand(params);
			const res = await dynamoDocClient.send(command);
			// console.log('res', res);
			return { response: res.$metadata.httpStatusCode, status: true };
		}
	} catch (error) {
		return { response: 'error executing batch write command in db', status: false };
	}
};

export const deleteItem = async (ShortUrl: string, Id: string) => {
	try {
		const command = new DeleteCommand({
			TableName: TABLENAME,
			Key: { ShortUrl, Id }
		});
		const response = await dynamoDocClient.send(command);
		// console.log('delete item', response);
		return response;
	} catch (error) {
		console.log(error);
		return error;
	}
};

export const batchDelete = async (ShortUrl: string, Ids: string[]) => {
	const BATCHES = Math.floor((Ids.length + BATCH_MAX - 1) / BATCH_MAX);
	try {
		for (let batch = 0; batch < BATCHES; batch++) {
			const itemsArray = [];
			for (let i = 0; i < BATCH_MAX; i++) {
				const index = batch * BATCH_MAX + i;
				if (index >= Ids.length) break;
				itemsArray.push({
					DeleteRequest: {
						Key: { ShortUrl, Id: Ids[index] }
					}
				});
			}
			const params = {
				RequestItems: {
					[TABLENAME]: itemsArray
					// wut: itemsArray
				}
			};
			const command = new BatchWriteCommand(params);
			const res = await dynamoDocClient.send(command);
			// console.log('res', res);
			return { response: res.$metadata.httpStatusCode, status: true };
		}
	} catch (error) {
		return { response: 'error executing batch delete command in db', status: false, error };
	}
};
