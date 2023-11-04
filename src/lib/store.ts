import { writable } from 'svelte/store';

export const presignedUrl = writable<string>('');
export const file = writable<File | null>(null);