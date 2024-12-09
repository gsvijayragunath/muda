<script>
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { isLoggedIn, checkAuth } from "$lib/stores/global.js";

  let isCheckingAuth = true; 
  let userName = "";

  onMount(async () => {
    checkAuth();
    isCheckingAuth = true;

    setTimeout(() => {
      isCheckingAuth = false;

      if (!$isLoggedIn) {
        goto("/signin");
      } else {
        userName = localStorage.getItem("UserName") || "Guest";
        goto("/");
      }
    }, 1000);
  });

  function navigateToProfileCard() {
    goto("/generateprofilecard");
  }

  function navigateToQRCode() {
    goto("/qr-code");
  }
</script>

{#if isCheckingAuth}
  <div class="flex items-center justify-center min-h-screen bg-white text-gray-600">
    <p class="text-xl font-semibold">Loading...</p>
  </div>
{:else}
  <div class="min-h-screen bg-white text-gray-700">
    <div class="pt-12 text-center">
      <h1 class="text-2xl md:text-5xl font-bold text-red-600 animate__animated animate__bounce">
        Welcome, {userName}!
      </h1>
    </div>

    <div class="mt-16 px-6 md:px-20">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Profile Card Container -->
        <div class="bg-blue-100 bg-opacity-75 p-6 rounded-lg shadow-lg hover:scale-105 transition-transform duration-200">
          <h2 class="text-2xl font-semibold mb-4 text-blue-800">Generate Profile Card</h2>
          <p class="text-gray-600 mb-4">
            Create personalized profile cards with ease and style.  
            <br><br>
            <strong>User-Friendly Interface:</strong><br>
            Intuitive design ensures users can create their profile cards quickly without technical knowledge.<br>
            Drag-and-drop features or customizable templates make personalization seamless.  
            <br><br>
            <strong>Customizable Design Options:</strong><br>
            Variety of themes, colors, and layout options for diverse user preferences.<br>
            Options to change typography, colors, borders, and icons.  
            <br><br>
            <strong>Integration with Social Media Platforms:</strong><br>
            Easily link social media handles like Twitter, Instagram, LinkedIn, or Facebook.<br>
            One-click importing of user data to pre-fill profile cards.
          </p>
          <button
            class="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md"
            on:click={navigateToProfileCard}
          >
            Go to Profile Card
          </button>
        </div>
        <!-- QR -->
        <div class="bg-green-100 bg-opacity-75 p-6 rounded-lg shadow-lg hover:scale-105 transition-transform duration-200">
          <h2 class="text-2xl font-semibold mb-4 text-green-800">Generate QR Code</h2>
          <p class="text-gray-600 mb-4">
            Quickly generate QR codes for sharing your data.  
            <br><br>
            <strong class="text-blue-600">Simple Data Sharing:</strong><br>
            Generate QR codes to share contact information, URLs, or other important data instantly.<br>
            Supports a variety of use cases such as sharing website links, event tickets, or user profiles.  
            <br><br>
            <strong class="text-blue-600">Fast and Instant Generation:</strong><br>
            Generate QR codes in just a few clicks with minimal effort.<br>
            Designed for quick access without requiring advanced technical skills.  
            <br><br>
            <strong class="text-blue-600">Customization Options:</strong><br>
            Choose from various QR code designs, colors, and sizes to match branding or personal preferences.<br>
            Customize with logos or icons to create branded, professional-looking QR codes.
          </p>
                    <button
            class="px-4 py-2 bg-green-500 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md"
            on:click={navigateToQRCode}
          >
            Go to QR Code Generator
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  @import "https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css";
</style>  
