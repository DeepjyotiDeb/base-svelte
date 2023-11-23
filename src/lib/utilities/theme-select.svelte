<script lang="ts">
	import { onMount } from 'svelte';
	import { themes } from './../themes';
	import sunSvg from '../assets/sun-2-svgrepo-com.svg';

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
		current_theme = theme === 'light' ? 'dracula' : 'light';

		const one_year = 60 * 60 * 24 * 365;
		window.localStorage.setItem('theme', current_theme);
		document.cookie = `theme=${current_theme}; max-age=${one_year}; path=/; SameSite=Lax`;
		document.documentElement.setAttribute('data-theme', current_theme);
	};
</script>

<button class="btn w-14" on:click={set_theme}>
	{#if current_theme === 'dracula'}
		<i class="fa-solid fa-moon" />
	{:else}
		<img src={sunSvg} alt="light-mode" class="h-10" />
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
