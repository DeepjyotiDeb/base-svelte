<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import Logo from '$lib/assets/cat1.webp';

	export let data: PageData;
	let isCopied = false;
	console.log('data', data);

	let objectExpired = false;

	const copyToClipboard = async () => {
		// console.log('page', $page);

		await navigator.clipboard.writeText($page?.url.href);
		isCopied = true;
		setTimeout(() => {
			isCopied = false;
		}, 3000);
	};

	// if (data.dbRes?.TTL) {
	// 	console.log('time', data.dbRes.TTL, new Date().getTime() + 1 * 60 * 1000)
	// 	objectExpired = data.dbRes.TTL > new Date().getTime() + 1 * 60 * 1000 ? false : true;
	// }
	// const fileName = extractFileNameFromUrl(data?.PresignedUrl || 'not-found')
	const deleteItem = async (Id: string) => {
		try {
			const res = await fetch('api/delete', {
				method: 'POST',
				body: JSON.stringify({ Id, ShortUrl: $page.params.slug })
			});
			console.log('res', res);
		} catch (error) {
			console.log('res', error);
		}
	};

	const deleteAll = async () => {
		const Ids = data.dbRes?.map((item) => item.Id);
		// console.log('ids', ids);
		try {
			const res = await fetch('api/delete-all', {
				method: 'POST',
				body: JSON.stringify({ ShortUrl: $page.params.slug, Ids })
			});
			console.log('res', res);
		} catch (error) {
			// console.log('res', error);
		}
	};
</script>

<div class="m-2 flex flex-col gap-2">
	<div class="flex place-content-center items-center">
		<img src={Logo} alt="logo" class="h-16 w-auto" />
		<div class="text-3xl font-semibold text-center">Stream-Bin!</div>
	</div>

	<div class="card card-compact w-96 bg-base-100 shadow-xl">
  <figure><img src={data.dbRes && data.dbRes[0].DownloadUrl} alt="user-obj" class="max-w-xs h-[10vh]"/></figure>
  <div class="card-body">
    <h2 class="card-title">Shoes!</h2>
    <p>If a dog chews shoes whose shoes does he choose?</p>
    <div class="card-actions justify-end">
      <button class="btn btn-primary">Buy Now</button>
    </div>
  </div>
</div>
	{#if !data?.dbRes?.length}
		<div class="text-2xl text-center">No data found... Please check the url</div>
	{:else if objectExpired}
		<p>Object has expired, please upload again</p>
	{:else}
		{#await data?.dbRes then value}
			<div class="flex justify-center gap-2">
				<button type="button" class="btn" on:click={copyToClipboard}
					>Copy Link
					{#if isCopied}
						<i class="fa-solid fa-check text-xl ml-1" />
					{:else}
						<i class="fa-solid fa-copy text-xl ml-1" />
					{/if}
				</button>
				<button type="button" class="btn" on:click={deleteAll}>delete all</button>
			</div>
			{#each data?.dbRes as value}
				<div class="flex justify-center items-center gap-4">
					{#if value?.ContentType === 'image/jpeg'}
						<img alt="user-upload" src={value?.DownloadUrl} class="h-[75vh] w-auto" />
					{/if}
					<div>
						<a href={value?.ViewUrl} class="">
							<button class="btn m-auto block mt-4"
								>Download
								<i class="fa-solid fa-download text-xl" />
							</button>
						</a>
						<div class="text-center">Content Type : {value?.ContentType}</div>
					</div>
				</div>
				<p>File: {value?.filename}</p>
				<button type="button" class="btn" on:click={() => deleteItem(value?.Id)}>delete</button>
			{/each}
		{:catch error}
			{error.message}
		{/await}
	{/if}
</div>
<!--
{#if dbRes}
	{#if dbRes.ContentType.includes('image')}
		<img alt="user-media" src={dbRes?.PresignedUrl} />
	{/if}
	{#if dbRes.ContentType.includes('pdf')}
		<object
			data={dbRes?.PresignedUrl}
			type="application/pdf"
			title={fileName}
		>
			<p>unable to display file</p>
		</object>
	{/if}
	{#if dbRes.ContentType.includes('video')}
		<video controls width="250">
			<source src={dbRes.PresignedUrl} type="video/webm" />
			<track kind="captions" />
		</video>
	{/if}
	<button type="button" class="button">
		<a href={dbRes.PresignedUrl} download={fileName}> download </a>
	</button>
{/if} -->


