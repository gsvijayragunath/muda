<script>
    // @ts-nocheck
    import { goto } from "$app/navigation";
    import cral from "../../sdk/cral";
    import Loader from "$lib/components/loader.svelte";
    import Popup from "$lib/components/popup.svelte";
  
    let formData = {
      name: "",
      email: "",
      country:"",
      user_type:"",
      password: "",
    };
  
    let confirmPassword = "";
    let passwordVisible = false;
    let confirmPasswordVisible = false;
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
  
    function toggleConfirmPasswordVisibility() {
      confirmPasswordVisible = !confirmPasswordVisible;
    }
  
    function signup() {
      if (formData.password !== confirmPassword) {
        triggerPopup("error", "Passwords do not match.");
        return;
      }

      console.log(formData)
      loading = true;
      cral
        .SignUp(formData)
        .then((response) => {
          loading = false;
          triggerPopup("success", "Account created successfully. Redirecting to login...");
          loading = true
          setTimeout(() => {
            goto("/signin")
            loading = false;
          }, 3000);
        })
        .catch((error) => {
          console.error(error);
          loading = false;
          const errorMessage = error.response?.data?.error?.message || error.message;
          triggerPopup("error", errorMessage);
        });
    }
  
    function navigateToLogin() {
      goto("/login");
    }
  </script>
  
  <div
    class={`flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-white ${hideScrollbar ? "overflow-hidden" : ""}`}
  >
    <div class="w-full sm:w-[400px] bg-white p-8 shadow-lg transition-all duration-300 ease-in-out">
      <h1 class="text-3xl md:text-4xl font-extrabold text-pink-500 text-center mb-4">EFFY-GRAVATAR</h1>
      <p class="text-black text-2xl text-center mb-10 font-semibold">
        Create your account to access the dashboard.
      </p>
      <form on:submit|preventDefault={signup}>

        <div class="mb-4">
          <label class="block text-xl font-medium text-gray-700 mb-1" for="username">Fullname</label>
          <input
            type="text"
            id="username"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter your Fullname"
            required
            bind:value={formData.name}
          />
        </div>
  
        <div class="mb-4">
          <label class="block text-xl font-medium text-gray-700 mb-1" for="email">Email</label>
          <input
            type="email"
            id="email"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter your email"
            required
            bind:value={formData.email}
          />
        </div>
        <div class="mb-4">
          <label class="block text-xl font-medium text-gray-700 mb-1" for="email">Country</label>
          <input
            type="country"
            id="country"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter your Country"
            required
            bind:value={formData.country}
          />
        </div>
        <div class="mb-4">
          <label class="block text-xl font-medium text-gray-700 mb-1" for="user-type">User Type</label>
          <select
            id="user-type"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
            bind:value={formData.user_type}
          >
            <option value="" disabled selected hidden>Select user type</option>
            <option value="user">User</option>
          </select>
        </div>  
  
        <div class="mb-4 relative">
          <label class="block text-xl font-medium text-gray-700 mb-1" for="password">Password</label>
          <div class="flex items-center border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-400">
            {#if passwordVisible}
              <input
                type="text"
                id="password"
                class="w-full px-3 py-2 focus:outline-none"
                required
                bind:value={formData.password}
                placeholder="Enter your password"
              />
            {:else}
              <input
                type="password"
                id="password"
                class="w-full px-3 py-2 focus:outline-none"
                required
                bind:value={formData.password}
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
  
        <div class="mb-4 relative">
          <label class="block text-xl font-medium text-gray-700 mb-1" for="confirmPassword">Confirm Password</label>
          <div class="flex items-center border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-400">
            {#if confirmPasswordVisible}
              <input
                type="text"
                id="confirmPassword"
                class="w-full px-3 py-2 focus:outline-none"
                required
                bind:value={confirmPassword}
                placeholder="Confirm your password"
              />
            {:else}
              <input
                type="password"
                id="confirmPassword"
                class="w-full px-3 py-2 focus:outline-none"
                required
                bind:value={confirmPassword}
                placeholder="Confirm your password"
              />
            {/if}
            <button
              type="button"
              class="px-3 py-2 text-sm text-blue-600 hover:text-blue-800 transition-all"
              on:click={toggleConfirmPasswordVisibility}
            >
              {confirmPasswordVisible ? "Hide" : "Show"}
            </button>
          </div>
        </div>
  
        <button
          type="submit"
          class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-all duration-200 ease-in-out focus:outline-none"
        >
          Sign Up
        </button>
      </form>
  
      <p class="text-center mt-4">
        Already have an account?
        <button
          class="text-blue-600 hover:underline"
          on:click={navigateToLogin}
        >
          Log in
        </button>
      </p>
    </div>
  </div>
  
  {#if showPopup}
    <Popup {message} {type} duration={3000} />
  {/if}
  <Loader bind:loading />
  