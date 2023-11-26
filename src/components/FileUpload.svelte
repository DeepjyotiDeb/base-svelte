<!-- FileUpload.svelte -->
<script lang="ts">
	export let handleFileInput: (e: any) => void;

	const handleDragOver = (event: DragEvent) => {
		event.preventDefault();
	};
</script>

<div
	class="flex items-center justify-center w-full"
	role="button"
	aria-label="File Drop Area. Press Enter to activate"
	tabindex="0"
	on:drop={handleFileInput}
	on:dragover={handleDragOver}
	on:dragleave={handleDragOver}
>
	<label
		for="dropzone-file"
		class="flex flex-col items-center justify-center w-full h-52 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-gray-100 hover:border-4 transition-all
		text-gray-500 dracula:text-gray-400"
		data-testid="file-upload"
		id="file-upload"
	>
		<div class="flex flex-col items-center justify-center pt-5 pb-6">
			<i class="fa-solid fa-upload text-gray-500 text-xl" />

			<p class="mb-2 sm:text-2xl text-lg text-gray-500 dark:text-gray-400">
				<span class="font-semibold select-none">Click/Tap to browse</span> or drag and drop
			</p>
			<p class="text-sm mx-3 text-gray-500 dark:text-gray-400">
				Click on upload to generate a shareable link for the file
			</p>
		</div>
		<input
			data-testid="dropzone-file"
			id="dropzone-file"
			type="file"
			class="hidden"
			multiple
			on:change={handleFileInput}
		/>
	</label>
</div>
