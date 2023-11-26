<script lang="ts">
	import type { FileProps } from '../lib/fileUploadProps';

	export let userFile: FileProps;
	export let removeFile: (id: string) => void;

	interface FileTypeIcons {
		[key: string]: { type: string; value: string };
	}
	const fileTypeIcons: FileTypeIcons = {
		image: { type: 'image', value: 'fa-regular fa-file-image' },
		pdf: { type: 'pdf', value: 'fa-regular fa-file-pdf' },
		sheet: { type: 'sheet', value: 'fa-solid fa-table' },
		csv: { type: 'csv', value: 'fa-solid fa-file-csv' },
		video: { type: 'video', value: 'fa-regular fa-file-video' },
		json: { type: 'json', value: 'fa-regular fa-file-code' },
		zip: { type: 'zip', value: 'fa-regular fa-file-zipper' }
	};

	let icon = { type: 'regular', value: 'fa-regular fa-file' };

	for (const fileType in fileTypeIcons) {
		if (userFile.file.type.includes(fileType)) {
			icon = fileTypeIcons[fileType];
			break;
		}
	}
</script>

<div class="grid grid-cols-12 gap-1 mx-auto w-full sm:w-3/4 mt-4" data-testid="file-object">
	<div class="col-span-1 place-self-center">
		<!-- <i class="fa-regular fa-file-image text-3xl top-1/2 left-1/2" /> -->
		<i class={`${icon.value} text-3xl top-1/2 left-1/2`} />
	</div>
	<div class="sm:col-span-10 col-span-9 flex flex-col">
		<p data-testid="filename">{userFile?.file?.name}</p>
		<p>{userFile?.viewSize}</p>
	</div>
	<div class="sm:col-span-1 col-span-2 self-center">
		<!-- {#if userFile?.loadingProgress === 0} -->
		<!-- <button type="button" class="btn" on:click={handleCustomSubmit}> Upload </button> -->
		{#if userFile?.loadingProgress === 0}
			<div class="tooltip" data-tip="Remove file from list">
				<button
					class="btn btn-circle btn-sm"
					on:click={() => removeFile(userFile.id)}
					data-testid="remove-file"
				>
					<!-- <i class="fa-regular fa-trash-can"></i> -->
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/></svg
					>
				</button>
			</div>
		{/if}
		{#if userFile?.loadingProgress > 0 && userFile?.loadingProgress < 100}
			<div
				class="radial-progress"
				style={`--value:${userFile?.loadingProgress}; --size:3.2rem;`}
				role="progressbar"
			>
				{userFile?.loadingProgress}%
			</div>
		{:else if userFile?.loadingProgress === 100}
			<div class="text-green-500" data-testid="upload-complete">Upload complete</div>
		{/if}
	</div>
</div>
