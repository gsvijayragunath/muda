<script>
// @ts-nocheck

    export let newBusinessPartner = "";
    export let newProductType = "";
    export let newQuality = "";
    export let qualityTypes = [];
    export let add = () => {}; // Function to handle form submission
    export let cancelEntry = () => {}; // Function to handle cancel
  
    function handleAdd() {
      // Emit the values to the parent component
      add({
        businessPartner: newBusinessPartner,
        productType: newProductType,
        quality: newQuality,
      });
    }
  </script>
  
  <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <form
      class="bg-white p-6 rounded-lg shadow-lg w-1/3"
      on:submit|preventDefault={handleAdd}
    >
      <h2 class="text-lg font-bold mb-4">Add New Business Partner</h2>
      
      <!-- Business Partner ID -->
      <label for="business-partner-id" class="block text-sm font-medium text-gray-700">Business Partner ID</label>
      <input
        id="business-partner-id"
        type="text"
        bind:value={newBusinessPartner}
        class="block w-full p-2 border rounded-md mb-4"
        placeholder="Enter Business Partner ID"
        required
      />
  
      <!-- Product Type -->
      <label for="product-type" class="block text-sm font-medium text-gray-700">Product Type</label>
      <input
        id="product-type"
        type="text"
        bind:value={newProductType}
        class="block w-full p-2 border rounded-md mb-4"
        placeholder="Enter Product Type"
        required
      />
  
      <!-- Quality -->
      <label for="quality" class="block text-sm font-medium text-gray-700">Quality</label>
      <select
        id="quality"
        bind:value={newQuality}
        class="block w-full p-2 border rounded-md mb-4"
        required
      >
        <option value="" disabled>Select a quality</option>
        {#each qualityTypes as qualityOption}
          <option value={qualityOption}>{qualityOption}</option>
        {/each}
      </select>
  
      <!-- Buttons -->
      <div class="flex justify-end space-x-4">
        <button
          type="button"
          class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          on:click={cancelEntry}
        >
          Cancel
        </button>
        <button
          type="submit"
          class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Add
        </button>
      </div>
    </form>
  </div>
  