<script lang="ts">
	import type { PageData } from './$types';
	import {page} from '$app/stores';
	import Logo from '$lib/assets/cat1.webp';

	export let data: PageData;
	let isCopied = false;
	console.log('data', data.dbRes);

	let objectExpired = false;

	const copyToClipboard = async () => {
		console.log('page', $page)

		 await navigator.clipboard.writeText($page?.url.href);
		 isCopied = true;
		 setTimeout(() => {
			isCopied = false
		 }, 3000);
	};

	// if (data.dbRes?.TTL) {
	// 	console.log('time', data.dbRes.TTL, new Date().getTime() + 1 * 60 * 1000)
	// 	objectExpired = data.dbRes.TTL > new Date().getTime() + 1 * 60 * 1000 ? false : true;
	// }
	// const fileName = extractFileNameFromUrl(data?.PresignedUrl || 'not-found')
</script>

<div class="m-2 flex flex-col gap-2">
	<div class="flex place-content-center items-center">
		<img src={Logo} alt="logo" class="h-16 w-auto" />
		<div class="text-3xl font-semibold text-center">Stream-Bin!</div>
	</div>
	{#if objectExpired}
		<p>Object has expired, please upload again</p>
	{:else}
		{#await data?.dbRes then value}
			<button type="button" class="btn block mx-auto" on:click={copyToClipboard}>Copy Link
			{#if isCopied}
				<i class="fa-solid fa-check text-xl ml-1"></i>
				{:else}
				<i class="fa-solid fa-copy text-xl ml-1"></i>
			{/if}
			</button>

			<div class="flex justify-center items-center gap-4">
				{#if value?.ContentType === 'image/jpeg'}
					<img alt="user-upload" src={value?.DownloadUrl} class="h-[75vh] w-auto" />
				{/if}
				<div>
					<a href={value?.ViewUrl} class="">
						<button class="btn m-auto block mt-4">Download
							<i class="fa-solid fa-download text-xl"></i>
						</button>
					</a>
					<div class="text-center">Content Type : {value?.ContentType}</div>
				</div>
			</div>
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
