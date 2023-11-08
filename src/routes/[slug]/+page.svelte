<script lang="ts">
	import type { PageData } from './$types';
	import { file } from '../../lib/store';

	export let data: PageData;
	console.log('data', data, new Date().getTime());
	let objectExpired = false;
	// if (data.dbRes?.TTL) {
	// 	console.log('time', data.dbRes.TTL, new Date().getTime() + 1 * 60 * 1000)
	// 	objectExpired = data.dbRes.TTL > new Date().getTime() + 1 * 60 * 1000 ? false : true;
	// }
	// const fileName = extractFileNameFromUrl(data?.PresignedUrl || 'not-found')
</script>

<div>Shared Data:</div>
{#if objectExpired}
<p>Object has expired, please upload again</p>
{:else}
{#await data?.dbRes then value}
	{value?.ViewUrl}
	<img alt='user-upload' src={value?.DownloadUrl}/>
	<p>{value?.ContentType}</p>
{:catch error}
	{error.message}
{/await}
{/if}

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
