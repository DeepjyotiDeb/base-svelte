<script lang="ts">
	import type { PageData } from './$types';
	import {extractFileNameFromUrl} from '../../lib/utilities/generateFilename';
	import {file} from '../../lib/store';

	export let data: PageData;
	const { dbRes } = data;

    const fileName = extractFileNameFromUrl(dbRes?.PresignedUrl || 'not-found')

</script>

<div>Shared Data:</div>

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
{/if}
