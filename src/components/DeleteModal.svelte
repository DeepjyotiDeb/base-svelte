<script lang="ts">
    export let deleteAll: () => void
</script>

<dialog id="delete_modal" class="modal">
  <div class="modal-box my-4 flex flex-col gap-4">
    <h3 class="font-bold text-lg text-center">All files will be deleted, Are you sure?</h3>
     <form method="dialog" class="flex gap-2 justify-between">
        <button class="btn btn-error" on:click={deleteAll}>Delete</button>
        <button class="btn">Cancel</button>
      </form>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>