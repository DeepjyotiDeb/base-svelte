import { ProgressEvent, progress_events } from './data.server.js';

export function GET({ request }) {
	const progressEvent = new ProgressEvent();
	progress_events.push(progressEvent);

	const stream = new ReadableStream({
		start(controller) {
			progressEvent.on('progress', () => {
				controller.enqueue(request.body);
			});
		},
		cancel() {
			const index = progress_events.indexOf(progressEvent);
			if (~index) progress_events.splice(index, 1);
		}
	});

	return new Response(stream, {
		headers: {
			'Content-Type': 'text/event-stream'
		}
	});
}
// export function GET() {
// 	let timer: ReturnType<typeof setInterval> | undefined;

// 	const stream = new ReadableStream({
// 		start(controller) {
// 			timer = setInterval(() => {
// 				const current_time = new Date().toLocaleString();
// 				const data = `event: message\ndata: ${current_time}\n\n`;
// 				controller.enqueue(data);
// 			}, 1000);
// 		},
// 		cancel() {
// 			clearInterval(timer);
// 		}
// 	});

// 	return new Response(stream, {
// 		headers: {
// 			'Content-Type': 'text/event-stream'
// 		}
// 	});
// }
