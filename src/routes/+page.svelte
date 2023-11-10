<script lang="ts">
	import Axios, { type AxiosProgressEvent } from 'axios';
	import FileUpload from '../components/FileUpload.svelte';
	import type { FileUploadProps } from '../lib/fileUploadProps.js';
	import Logo from '$lib/assets/cat1.webp';

	// export let form: ActionData;
	let file: File;
	let generatedUrl: string;
	let size: string;
	let uploadedFiles: File[] = [];
	let progress: number = 0;
	let url = '';
	const controller = new AbortController();
	const signal = controller.signal;

	const generatePresignedLink = async (files: File[]) => {
		const selectedFile = files[0];

		if (!selectedFile) return;
		const formData = new FormData();
		formData.append('file', selectedFile);
		const res = await fetch('/api/presigned-url', { method: 'POST', body: formData });
		if (res.ok) {
			const val = await res.json();
			url = val.uploadUrl;
			file = selectedFile;
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
		await Axios.put(url, uploadedFiles[0], {
			signal,
			onUploadProgress: (progressEvent: AxiosProgressEvent) => {
				const { loaded, total } = progressEvent;
				progress = Math.floor((loaded * 100) / (total || 10));
			}
		});

		//generating the urls -> both download and view
		const presignedRes = await fetch('api/download-url', {
			method: 'POST',
			body: JSON.stringify(file.name)
		});
		const { downloadUrl, viewUrl } = await presignedRes.json();
		console.log('viewUrl', viewUrl);
		const dbRes = await fetch('/api/put-item', {
			method: 'POST',
			body: JSON.stringify({ DownloadUrl: downloadUrl, ContentType: file.type, ViewUrl: viewUrl })
		});
		const newRes = await dbRes.json();
		// form = {
		// 	success: true,
		// 	url: newRes,
		// }
		// //make the db call
		console.log('res', newRes);
		generatedUrl = newRes?.ShortUrl;
		// goto(`/${newRes?.ShortUrl}`);
	};

	// const deleteS3Item = async () => {
	// 	const res = await fetch('/api/delete', { method: 'post' });
	// 	console.log('res', res);
	// };

	const bytesToSize = (bytes: number) => {
		const kilobyte = 1024;
		const megabyte = kilobyte * 1024;
		console.log('bytesToSize', bytes);
		if (bytes < kilobyte) {
			size = bytes + ' Bytes';
			return;
		} else if (bytes < megabyte) {
			size = (bytes / kilobyte).toFixed(2) + ' KB';
			return;
		} else {
			size = (bytes / megabyte).toFixed(2) + ' MB';
			return;
		}
	};

	const handleDrop = async (event: DragEvent) => {
		event.preventDefault();
		if (event.dataTransfer && event.dataTransfer.files) {
			const droppedFiles = Array.from(event.dataTransfer.files) as File[];
			uploadedFiles = droppedFiles;
			console.log('uploadedFiles:', uploadedFiles);
			if (!uploadedFiles.length) return;
			bytesToSize(uploadedFiles[0].size);
			await generatePresignedLink(uploadedFiles);
		}
	};

	const handleFileInput = async (event: Event) => {
		event.preventDefault();
		const target = event.target as unknown as { files: File[] };
		if (!target?.files.length) return;
		const selectedFiles = Array.from(target.files) as File[];
		uploadedFiles = selectedFiles;
		console.log('uploadedFiles: ', uploadedFiles);
		if (!uploadedFiles.length) return;
		bytesToSize(uploadedFiles[0].size);
		await generatePresignedLink(uploadedFiles);
	};

	const myProps: FileUploadProps = { handleFileInput, handleDrop };
</script>

<div class="font-sans m-2">
	<div class="flex place-content-center items-center my-2">
		<img src={Logo} alt="logo" class="h-16 w-auto" />
		<div class="text-3xl font-semibold text-center">Stream-Bin!</div>
	</div>
	<div class="w-2/3 mx-auto">
		<FileUpload props={myProps} />
	</div>

	<!-- <button type="button" on:click={deleteS3Item} class="btn">Delete</button> -->
	<div class="grid grid-cols-12 gap-1 mx-auto w-3/4 mt-4">

		{#if uploadedFiles.length > 0}
			<div class="col-span-12">Uploaded File</div>
			<div class="col-span-1 place-self-center">
				<i class="fa-regular fa-file-image text-3xl top-1/2 left-1/2" />
			</div>
			<div class="col-span-10 flex flex-col">
				<p>{uploadedFiles[0]?.name}</p>
				<p>{size}</p>
			</div>
			<div class="col-span-1">
				{#if progress === 0}
					<button type="button" class="btn" on:click={handleCustomSubmit}> Upload </button>
				{:else if progress > 0 && progress < 100}
					<div
						class="radial-progress"
						style={`--value:${progress}; --size:3.2rem;`}
						role="progressbar"
					>
						{progress}%
					</div>
				{:else}
					<a href={generatedUrl}>
						<button type="button" class="btn"> generated url </button>
					</a>
				{/if}
			</div>
		{:else}
			<p class="col-span-12 text-center">Nothing uploaded</p>
		{/if}
	</div>

	<!-- <div>
	<p>Files</p>
	<div>
		<div class="radial-progress" style={`--value:${progress};`} role="progressbar">{progress}%</div>
	</div>
</div> -->
</div>

<!-- multiple file upload test -->

<!-- <p>{form?.success}</p> -->
<!-- {#if customForm?.success}
<img alt="user-media" src={customForm?.url} />
{/if} -->
<!-- {#if form?.success}
	{#if typeof form?.url === 'string'}
		{#if file?.type.includes('image')}
			<img alt="user-media" src={form?.url} />
		{/if}
		{#if file?.type.includes('pdf')}
			<object data={form?.url} type="application/pdf" title={file.name}>
				<p>unable to display file</p>
			</object>
		{/if}
		{#if file?.type.includes('video')}
			<video controls width="250">
				<source src={form?.url} type="video/webm" />
				<track kind="captions" />
			</video>
		{/if}
		<button type="button" class="button">
			<a href={form?.url} download={file?.name}> download </a>
		</button>
	{/if}
{/if} -->

<!-- <img alt="user-media" src={url.split('?')[0]} /> -->

<style lang="postcss">
	:global(html) {
		background-color: theme(colors.white);
	}
</style>
