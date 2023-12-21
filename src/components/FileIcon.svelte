<script lang="ts">
	// Import the SVG components
	import SpreadSheetIcon from '$lib/assets/icons/sheet.svg?component';
	import SpreadSheetOutlineIcon from '$lib/assets/icons/sheetOutline.svg?component';
	import ImageIcon from '$lib/assets/icons/image.svg?component';
	import VideoIcon from '$lib/assets/icons/video.svg?component';
	import DefaultIcon from '$lib/assets/icons/fileOutline.svg?component';
	import PdfIcon from '$lib/assets/icons/pdf.svg?component';
	import JsonIcon from '$lib/assets/icons/json.svg?component';
	import ZipIcon from '$lib/assets/icons/zip.svg?component';
	import CsvIcon from '$lib/assets/icons/csv.svg?component';
	import type { ComponentType, SvelteComponent } from 'svelte';
	// ... import other SVG components similarly

	export let ContentType: string;

	const iconComponents: { [key: string]: ComponentType<SvelteComponent> } = {
		sheet: SpreadSheetIcon,
		image: ImageIcon,
		video: VideoIcon,
		pdf: PdfIcon,
		json: JsonIcon,
		zip: ZipIcon,
		csv: CsvIcon
	};

	const contentTypeKeys = Object.keys(iconComponents);
	const matchingContentType = contentTypeKeys.find((type) => ContentType.includes(type));

	const iconComponent = matchingContentType ? iconComponents[matchingContentType] : DefaultIcon;
</script>

<svelte:component this={iconComponent} class="text-6xl" />
