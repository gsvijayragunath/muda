<script>
    // @ts-nocheck
    import Appbar from "$lib/components/appbar.svelte";
    import Sidebar from "$lib/components/sidebar.svelte";
    import { onMount } from "svelte";
    import { isLoggedIn, checkAuth } from "$lib/stores/global.js";
    import { goto } from "$app/navigation";
    import "../app.css";
    import { text } from "@sveltejs/kit";
  
    let username = "";
    let email = "";
    let isMenuOpen = false;
    let usertype = "";
    let sidebarItems = [];
    let adminItems = [];

  
    let loading = true; 
  
    $: loggedIn = $isLoggedIn; 
  
    onMount(async () => {
      console.log("Checking authentication...");
      await checkAuth(); 
  
      if (!$isLoggedIn) {
        goto("/signin");
      } else {
        username = localStorage.getItem("UserName") || "";
        email = localStorage.getItem("Email") || "";
        if (username) {
          username = username[0].toUpperCase();
        }
          sidebarItems = [{text:"Home",link:"/"},{ text: "Profile Cards", link: "/generateprofilecard" },{text:"QR Code",link:"/qrcode"}];
          adminItems = [];
        }
      loading = false;
    });
  
    function toggleSidebar() {
      isMenuOpen = !isMenuOpen;
    }
  </script>
  
  {#if loading}
    <div class="flex h-screen justify-center items-center">
      <p>Loading...</p>
    </div>
  {:else if loggedIn}
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
  