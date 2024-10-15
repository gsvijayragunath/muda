<script>
  // @ts-nocheck

  import { goto } from "$app/navigation";
  import { page } from "$app/stores"; // Importing to track current page
  let currentUrl;

  export let isMenuOpen; // Get the sidebar visibility state
  export let sidebarItems = [];
  export let adminItems = [];
  export let usertype = ""; // Fetch the usertype from the parent component

  // Subscribe to the current page URL to track active route
  $: {
    const unsubscribe = page.subscribe(($page) => {
      currentUrl = $page.url.pathname; // Get the current route
    });
  }

  // Function to handle navigation and update active item
  function handleNavigation(item) {
    goto(item.link);
    currentUrl = item.link; // Update the active URL after clicking
  }
</script>

<!-- Sidebar -->
<div
  class={`fixed top-0 left-0 h-full bg-white shadow-lg transition-transform duration-300 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
  style="width: 256px;"
>
  <div class="p-6 text-center">
    <h1 class="text-pink-500 text-2xl font-bold">MUDA</h1>
  </div>
  <div class="px-6">
    <h2 class="text-gray-500 text-xs font-semibold mb-2">MAIN MENU</h2>
    <ul class="space-y-2">
      {#each sidebarItems as item}
        <li
          class={`text-gray-700 cursor-pointer p-2  
            ${currentUrl === item.link ? "bg-[#5556FD] text-white" : "hover:bg-[#5556FD] hover:text-white"}`}
          on:click={() => handleNavigation(item)}
        >
          {item.text}
        </li>
      {/each}
    </ul>
  </div>

  {#if usertype == "Admin" || usertype == "Super Admin"}
    <div class="px-6 mt-6">
      <h2 class="text-gray-500 text-xs font-semibold mb-2">ADMINISTRATOR</h2>
      <ul class="space-y-2">
        {#each adminItems as item}
          <li
            class={`text-gray-700 cursor-pointer p-2 rounded 
              ${currentUrl === item.link ? "bg-[#5556FD] text-white" : "hover:bg-[#5556FD] hover:text-white"}`}
            on:click={() => handleNavigation(item)}
          >
            {item.text}
          </li>
        {/each}
      </ul>
    </div>
  {/if}
</div>
