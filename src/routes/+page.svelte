<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	export let form: ActionData;

	// if(form?.success){
	//   console.log('form', form)
	// }
	// console.log('form', form?.name)

	const authorizedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.mp4'];
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
		}
	};

	// const handleSubmit = async() => {
	//   if(!presignedUrl.length && !(typeof file === 'undefined')) return;
	//   const formData = new FormData();
	//   formData.append('file', file);
	//   const res = await fetch('/api/upload', {
	//     method: 'POST',
	//     body:
	//   })
	// }

  const deleteS3Item = async () => {
    const res = await fetch('/api/delete', {method: 'post'})
    console.log('res', res)
  }
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

{#if form?.success}
	<p>{form?.url}</p>

	{#if typeof form?.url === 'string'}
		<img alt="user-media" src={form?.url} />
	{/if}
{/if}

<style lang="postcss">
	:global(html) {
		background-color: theme(colors.gray.300);
	}
</style>
