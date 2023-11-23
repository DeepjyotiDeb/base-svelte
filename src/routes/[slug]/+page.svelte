<script lang="ts">
	import { page } from '$app/stores';
	import DeleteModal from '../../components/DeleteModal.svelte';
	import FileIcon from '../../components/FileIcon.svelte';
	import { invalidateAll } from '$app/navigation';

	export let data: PageData;
	interface PageData {
		dbRes: {
			TTL: number;
			DownloadUrl: string;
			ContentType: string;
			Id: string;
			ShortUrl: string;
			filename: string;
			size: string;
		}[];
	}

	let isCopied = false;
	let objectExpired = false;

	const currentTime = new Date().getTime() + 1 * 1 * 1 * 60 * 1000;
	const TTS = Math.floor(currentTime / 1000);
	if (data?.dbRes && data.dbRes[0].TTL < TTS) {
		objectExpired = true; //* should probably remove from db
	}
	// console.log('data', data);

	const copyToClipboard = async () => {
		// console.log('page', $page);

		await navigator.clipboard.writeText($page?.url.href);
		isCopied = true;
		setTimeout(() => {
			isCopied = false;
		}, 3000);
	};

	const deleteItem = async (Id: string) => {
		try {
			const res = await fetch('api/delete', {
				method: 'POST',
				body: JSON.stringify({ Id, ShortUrl: $page.params.slug })
			});
			invalidateAll();
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
			invalidateAll();
		} catch (error) {
			// console.log('res', error);
		}
	};

	const downloadAll = async () => {
		if (!data?.dbRes) return;
		data?.dbRes.forEach((url) => {
			const iframe = document.createElement('iframe');
			iframe.style.display = 'none';
			iframe.src = url.DownloadUrl;
			document.body.appendChild(iframe);
			setTimeout(() => document.body.removeChild(iframe), 500);
		});
	};

	const triggerModal = () => {
		(document.getElementById('delete_modal') as HTMLDialogElement).showModal();
	};
</script>

<div class="m-2 flex flex-col gap-2">
	{#if !data?.dbRes?.length}
		<div class="text-2xl text-center">No data found... Please check the url</div>
	{:else if objectExpired}
		<p>Object has expired, please upload again</p>
	{:else}
		{#await data?.dbRes then files}
			<div class="my-1 flex gap-1">
				<button class="btn btn-sm normal-case" on:click={downloadAll}>Download All
				<i class="fa-solid fa-download" />
				</button>
				<!-- <button class="btn btn-sm" on:click={triggerModal}>Delete All</button> -->
				<button class="btn btn-sm normal-case" on:click={copyToClipboard}
					>Copy URL
					<i class={`${isCopied ? 'fa-solid fa-check' : 'fa-copy fa-regular'}`} />
				</button>
			</div>
			<p class="mb-4">Note: Items will be expired based on the value set during upload</p>
			<div class="flex md:flex-row flex-col md:flex-wrap md:gap-4 gap-2">

				{#each files as file}
				<div class="card md:w-96 w-80 bg-base-100 shadow-xl image-full">
					<div class="card-body p-4">
						<div class="flex gap-2 items-center">
							<FileIcon ContentType={file.ContentType} />
							<p class="card-title text-base line-clamp-3">{file.filename}</p>
						</div>

						<div class="card-actions justify-end">
							<a href={file.DownloadUrl}>
									<button class="btn p-2">Download</button>
								</a>
						<button class="btn" on:click={() => deleteItem(file.Id)}>
							<i class="fa-solid fa-trash"></i>
						</button>
						</div>
					</div>
				</div>
				{/each}
			</div>
		{/await}
	{/if}

	<DeleteModal {deleteAll} />
</div>
