<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import Logo from '$lib/assets/cat1.webp';
	import DeleteModal from '../../components/DeleteModal.svelte';
	import FileIcon from '../../components/FileIcon.svelte';

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
	<div class="flex md:place-content-center items-center">
		<img src={Logo} alt="logo" class="h-16 w-auto" />
		<div class="text-3xl font-semibold text-center">Stream-Bin!</div>
	</div>

	{#if !data?.dbRes?.length}
		<div class="text-2xl text-center">No data found... Please check the url</div>
	{:else if objectExpired}
		<p>Object has expired, please upload again</p>
	{:else}
		{#await data?.dbRes then files}
			<div class="my-1">
				<button class="btn" on:click={downloadAll}>Download All</button>
				<button class="btn" on:click={triggerModal}>Delete All</button>
				<button class="btn" on:click={copyToClipboard}
					>Copy URL
					<i class={`${isCopied ? 'fa-solid fa-check' : 'fa-copy fa-regular'}`} />
				</button>
			</div>
			<p>Note: Items will be expired based on the value set during upload</p>
			<div class="flex flex-wrap md:gap-4 gap-2">
				{#each files as file}
					<div class="card w-44 md:w-96 md:bg-base-100 shadow-xl image-full">
						<!-- {#if file.ContentType.includes("image")}
					<figure><img src={file.DownloadUrl} alt="user-obj" /></figure>
					{/if} -->
						<div class="card-body p-2 md:p-4 py-6">
							<div class="md:p-2 flex items-center justify-center gap-2">
								<FileIcon ContentType={file.ContentType} />
								<p class="text-ellipsis">{file.filename}</p>
							</div>
							<p class="">{file.size}</p>

							<div class="card-actions flex justify-end items-center">
								<a href={file.DownloadUrl}>
									<button class="btn p-2">Download</button>
								</a>
								<div class="dropdown text-black">
									<!-- svelte-ignore a11y-label-has-associated-control -->
									<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
									<label tabindex="0" class="btn m-1">
										<i class="fa-solid fa-ellipsis-vertical" />
									</label>
									<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
									<ul
										tabindex="0"
										class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
									>
										<!-- svelte-ignore a11y-missing-attribute -->
										<!-- <li ><a>View</a></li> -->
										<!-- svelte-ignore a11y-missing-attribute -->
										<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
										<!-- svelte-ignore a11y-click-events-have-key-events -->
										<li on:click={() => deleteItem(file.Id)}><a>Delete</a></li>
									</ul>
								</div>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/await}
	{/if}

	<DeleteModal {deleteAll} />
</div>
