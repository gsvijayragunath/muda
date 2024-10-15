<script>
    // @ts-nocheck
    import Appbar from "$lib/components/appbar.svelte";
    import Sidebar from "$lib/components/sidebar.svelte";
    import { onMount } from "svelte";
    import { isLoggedIn, checkAuth } from "$lib/stores/global.js";
    import { goto } from "$app/navigation";
    import "../app.css";
  
    let username = "";
    let email = "";
    let isMenuOpen = false;
    let usertype = "";
    let sidebarItems = [];
    let adminItems = [];
  
    // Predefined sidebar and admin items
    const allSidebarItems = [
      { text: "Online Orders", link: "/onlineorders" },
      { text: "Stocks Levels", link: "/stocklevels" },
      { text: "Business Partners", link: "/businesspartner" },
    ];
    const allAdminItems = [
      { text: "Items", link: "/items" }
    ];
  
    let loading = true; // Add loading state to wait for auth check
  
    $: loggedIn = $isLoggedIn; // Reactive statement to track login status
  
    onMount(async () => {
      console.log("Checking authentication...");
      await checkAuth(); // Ensure this is awaited to prevent race conditions
  
      if (!$isLoggedIn) {
        console.log("Redirecting to /signin...");
        goto("/signin");
      } else {
        // Fetch user details only if logged in
        username = localStorage.getItem("UserName") || "";
        email = localStorage.getItem("Email") || "";
        if (username) {
          username = username[0].toUpperCase();
        }
  
        const userType = localStorage.getItem("UserType");
        if (userType === "Admin" || userType === "Super Admin") {
          usertype = userType;
          sidebarItems = allSidebarItems;
          adminItems = allAdminItems;
        } else {
          // If the user is a "Normal User", only pass "Online Orders"
          usertype = "Normal User";
          sidebarItems = [{ text: "Online Orders", link: "/onlineorder" }];
          adminItems = []; // No admin items for normal users
        }
      }
  
      loading = false; // Mark loading as complete
    });
  
    function toggleSidebar() {
      isMenuOpen = !isMenuOpen;
    }
  </script>
  
  {#if loading}
    <!-- Show a loader while checking authentication -->
    <div class="flex h-screen justify-center items-center">
      <p>Loading...</p>
    </div>
  {:else if loggedIn}
    <!-- Render only if the user is logged in -->
    <div class="flex h-screen">
      <Sidebar {isMenuOpen} {sidebarItems} {usertype} {adminItems} />
      <div
        class={`flex-1 flex flex-col transition-all duration-300 ${isMenuOpen ? "ml-64" : ""}`}
      >
        <div class="flex-1 p-4">
          <Appbar {toggleSidebar} {isMenuOpen} {username} {email} />
          <slot />
        </div>
      </div>
    </div>
  {:else}
    <div class="flex-1 p-4">
      <slot />
    </div>
  {/if}
  