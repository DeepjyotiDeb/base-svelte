import { deleteItem, deleteTable, getRows, putItem } from '../../database/dynamo';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	// getRow();
	// createTable();
	const tabRes = getRows();
	// const res = deleteItem();
	// const deleteRes = deleteTable();
	// putItem();
	return {
		one: Promise.resolve('alo?'),
		two: Promise.resolve('salut!'),
		// res,
		tabRes
		// deleteRes
		// streamed: {
		// 	three: new Promise((resolve) => {
		// 		setTimeout(() => {
		// 			resolve({ message: 'Sunt eu, un haiduc' });
		// 		}, 1000);
		// 	})
		// }
	};
};
