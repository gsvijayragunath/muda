
<script>
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { isLoggedIn, checkAuth } from "$lib/stores/global.js";
  
    let isCheckingAuth = true;
  
    onMount(async () => {
      await checkAuth();
      isCheckingAuth = false;
  
      if (!$isLoggedIn) {
        goto("/signin");
      } else {
        // @ts-ignore
        goto("/onlineorders")
      }
    });
  </script>
  
  {#if isCheckingAuth}
    <div class="flex items-center justify-center min-h-screen">
      <p>Loading...</p>
    </div>
  {/if}
  