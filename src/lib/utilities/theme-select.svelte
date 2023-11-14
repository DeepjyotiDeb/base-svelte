<script lang="ts">
	import { onMount } from 'svelte';
	import { themes } from './../themes';

	onMount(() => {
		if (typeof window !== 'undefined') {
			const theme = window.localStorage.getItem('theme');
			if (theme && themes.includes(theme)) {
				document.documentElement.setAttribute('data-theme', theme);
				current_theme = theme;
			}
		}
	});
	let current_theme = 'light';

	const set_theme = () => {
		const theme = window.localStorage.getItem('theme');
		current_theme = theme === 'light' ? 'dark' : 'light';

		const one_year = 60 * 60 * 24 * 365;
		window.localStorage.setItem('theme', current_theme);
		document.cookie = `theme=${current_theme}; max-age=${one_year}; path=/; SameSite=Lax`;
		document.documentElement.setAttribute('data-theme', current_theme);
	};
</script>

<div class="absolute right-2 top-6">
	<button class="btn" on:click={set_theme}>
		{#if current_theme === 'dark'}
			<i class="fa-solid fa-moon" />
		{:else}
			<i class="fa-regular fa-lightbulb" />
		{/if}
	</button>
	<!-- <select
		bind:value={current_theme}
		data-choose-theme
		class="select select-bordered select-primary w-full max-w-3xl text-xl capitalize"
		on:change={set_theme}
	>
		<option value="" disabled={current_theme !== ''}>
			Choose a theme
		</option>
		{#each themes as theme}
			<option value={theme} class="capitalize">{theme}</option>
		{/each}
	</select> -->
</div>
