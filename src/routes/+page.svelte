<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import Axios, { type AxiosProgressEvent } from 'axios';
	import type {ActionData} from './$types.js';
	import {onMount} from 'svelte';

	export let form: ActionData;
	let progressEvent = 0;
	function subscribe() {
		const sse = new EventSource('/');
		sse.onmessage = (e) => {
			console.log('progress', e.data)
			return progressEvent = e.data;
		}
		return () => sse.close();
	}

	// onMount(subscribe);
	// export let form;
	let file: File;
	let progress: Number = 0;
	// if(form?.success){
	//   console.log('form', form)
	// }
	// console.log('form', form?.name)

	// const authorizedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.mp4', '.pdf'];
	let url = '';

	const handleUpload = async (e: Event) => {
		const input = e.target as HTMLInputElement;
		const selectedFile = input.files && input.files[0];

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

	const handleCustomSubmit = async () => {
		// console.log('url:', url, file.type);
		const options = {
			onUploadProgress: (progressEvent: AxiosProgressEvent) => {
				// console.log('percent ', progressEvent, '%')
				const { loaded, total } = progressEvent;
				progress = Math.floor((loaded * 100) / (total || 10));
				// console.log('percent ', percent, '%')
			}
		};

		//inserting the file
		await Axios.put(url, file, options);

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
		goto(`/${newRes?.ShortUrl}`);
	};

	// const deleteS3Item = async () => {
	// 	const res = await fetch('/api/delete', { method: 'post' });
	// 	console.log('res', res);
	// };

	let isDragging = false;
	let uploadedFiles: File[] = [];

	function handleDragEnter(e:DragEvent) {
		e.preventDefault();
		isDragging = true;
	}

	function handleDragLeave(e:DragEvent) {
		e.preventDefault();
		isDragging = false;
	}

	function handleDrop(e:DragEvent) {
		e.preventDefault();
		isDragging = false;
		const files = e?.dataTransfer?.files;

		// Process the dropped files
		if(!files?.length) return;
		for (let i = 0; i < files.length; i++) {
			uploadedFiles = [...uploadedFiles, files[i]];
		}
	}
</script>

<p class="text-3xl font-bold underline">Hello world!</p>
<p>{progressEvent}</p>

<h1>Hello and welcome to my site!</h1>
<a href="/about" class="underline hover:text-blue-500">About my site</a>

<!-- <form
	method="post"
	 use:enhance={({ formData }) => {
		formData.append('url', url);
	}}
	enctype="multipart/form-data"
	class="flex flex-col"
> -->
<form on:submit={handleCustomSubmit}>
	<div class="form-control w-full max-w-xs">
		<label class="label" for="pick">
			<span class="label-text" id="pick">Pick a file</span>
		</label>
		<input
			type="file"
			name="no-user-file"
			class="file-input file-input-bordered w-full max-w-xs"
			on:change={(e) => handleUpload(e)}
		/>
	</div>

	<!-- <button type="submit" class="btn mx-auto">Submit</button> -->
	<button type="submit" class="btn" > Custom Submit</button>
</form>

<!-- <button type="button" on:click={deleteS3Item} class="btn">Delete</button> -->
<!-- <button type="button" class="btn" on:click={handleCustomSubmit}> Custom Submit</button> -->
<button type="button" class="btn" on:click={() => console.log('custom form', form)}> log</button>
<progress class="progress progress-accent w-56" value={`${progress}`} max="100" />

<!-- multiple file upload test -->
<!--
<div class="form-control w-full max-w-xs">
	<label class="label" for="pick">
		<span class="label-text" id="pick">Pick a file</span>
	</label>
	<input
		type="file"
		name="test-file"
		class="file-input file-input-bordered w-full max-w-xs"
		on:dragenter={e => handleDragEnter(e)}
		on:dragover={(event) => event.preventDefault()}
		on:dragleave={handleDragLeave}
		on:drop={handleDrop}
		class:dragging={isDragging}
	/>
</div> -->

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
		background-color: theme(colors.gray.300);
	}
</style>
