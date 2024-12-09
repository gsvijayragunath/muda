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
              const { token, user_name, user_id, user_type, email } = response.data.data;

              localStorage.setItem("token", token);
              localStorage.setItem("UserName", user_name);
              localStorage.setItem("Userid", user_id);
              localStorage.setItem("UserType", user_type);
              localStorage.setItem("Email", email);

              triggerPopup("success", "Logged in Successfully");
              goto("/");
          })
          .catch((error) => {
              console.error(error);
              loading = false;
              const errorMessage = error.response?.data?.error?.message || error.message;
              triggerPopup("error", errorMessage);
          });
  }

  onMount(() => {
      hideScrollbar = true;
  });

  onDestroy(() => {
      hideScrollbar = false;
  });

  function navigateToSignup() {
      goto("/signup");
  }
</script>

<div
  class={`flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-white ${hideScrollbar ? "overflow-hidden" : ""}`}
>
  <div class="w-full sm:w-[400px] bg-white p-8 shadow-lg transition-all duration-300 ease-in-out">
      <h1 class="text-3xl md:text-4xl font-extrabold text-pink-500 text-center mb-4">EFFY-GRAVATAR</h1>
      <p class="text-black text-2xl text-center mb-10 font-semibold">
          Sign in to access your profile dashboard.
      </p>
      <form on:submit|preventDefault={signin}>
          <div class="mb-4">
              <label class="block text-xl font-medium text-gray-700 mb-1" for="username">Email</label>
              <input
                  type="text"
                  id="username"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter your email"
                  required
                  bind:value={username}
              />
          </div>

          <div class="mb-4 relative">
              <label class="block text-xl font-medium text-gray-700 mb-1" for="password">Password</label>
              <div class="flex items-center border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-400">
                  {#if passwordVisible}
                      <input
                          type="text"
                          class="w-full px-3 py-2 focus:outline-none"
                          required
                          bind:value={password}
                          placeholder="Enter your password"
                      />
                  {:else}
                      <input
                          type="password"
                          class="w-full px-3 py-2 focus:outline-none"
                          required
                          bind:value={password}
                          placeholder="Enter your password"
                      />
                  {/if}
                  <button
                      type="button"
                      class="px-3 py-2 text-sm text-blue-600 hover:text-blue-800 transition-all"
                      on:click={togglePasswordVisibility}
                  >
                      {passwordVisible ? "Hide" : "Show"}
                  </button>
              </div>
          </div>
          <button
              type="submit"
              class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-all duration-200 ease-in-out focus:outline-none"
          >
              Login
          </button>
      </form>

      <p class="text-center mt-4">
          Don't have an account? 
          <button 
              class="text-blue-600 hover:underline" 
              on:click={navigateToSignup}
          >
              Create new account
          </button>
      </p>
  </div>
</div>

{#if showPopup}
  <Popup {message} {type} duration={3000} />
{/if}
<Loader bind:loading />
