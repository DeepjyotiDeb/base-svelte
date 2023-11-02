<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
    console.log('data:', data);
</script>

<p>
	one: {data.one}
</p>
<p>
	two: {data.two}
</p>
<!-- <p>{data.res}</p> -->
<!-- <p>
	three:
	{#await data.streamed.three}
		Loading...
	{:then value}
		{value}
	{:catch error}
		{error.message}
	{/await}
</p> -->