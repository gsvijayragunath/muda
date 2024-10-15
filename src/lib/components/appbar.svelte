<script>
    //@ts-nocheck
    import { fly } from "svelte/transition";
    import cral from "../../sdk/cral";
    import { isLoggedIn } from "$lib/stores/global";
    import { goto } from "$app/navigation";
  
    export let toggleSidebar; 
    export let isMenuOpen; 
    export let username = '';
    export let email = '';
  
    let isPopupOpen = false;

    function togglePopup() {
        isPopupOpen = !isPopupOpen;
    }

    function signout(){
        isLoggedIn.set(false);
        cral.SignOut();
        goto('/signin');
    }
</script>
  
<div class="sticky bg-white border-[1px] top-0 left-0 z-10 w-full transition-all duration-300">
    <div class="flex justify-between items-center p-4">
        <div class="cursor-pointer space-y-1" on:click={toggleSidebar}>
            <img src="./menu.png" alt="Menu Bar">
        </div>
  
        <div class="relative z-20" style={`margin-left: ${isMenuOpen ? '128px' : '0px'};`}>
            <div   class="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white border-4 cursor-pointer hover:bg-gray-800 transition duration-200"
            on:click={togglePopup}>
                <button>{username.charAt(0)}</button>
            </div>
  
            {#if isPopupOpen}
                <div class="absolute right-0 mt-2 w-59 p-6 bg-white  shadow-lg rounded-lg z-30" transition:fly={{ y: -20, duration: 300 }}>
                    <ul class="list-none p-2">
                        <li class="font-semibold p-2 border-b border-gray-200">{email}</li>
                        <li class="hover:bg-[#5556FD] hover:text-white text-red-400 cursor-pointer p-2 transition-colors duration-200" on:click={signout}>Logout</li>
                        <li class="hover:bg-[#5556FD] hover:text-white cursor-pointer text-red-400 p-2 transition-colors duration-200" on:click={() => { goto('/changepassword') }}>Change Password</li>
                    </ul>
                </div>
            {/if}
        </div>
    </div>
</div>
