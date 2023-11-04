<script lang="ts">
	import {enhance} from '$app/forms';

  const authorizedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
</script>

<p class="text-3xl font-bold underline">
  Hello world!
</p>

<h1>Hello and welcome to my site!</h1>
<a href="/about" class="underline hover:text-blue-500">About my site</a>

<form method="post" use:enhance enctype="multipart/form-data" class="flex flex-col" on>
  <div class="form-control w-full max-w-xs">
    <label class="label" for="pick">
      <span class="label-text" id="pick">Pick a file</span>
    </label>
    <input type="file" class="file-input file-input-bordered w-full max-w-xs" accept={authorizedExtensions.join(',')}/>
  </div>

  <button type="submit" class="btn mx-auto">Submit</button>
</form>

<style lang="postcss">
   :global(html) {
    background-color: theme(colors.gray.300);
  }
</style>