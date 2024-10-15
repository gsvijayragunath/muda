<script>
  import { fly } from "svelte/transition";

  export let message = "";
  export let type = "success"; // success or error
  export let duration = 3000;

  let showMessage = true;

  console.log("Popup loaded with message: ", message, " and type: ", type);

  // Automatically hide the popup after the specified duration
  setTimeout(() => {
    showMessage = false;
    console.log("Popup hidden after duration: ", duration);
  }, duration);

  function closeMessage() {
    showMessage = false;
    console.log("Popup manually closed");
  }
</script>

{#if showMessage}
  <div
    class="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 flex justify-center w-full max-w-md"
    transition:fly={{ x: 0, y: -20, duration: 300 }}
  >
    <div
      class="flex items-center px-4 py-2 shadow-md text-white {type === 'success' ? 'bg-green-600' : 'bg-red-600'}"
    >
      <span class="text-lg flex-grow">{message}</span>
      <button class="ml-2" on:click={closeMessage}>
        <img src="./closep.svg" alt="close icon" class="h-7 w-6" />
      </button>
    </div>
  </div>
{/if}
