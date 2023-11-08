import { EventEmitter } from 'node:events';

export let progress = 0;
export class ProgressEvent extends EventEmitter {
	notify() {
		this.emit('progress');
	}
}

export const progress_events: ProgressEvent[] = [];

export function uploadProgress(val: number) {
	progress = val;
	for (const event of progress_events) {
		console.log('progress', event, progress);
		event.notify();
	}
}
