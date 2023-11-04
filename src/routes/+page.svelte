<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	export let form: ActionData;
	let file: File;
	// if(form?.success){
	//   console.log('form', form)
	// }
	// console.log('form', form?.name)

	const authorizedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.mp4', '.pdf'];
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
		console.log('url:', url, file);
		const res = await fetch(url, {
			method: 'PUT',
			body: file
		});
		console.log('res', res);
	};

	const deleteS3Item = async () => {
		const res = await fetch('/api/delete', { method: 'post' });
		console.log('res', res);
	};
</script>

<p class="text-3xl font-bold underline">Hello world!</p>

<h1>Hello and welcome to my site!</h1>
<a href="/about" class="underline hover:text-blue-500">About my site</a>

<form
	method="post"
	use:enhance={({ formData }) => {
		formData.append('url', url);
	}}
	enctype="multipart/form-data"
	class="flex flex-col"
>
	<div class="form-control w-full max-w-xs">
		<label class="label" for="pick">
			<span class="label-text" id="pick">Pick a file</span>
		</label>
		<input
			type="file"
			name="no-user-file"
			class="file-input file-input-bordered w-full max-w-xs"
			accept={authorizedExtensions.join(',')}
			on:change={(e) => handleUpload(e)}
		/>
	</div>

	<button type="submit" class="btn mx-auto">Submit</button>
</form>

<button type="button" on:click={deleteS3Item} class="btn">Delete</button>
<button type="button" class="btn" on:click={handleCustomSubmit}> Custom Submit</button>
{#if form?.success}
	{#if typeof form?.url === 'string'}
		{#if file?.type.includes('image')}
			<img alt="user-media" src={form?.url.split('?')[0]} />
		{/if}
		{#if file?.type.includes('pdf')}
			<object data={form?.url.split('?')[0]} type="application/pdf" title={file.name}>
				<p>unable to display file</p>
			</object>
		{/if}
		{#if file?.type.includes('video')}
			<video controls width="250">
				<source src={form?.url.split('?')[0]} type="video/webm" />
				<track kind="captions" />
			</video>
		{/if}
		<button type="button" class="button">
			<a href={form?.url.split('?')[0]} download={file?.name} target="_blank" > download </a>
		</button>
	{/if}
{/if}

<img alt="user-media" src={url.split('?')[0]} />

<style lang="postcss">
	:global(html) {
		background-color: theme(colors.gray.300);
	}
</style>
