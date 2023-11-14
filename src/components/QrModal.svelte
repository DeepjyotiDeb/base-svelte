<script lang="ts">
	export let qrImage: string;
</script>

<dialog id="qr_modal" class="modal">
	<div class="modal-box my-4">
		<h3 class="font-bold text-lg text-center">Scan the code and head over to the link!</h3>
		<img alt="qr-code" src={qrImage} class="m-auto" />
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>
