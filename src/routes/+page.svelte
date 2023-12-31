<script lang="ts">
	import Axios, { type AxiosProgressEvent } from 'axios';
	import FileUpload from '../components/FileUpload.svelte';
	import QrModal from '../components/QrModal.svelte';
	import type { FileProps } from '../lib/fileUploadProps.js';
	// import Logo from '$lib/assets/cat1.webp';
	import FileList from '../components/FileList.svelte';
	import { generatePseudoRandomId } from '../lib/utilities/generatePseudoRandomId';
	import { bytesToSize } from '../lib/utilities/bytesToSize';
	import QRCode from 'qrcode';
	import { page } from '$app/stores';

	let userFiles: FileProps[] = [];
	let uploaded = '';
	let uploadedUrl = '';
	let expiresIn: string = '10';
	let qrImage = '';

	const controller = new AbortController();
	const signal = controller.signal;
	const sessionId = generatePseudoRandomId(4);
	const options = [
		{ name: '1 minute', value: '1' }, //TODO: dev only
		{ name: '10 minutes', value: '10' },
		{ name: '30 minutes', value: '30' },
		{ name: '1 Hour', value: '60' },
		{ name: '2 Hours', value: '120' }
	];

	const generatePresignedLink = async (file: File) => {
		if (!file) return;
		const formData = new FormData();
		formData.append('filename', file.name);
		formData.append('type', file.type);
		// formData.append('expiresIn', expiresIn);
		formData.append('sessionId', sessionId);
		try {
			const res = await fetch('/api/presigned-url', { method: 'POST', body: formData });
			if (res.ok) {
				const val = await res.json();
				return val.uploadUrl;
			}
		} catch (error) {
			console.log('error generating links', error);
			throw new Error('Error!');
		}
	};

	const handleCustomSubmit = async () => {
		//loop that inserts items to s3
		const s3Urls: string[] = [];
		for (const [key, userFile] of userFiles.entries()) {
			try {
				const res = await Axios.put(userFile.presignedUrl, userFile.file, {
					signal,
					onUploadProgress: (progressEvent: AxiosProgressEvent) => {
						const { loaded, total } = progressEvent;
						const loadingProgress = Math.floor((loaded * 100) / (total || 10));
						userFiles[key] = { ...userFile, loadingProgress };
					}
				});
				// console.log('s3', res?.config?.url && res.config.url.split('?')[0])
				res?.config?.url && s3Urls.push(res.config.url.split('?')[0]);
			} catch (error) {
				console.log(error);
				return;
			}
		}

		const fileProps = userFiles.map(({ file, viewSize }, i) => ({
			s3Url: s3Urls[i],
			ContentType: file.type,
			filename: file.name,
			size: viewSize
		}));
		//creates a download url based on the session id and saves to dynamo db
		const res = await fetch('api/download-url', {
			method: 'POST',
			body: JSON.stringify({
				fileProps,
				sessionId,
				expiresIn
			})
		});
		const downRes = await res.json();
		if (downRes.status) {
			uploaded = 'uploaded';
			uploadedUrl = downRes.sessionId;
			return;
		}
		uploaded = 'failed';
		// if(res.status)
		// console.log('final res', downRes);
	};

	const handleFileInput = async (e: Event | DragEvent) => {
		e.preventDefault();

		const files =
			'dataTransfer' in e
				? (e as DragEvent).dataTransfer?.files
				: (e.target as HTMLInputElement)?.files;

		if (!files || !files.length) return;

		const selectedFiles = Array.from(files) as File[];
		// console.log('selected files:', Array.from(selectedFiles));
		const promises = selectedFiles.map(async (file) => {
			const viewSize = bytesToSize(file.size);
			const presignedUrl = await generatePresignedLink(file);
			return {
				file,
				presignedUrl,
				viewSize,
				id: crypto.randomUUID(),
				loadingProgress: 0
			};
		});

		try {
			const uploadedFilesData = await Promise.all(promises);

			uploadedFilesData.forEach((newFileObject) => {
				//TODO: repeated file name logic can be moved up
				const fileIndex = userFiles.findIndex((item) => item.file.name === newFileObject.file.name);

				if (fileIndex !== -1) {
					userFiles[fileIndex] = newFileObject;
				} else {
					userFiles.push(newFileObject);
				}
			});

			userFiles = userFiles; // Ensures reactivity
		} catch (error) {
			console.log('Error uploading files', error);
			// Handle error if necessary
		}
	};

	const removeFile = (id: string) => {
		const index = userFiles.findIndex((item) => item.id === id);
		userFiles.splice(index, 1);
		userFiles = userFiles;
	};

	const generateQRCode = async () => {
		qrImage = await QRCode.toDataURL($page?.url.href + uploadedUrl, { scale: 11 });
		setTimeout(() => {
			(document.getElementById('qr_modal') as HTMLDialogElement).showModal();
		}, 1);
	};
</script>

<div class="font-sans m-2">
	<div class="sm:w-2/3 w-full mx-auto mb-4">
		<FileUpload {handleFileInput} />
	</div>
	{#if !userFiles.length}
		<p class="col-span-12 text-center font-semibold mt-2" data-testid="nothing-uploaded">
			Nothing uploaded
		</p>
	{:else}
		<div class="w-full sm:w-3/4 mx-auto flex items-end">
			<div class="sm:text-center font-semibold text-left">Uploaded Files</div>
			<div class="form-control sm:w-1/4 w-1/2 max-w-xs ml-auto">
				<label class="label" for="expires-in">
					<span class="label-text">Expires In</span>
				</label>
				<select class="select select-bordered select-sm" id="expires-in" bind:value={expiresIn}>
					{#each options as { name, value }}
						<option {value}>{name}</option>
					{/each}
				</select>
			</div>
		</div>
		{#each userFiles as userFile}
			<FileList {userFile} {removeFile} />
		{/each}
	{/if}

	{#if userFiles.length > 0}
		{#if uploaded === ''}
			<button
				type="button"
				class="btn block mx-auto"
				on:click={handleCustomSubmit}
				data-testid="upload"
			>
				Upload
			</button>
		{:else if uploaded === 'uploaded'}
			<div class="flex justify-center gap-4" data-testid="go-to-download">
				<a href={uploadedUrl}>
					<button type="button" class="btn" data-testid="go"> Go </button>
				</a>
				<button type="button" class="btn" on:click={generateQRCode}>Generate QR Code</button>
			</div>
		{:else if uploaded === 'failed'}
			<button type="button" class="btn block mx-auto" on:click={handleCustomSubmit}> Retry </button>
		{/if}
	{/if}
</div>

<QrModal {qrImage} />

<style lang="postcss">
	:global(html) {
		background-color: theme(colors.white);
	}
</style>
