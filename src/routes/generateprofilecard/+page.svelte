<script>
  // @ts-nocheck 
  import cral from "../../sdk/cral";
  import Popup from "$lib/components/popup.svelte";

  let formData = {
    email: "",
    full_name: "",
    user_name: "",
    phone_number: "",
    location: "",
    website: "",
    bio: "",
  };

  let error = "";
  let successMessage = "";
  let avatarImage = ""; 
  let displayName = "";
  let displayLocation = "";
  let displayBio = "";
  let isLoading = false;
  let type = ""
  let showPopup = false;
  let message = ""

  function triggerPopup(popupType, popupMessage) {
      type = popupType;
      message = popupMessage;
      showPopup = true;
      setTimeout(() => {
        showPopup = false;
        message = "";
      }, 3000);
    }

  const resetFormData = () => {
    formData = {
      email: "",
      full_name: "",
      user_name: "",
      phone_number: "",
      location: "",
      website: "",
      bio: "",
    };
  };

  const submitForm = async () => {
    error = "";
    successMessage = "";
    avatarImage = "";
    isLoading = true;

    try {
      const response = await cral.CreateProfileCard(formData);
      // console.log(response);
      const data = response;
      avatarImage = data.data.image_url;
      displayName = data.data.json_details?.entry?.[0]?.displayName || data.data.form_details.user_name;
      displayLocation = data.data.json_details?.entry?.[0]?.currentLocation || data.data.form_details.location;
      displayBio = data.data.json_details?.entry?.[0]?.aboutMe || data.data.form_details.bio;
      formData.user_name = displayName;

      resetFormData();
      triggerPopup("success","Profile card generated successfully")
    } catch (err) {
      console.error(err);
      triggerPopup("error",err)
    } finally {
      isLoading = false;
    }
  };
</script>

  <main class="max-w-5xl mx-auto p-6 ">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Form Section -->
      <div class="bg-gray-100 p-8 rounded-lg shadow-xl space-y-6">
        <form on:submit|preventDefault={submitForm} class="space-y-6">
          <div class="space-y-4">
            <div>
              <label for="email" class="block text-xl  text-black">
                Email Address:<span class="text-red-600">*</span>
              </label>
              <input
                id="email"
                type="email"
                bind:value={formData.email}
                placeholder="Enter your email"
                required
                class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-200"
              />
            </div>
  
            <div>
              <label for="fullName" class="block text-xl  text-black">
                Full Name:<span class="text-red-600">*</span>
              </label>
              <input
                id="fullName"
                type="text"
                bind:value={formData.full_name}
                required
                placeholder="Enter your full name"
                class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-200"
              />
            </div>
  
            <div>
              <label for="username" class="block text-xl  text-black">
                Username:<span class="text-red-600">*</span>
              </label>
              <input
                id="username"
                type="text"
                bind:value={formData.user_name}
                required
                placeholder="Enter your username"
                class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-200"
              />
            </div>
  
            <div>
              <label for="phoneNumber" class="block text-xl  text-black">
                Phone Number:<span class="text-red-600">*</span>
              </label>
              <input
                id="phoneNumber"
                type="tel"
                required
                bind:value={formData.phone_number}
                placeholder="Enter your phone number"
                class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-200"
              />
            </div>
  
            <div>
              <label for="location" class="block text-xl text-black">
                Location (City, Country):<span class="text-red-600">*</span>
              </label>
              <input
                id="location"
                type="text"
                required
                bind:value={formData.location}
                placeholder="Enter your city and country"
                class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-200"
              />
            </div>
  
            <div>
              <label for="website" class="block text-xl  text-black">
                Personal Website or Social Profile URL:
              </label>
              <input
                id="website"
                type="url"
                bind:value={formData.website}
                placeholder="Enter your website or social profile URL"
                class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-200"
              />
            </div>
  
            <div>
              <label for="bio" class="block text-xl  text-black">
                Bio/Short Description:<span class="text-red-600">*</span>
              </label>
              <textarea
                id="bio"
                required
                bind:value={formData.bio}
                placeholder="Enter a short bio or description"
                class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-200"
              ></textarea>
            </div>
          </div>
  
          <button
            type="submit"
            class="w-full py-2 mt-6 bg-blue-600 text-black rounded-md hover:bg-blue-700 focus:ring-4 focus:ring-blue-500"
          >
            Submit
          </button>
        </form>
      </div>
  
      <!-- Gravatar Profile Preview -->
      <div class="bg-gradient-to-r from-teal-500 to-blue-500 p-8 rounded-lg shadow-xl space-y-8">
        {#if isLoading}
          <div class="flex justify-center items-center">
            <span class="mr-2 text-black">Creating Profile Card...</span>
            <div class="spinner"></div>
          </div>
        {:else if avatarImage}
          <div class="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <div class="flex justify-end px-4 pt-4"></div>
            <div class="flex flex-col items-center pb-10">
              <img class="w-24 h-24 mb-3 rounded-full shadow-lg" src={avatarImage} alt="Avatar" />
              <h5 class="mb-1 text-2xl font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500 text-center">{displayName}</h5>
              <span class="text-lg text-gray-500 dark:text-gray-400 text-center">{displayLocation}</span>
              <p class="text-lg text-gray-500 dark:text-gray-400 text-center mt-2">{displayBio}</p>
            </div>
          </div>
        {:else}
          <div class="text-center text-white">
            <h2 class="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 via-blue-800 to-purple-700 text-transparent bg-clip-text">Welcome!</h2>
            <p class="text-2xl text-black">Please fill in your details to get your profile card.</p>
          </div>
        {/if}
      </div>
    </div>
  </main>
  
  {#if showPopup}
  <Popup {message} {type} duration={3000} />
{/if}
   