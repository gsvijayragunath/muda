<script>
// @ts-nocheck

  import { onMount, onDestroy } from "svelte";
  import { goto } from "$app/navigation";
  import cral from "../../sdk/cral";
  import Loader from "$lib/components/loader.svelte";
  import Popup from "$lib/components/popup.svelte";

  let passwordVisible = false;
  let username = "";
  let password = "";
  let message = "";
  let type = "";
  let showPopup = false;
  let loading = false;
  let hideScrollbar = false;

  function triggerPopup(popupType, popupMessage) {
    type = popupType;
    message = popupMessage;
    showPopup = true;
    setTimeout(() => {
      showPopup = false;
      message = "";
    }, 3000);
  }

  function togglePasswordVisibility() {
    passwordVisible = !passwordVisible;
  }

  function signin() {
    loading = true;
    cral
      .SignIn(username, password)
      .then((response) => {
        loading = false;
        const { token, Email, FullName, UserName, userid, UserType } =
          response.data;

        if (UserType === "Api User") {
          triggerPopup("error", "User not Allowed");
          return;
        }

        localStorage.setItem("token", token);
        localStorage.setItem("Email", Email);
        localStorage.setItem("FullName", FullName);
        localStorage.setItem("UserName", UserName);
        localStorage.setItem("Userid", userid);
        localStorage.setItem("UserType", UserType);

        triggerPopup("success", "Logged in Successfully");
        goto("/");
      })
      .catch((error) => {
        loading = false;
        const errorMessage = error.response?.data?.message || error.message;
        triggerPopup("error", errorMessage);
      });
  }

  onMount(() => {
    hideScrollbar = true;
  });

  onDestroy(() => {
    hideScrollbar = false;
  });
</script>

<div
  class={`flex items-center justify-center min-h-screen bg-white ${hideScrollbar ? "overflow-hidden" : ""}`}
>
  <div class="text-center">
    <h1 class="text-4xl font-bold text-pink-500 mb-8">MUDA</h1>
    <p class="text-lg text-gray-700 mb-6">
      <span class="font-bold">Welcome back!</span> Please sign in to continue.
    </p>
    <div class="bg-white p-8 rounded-lg shadow-md w-96 mx-auto">
      <form on:submit|preventDefault={signin}>
        <div class="mb-4">
          <label
            for="text"
            class="block text-left text-gray-700 mb-2 md:font-bold"
            >Login ID/Email</label
          >
          <input
            type="text"
            id="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            bind:value={username}
          />
        </div>
        <div class="mb-6 relative">
          <label
            for="password"
            class="block text-left text-gray-700 mb-2 md:font-bold"
            >Password</label
          >
          <div
            class="flex items-center border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500"
          >
            {#if passwordVisible}
              <input
                id="password"
                class="w-full px-3 py-2 focus:outline-none"
                bind:value={password}
                type="text"
              />
            {:else}
              <input
                id="password"
                class="w-full px-3 py-2 focus:outline-none"
                bind:value={password}
                type="password"
              />
            {/if}
            <button
              type="button"
              class="px-3 py-2 text-gray-500 focus:outline-none"
              on:click={togglePasswordVisibility}
            >
              <img
                src={passwordVisible ? "/view.png" : "/hide.png"}
                alt="Toggle Password Visibility"
                class="h-5 w-5"
              />
            </button>
          </div>
        </div>
        <button
          type="submit"
          class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Login
        </button>
      </form>
    </div>
  </div>
</div>

{#if showPopup}
  <Popup {message} {type} duration={3000} />
{/if}

<Loader bind:loading />
