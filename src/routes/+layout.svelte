<script lang="ts">
	import ThemeSelect from '$lib/utilities/theme-select.svelte';
	import '../app.css';
	import Logo from '$lib/assets/cat1.webp';
	import InfoModal from '../components/InfoModal.svelte';

	const triggerModal = () => {
		(document.getElementById('info_modal') as HTMLDialogElement).showModal();
	};
</script>

<svelte:head>
	<title>Stream-Bin!</title>
	<meta name="keywords" content="svelte, easy, file, share, service" />
	<meta name="description" content="Share your files around easily!" />
</svelte:head>

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
<InfoModal />
<slot />
