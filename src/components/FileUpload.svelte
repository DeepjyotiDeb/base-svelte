<!-- FileUpload.svelte -->
<script lang="ts">
	import type {FileUploadProps} from '../lib/fileUploadProps';

    export let props: FileUploadProps
    const {handleDrop, handleFileInput} = props

	const handleDragOver = (event: DragEvent) => {
		event.preventDefault();
	}

</script>

<div
	class="flex items-center justify-center w-full"
	role="button"
	aria-label="File Drop Area. Press Enter to activate"
	tabindex="0"
	on:drop={handleDrop}
	on:dragover={handleDragOver}
	on:dragleave={handleDragOver}
>
	<label
		for="dropzone-file"
		class="flex flex-col items-center justify-center w-full h-52 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-200"
	>
		<div class="flex flex-col items-center justify-center pt-5 pb-6">

            <i class="fa-solid fa-upload text-gray-500"></i>

			<p class="mb-2 text-2xl text-gray-500 dark:text-gray-400">
				<span class="font-semibold">Click to upload</span> or drag and drop
			</p>
			<p class="text-xs text-gray-500 dark:text-gray-400">Click on submit to generate a shareable link for the file</p>
		</div>
		<input id="dropzone-file" type="file" class="hidden" multiple on:change={handleFileInput} />
	</label>
</div>
