<script lang="ts">
	export let ContentType: string;
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
		if (ContentType.includes(fileType)) {
			icon = fileTypeIcons[fileType];
			break;
		}
	}
</script>

<i class={`${icon.value} text-3xl top-1/2 left-1/2`} />
