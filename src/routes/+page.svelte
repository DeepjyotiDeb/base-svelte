<script lang="ts">
	import Axios, { type AxiosProgressEvent } from 'axios';
	import FileUpload from '../components/FileUpload.svelte';
	import type { FileProps, FileUploadProps } from '../lib/fileUploadProps.js';
	import Logo from '$lib/assets/cat1.webp';
	import FileList from '../components/FileList.svelte';
	import {generatePseudoRandomId} from '../lib/utilities/generatePseudoRandomId';
	// export let form: ActionData;
	// let file: File;
	// let generatedUrl: string;
	// let size: string;
	// let uploadedFiles: File[] = [];
	// let progress: number = 0;
	// let url = '';
	let userFiles: FileProps[] = [];
	const controller = new AbortController();
	const signal = controller.signal;
	let expiresIn: string = '10';
	const sessionId = generatePseudoRandomId(4)
	const options = [
		{ name: '10 minutes', value: '10' },
		{ name: '30 minutes', value: '30' },
		{ name: '1 Hour', value: '60' },
		{ name: '2 Hours', value: '120' }
	];

	const generatePresignedLink = async (file: File) => {
		if (!file) return;
		const formData = new FormData();
		formData.append('file', file);
		formData.append('expiresIn', expiresIn);
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

	// const handleUpload = async (e: Event) => {
	// 	const input = e.target as HTMLInputElement;
	// 	const selectedFile = input.files && input.files[0];

	// 	if (!selectedFile) return;
	// 	const formData = new FormData();
	// 	formData.append('file', selectedFile);
	// 	const res = await fetch('/api/presigned-url', { method: 'POST', body: formData });
	// 	if (res.ok) {
	// 		const val = await res.json();
	// 		url = val.uploadUrl;
	// 		file = selectedFile;
	// 	}
	// };

	const handleCustomSubmit = async () => {
		//inserting the file
		const s3Urls = []
		for (const [key, userFile] of userFiles.entries()) {
			try {
				const res = await Axios.put(userFile.presignedUrl, userFile.file, {
				signal,
				onUploadProgress: (progressEvent: AxiosProgressEvent) => {
					const { loaded, total } = progressEvent;
					const loadingProgress = Math.floor((loaded * 100) / (total || 10));
					userFiles[key] = {...userFile, loadingProgress}
				}
			});
			console.log('response', res.config.url);
			} catch (error) {
				console.log(error)
			}
			// s3Urls.push(res.config.url);
		}

		//generating the urls -> both download and view
		//TODO: generated urls must be under the same short url path!
		for (const [key, value] of userFiles.entries()) {
			try {
				const presignedRes = await fetch('api/download-url', {
					method: 'POST',
					body: JSON.stringify(value.file.name)
				});
			} catch (error) {
				console.log(error)
			}
		}

		// const { downloadUrl, viewUrl } = await presignedRes.json();
		// console.log('viewUrl', viewUrl);
		// const dbRes = await fetch('/api/put-item', {
		// 	method: 'POST',
		// 	body: JSON.stringify({ DownloadUrl: downloadUrl, ContentType: file.type, ViewUrl: viewUrl })
		// });
		// const newRes = await dbRes.json();
		// console.log('res', newRes);
		// generatedUrl = newRes?.ShortUrl;
	};

	// const deleteS3Item = async () => {
	// 	const res = await fetch('/api/delete', { method: 'post' });
	// 	console.log('res', res);
	// };

	const bytesToSize = (bytes: number) => {
		const kilobyte = 1024;
		const megabyte = kilobyte * 1024;
		// console.log('bytesToSize', bytes);
		if (bytes < kilobyte) {
			return bytes + ' Bytes';
		} else if (bytes < megabyte) {
			return (bytes / kilobyte).toFixed(2) + ' KB';
		} else {
			return (bytes / megabyte).toFixed(2) + ' MB';
		}
	};

	const handleDrop = async (event: DragEvent) => {
		event.preventDefault();
		if (event.dataTransfer && event.dataTransfer.files) {
			const droppedFiles = Array.from(event.dataTransfer.files) as File[];
			// uploadedFiles = [...uploadedFiles, ...droppedFiles]

			// uploadedFiles = droppedFiles;
			// console.log('uploadedFiles:', droppedFiles);
			if (!droppedFiles.length) return;
			if(droppedFiles.length > 20) return;
			for (const file of droppedFiles) {
				const viewSize = bytesToSize(file?.size);
				const presignedUrl = await generatePresignedLink(file);
				const fileIndex = userFiles.findIndex((item) => item.file.name === file.name);

				const newFileObject = {
					file,
					presignedUrl,
					viewSize,
					id: crypto.randomUUID(),
					loadingProgress: 0
				};

				if (fileIndex !== -1) {
					userFiles[fileIndex] = newFileObject;
				} else {
					userFiles.push(newFileObject);
				}
			}
			userFiles = userFiles;
		}
	};

	const handleFileInput = async (event: Event) => {
		event.preventDefault();
		const target = event.target as unknown as { files: File[] };
		if (!target?.files.length) return;
		const selectedFiles = Array.from(target.files) as File[];
		console.log('selected files:', selectedFiles);
		for (const file of selectedFiles) {
			const viewSize = bytesToSize(file?.size);
			const presignedUrl = await generatePresignedLink(file);
			const fileIndex = userFiles.findIndex((item) => item.file.name === file.name);

			const newFileObject = {
				file,
				presignedUrl,
				viewSize,
				id: crypto.randomUUID(),
				loadingProgress: 0
			};

			if (fileIndex !== -1) {
				userFiles[fileIndex] = newFileObject;
			} else {
				userFiles.push(newFileObject);
			}
		}
		userFiles = userFiles;
	};

	const removeFile = (index: number) => {
		userFiles.splice(index, 1);
		userFiles = userFiles
	}

	const myProps: FileUploadProps = { handleFileInput, handleDrop };
</script>

<div class="font-sans m-2">
	<div class="flex place-content-center items-center my-2">
		<img src={Logo} alt="logo" class="h-16 w-auto" />
		<div class="text-3xl font-semibold text-center">Stream-Bin!</div>
	</div>
	<div class="sm:w-2/3 w-full mx-auto mb-4">
		<FileUpload props={myProps} />
	</div>

	<!-- <button
		type="button"
		class="btn"
		on:click={() => console.log('user', userFiles, userFiles.length > 0)}>log</button
	> -->
	{#if !userFiles.length}
		<p class="col-span-12 text-center font-semibold mt-2">Nothing uploaded</p>
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
		{#each userFiles as userFile, index}
			<FileList {userFile} {removeFile} {index}/>
		{/each}
	{/if}

	<!-- <a href={userFile.presignedUrl}>
							<button type="button" class="btn"> generated url </button>
						</a> -->
	{#if userFiles.length > 0}
		<button type="button" class="btn block mx-auto" on:click={handleCustomSubmit}> Upload </button>
	{/if}
</div>

<style lang="postcss">
	:global(html) {
		background-color: theme(colors.white);
	}
</style>
