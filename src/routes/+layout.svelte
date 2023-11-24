<script lang="ts">
	import ThemeSelect from '../components/ThemeSelect.svelte';
	import '../app.css';
	import Logo from '$lib/assets/cat1.webp';
	import InfoModal from '../components/InfoModal.svelte';

	const triggerModal = () => {
		(document.getElementById('info_modal') as HTMLDialogElement).showModal();
	};
</script>

<svelte:head>
	<title>Stream-Bin!</title>
	<meta
		name="keywords"
		content="svelte, easy-to-use, file, files, share, sharing, app, application"
	/>
	<meta name="description" content="Share your files around easily!" />
</svelte:head>

<div class="min-h-screen">
	<InfoModal />
	<div class="flex justify-between items-center mx-2">
		<button class="btn md:block hidden" on:click={triggerModal}>
			<i class="fa-solid fa-circle-info" />
		</button>
		<a href="/" class="md:w-full md:flex md:justify-center">
			<div class="flex md:place-content-center items-center my-2">
				<img src={Logo} alt="logo" class="h-16 w-auto" />
				<div class="text-3xl font-semibold text-center">Stream-Bin!</div>
			</div>
		</a>
		<button class="btn md:hidden block text-lg" on:click={triggerModal}>
			<i class="fa-solid fa-circle-info" />
		</button>
		<ThemeSelect />
	</div>
	<slot />
	<div
		class="sticky top-[100dvh] flex justify-between md:flex-row flex-col items-center my-1 md:mx-4"
	>
		<div>© 2023-2024 Stream-Bin!™. All Rights Reserved.</div>
		<div class="flex gap-2">
			<a href="https://github.com/DeepjyotiDeb" target="_blank">
				<i class="fa-brands fa-github" />
			</a>
			<a href="https://www.linkedin.com/in/deepjyoti-deb-750aa5138/" target="_blank">
				<i class="fa-brands fa-linkedin-in" />
			</a>
		</div>
	</div>
</div>
