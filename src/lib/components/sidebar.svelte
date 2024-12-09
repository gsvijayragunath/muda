<script>
  // @ts-nocheck

  import { goto } from "$app/navigation";
  import { page } from "$app/stores"; // Importing to track current page
  let currentUrl;

  export let isMenuOpen; 
  export let sidebarItems = [];

  $: {
    const unsubscribe = page.subscribe(($page) => {
      currentUrl = $page.url.pathname; 
    });
  }

  function handleNavigation(item) {
    goto(item.link);
    currentUrl = item.link; 
  }
</script>

<div
  class={`fixed top-0 left-0 h-full bg-white shadow-lg transition-transform duration-300 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
  style="width: 256px;"
>
  <div class="p-6 text-center">
    <h1 class="text-red-500 text-2xl font-bold">MENU</h1>
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
</div>
