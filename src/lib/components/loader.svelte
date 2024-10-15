<script>
    export let loading = false;
  </script>
  
  {#if loading}
    <div class="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
      <div class="w-16 h-16 border-4 border-blue-500 border-solid border-t-transparent rounded-full animate-spin"></div>
    </div>
  {/if}
  

  