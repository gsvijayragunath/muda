<script>
  // @ts-nocheck

  import cral from "../../sdk/cral";
  import Popup from "$lib/components/popup.svelte";
  import Loader from "$lib/components/loader.svelte";

  let password = "";
  let confirmPassword = "";
  let email = "";
  let currentPassword = "";
  let conditions = [
    { id: "length", text: "Be at least 8 characters long.", valid: false },
    { id: "number", text: "Use numbers", valid: false },
    { id: "lowercase", text: "Use lowercase characters", valid: false },
    { id: "uppercase", text: "Use uppercase characters", valid: false },
    { id: "special", text: "Use special symbols", valid: false },
  ];
  let showConditions = false;
  let errors = {
    email: "",
    currentPassword: "",
    password: "",
    confirmPassword: "",
  };
  let showPopup = false;
  let message = "";
  let type = "";
  let loading = false;

  function triggerPopup(popupType, popupMessage) {
    type = popupType;
    message = popupMessage;
    showPopup = true;
    setTimeout(() => {
      showPopup = false;
      message = "";
    }, 3000);
  }

  function handlePasswordInput() {
    conditions = conditions.map((condition) => {
      switch (condition.id) {
        case "length":
          condition.valid = password.length >= 8;
          break;
        case "number":
          condition.valid = /\d/.test(password);
          break;
        case "lowercase":
          condition.valid = /[a-z]/.test(password);
          break;
        case "uppercase":
          condition.valid = /[A-Z]/.test(password);
          break;
        case "special":
          condition.valid = /[!@#$%^&*(),.?":{}|<>]/.test(password);
          break;
      }
      return condition;
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    errors = {
      email: "",
      currentPassword: "",
      password: "",
      confirmPassword: "",
    };

    if (!email) {
      errors.email = "Email is required.";
    }
    if (!currentPassword) {
      errors.currentPassword = "Current password is required.";
    }
    if (!password) {
      errors.password = "New password is required.";
    }
    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your new password.";
    }

    const isValid = conditions.every((condition) => condition.valid);
    if (!isValid && password) {
      errors.password = "Please make sure all password conditions are met.";
    }

    if (password && confirmPassword && password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    if (
      errors.email ||
      errors.currentPassword ||
      errors.password ||
      errors.confirmPassword
    ) {
      return;
    }

    changepassword();
  }

  function changepassword() {
    loading = true
    let changepass = {
      userid: email,
      old_password: currentPassword,
      new_password: confirmPassword,
    };
    cral
      .ChangePassWord(changepass)
      .then((response) => {
        loading = false;
        triggerPopup("success", "Password updated successfully!");
        cral.SignOut();
      })
      .catch((error) => {
        console.log(error)
        loading = false;
        if (error.status = 401){
            cral.SignOut()
        }
        const errorMessage =
          error.response?.data?.Message || "An error occurred.";
        triggerPopup("error", errorMessage);
      });
  }
</script>

<div class="flex items-center justify-center min-h-screen bg-white">
  <div class="text-center">
    <h1 class="text-pink-500 text-2xl font-bold mb-4">MUDA</h1>
    <h2 class="text-customText font-semibold text-xl mb-8">Change Password</h2>

    <div class="flex justify-center">
      <div
        class="bg-white p-8 w-96 relative border-[2px] border-[#E6E7EFD9] shadow-lg"
      >
        {#if showConditions}
          <div
            id="password-conditions"
            class="absolute left-[-15rem] top-[77px] bg-white border-2 border-[#E6E7EFD9] p-4 w-64 tooltip-container"
          >
            <p class="text-customText text-sm font-semibold mb-4 text-left">
              Your password needs to:
            </p>
            <ul class="text-gray-700 text-sm space-y-2">
              {#each conditions as condition}
                <li class="flex items-center font-semibold" id={condition.id}>
                  <img
                    src={condition.valid
                      ? "/check-circle.svg"
                      : "/alert-circle.svg"}
                    alt="Password Conditions"
                    class="h-5 w-9"
                  />
                  {condition.text}
                </li>
              {/each}
            </ul>
          </div>
        {/if}

        <form on:submit={handleSubmit}>
          <div class="mb-4 text-left">
            <label
              class="block text-gray-700 text-sm font-semibold mb-2"
              for="email">Login ID/Email</label
            >
            <input
              class="appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="text"
              bind:value={email}
            />
            {#if errors.email}
              <p class="text-red-500 text-xs font-semibold">{errors.email}</p>
            {/if}
          </div>

          <div class="mb-4 text-left">
            <label
              class="block text-gray-700 text-sm font-semibold mb-2"
              for="current-password">Current Password</label
            >
            <input
              class="appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="current-password"
              type="password"
              bind:value={currentPassword}
              on:focus={() => (showConditions = false)}
            />
            {#if errors.currentPassword}
              <p class="text-red-500 text-xs font-semibold">
                {errors.currentPassword}
              </p>
            {/if}
          </div>

          <div class="mb-4 relative text-left">
            <label class="block text-gray-700 text-sm font-semibold mb-2" for="new-password">
              New Password
            </label>
            <div class="relative flex items-center">
              <input
                class="appearance-none border w-full py-2 px-3 pr-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="new-password"
                type="password"
                bind:value={password}
                on:focus={() => (showConditions = true)}
                on:input={handlePasswordInput}
                on:blur={() => (showConditions = false)}
              />
              <img
                src="/lock.svg"
                alt="Password Lock Icon"
                class="absolute right-3 w-5 h-5"
              />
            </div>
            {#if errors.password}
              <p class="text-red-500 text-xs font-semibold">{errors.password}</p>
            {/if}
          </div>
          
          <div class="mb-6 relative text-left">
            <label class="block text-gray-700 text-sm font-semibold mb-2" for="confirm-password">
              Confirm New Password
            </label>
            <div class="relative flex items-center">
              <input
                class="appearance-none border w-full py-2 px-3 pr-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="confirm-password"
                type="password"
                bind:value={confirmPassword}
              />
              <img
                src="/lock.svg"
                alt="Password Lock Icon"
                class="absolute right-3 w-5 h-5"
              />
            </div>
            {#if errors.confirmPassword}
              <p class="text-red-500 text-xs font-semibold">{errors.confirmPassword}</p>
            {/if}
          </div>
          
          <div class="flex items-center justify-between">
            <button
              class="bg-[#5556FD] hover:bg-[#1D4ED8] text-white font-semibold py-2 px-4 focus:outline-none focus:shadow-outline w-full"
              type="submit"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>

{#if showPopup}
  <Popup {message} {type} duration={3000} />
{/if}

<Loader bind:loading />


<style>
  /* Custom styles for the triangle pointer on the right */
  .tooltip-container::after {
    content: "";
    position: absolute;
    top: 147px; /* Adjust to position the triangle vertically */
    right: -10px; /* Adjust to place it exactly on the right border */
    width: 0;
    height: 0;
    border-top: 10px solid transparent;
    border-bottom: 10px solid transparent;
    border-left: 10px solid white; /* Same color as the container background */
  }

  /* Box shadow for the triangle */
  .tooltip-container::before {
    content: "";
    position: absolute;
    top: 147px;
    right: -12px;
    width: 0;
    height: 0;
    border-top: 11px solid transparent;
    border-bottom: 11px solid transparent;
    border-left: 11px solid rgba(0, 0, 0, 0.1); /* Same shadow as the container */
  }
</style>
