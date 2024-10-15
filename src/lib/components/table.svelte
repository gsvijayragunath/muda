<script>
  // @ts-nocheck
  
  export let headers = [];
  export let rows = [];
  export let isAdding = false;
  export let isEditable = true; 
  export let isDeletable = true;
  export let headersToShow = [];
  export let qualityTypes = [];  // Assuming this is passed in from the parent
  export let Delete = () => {};
  
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  let editableRowIndex = null;
  let showDeletePopup = false;
  let originalRowData = null;

  function saveRow(rowData, index) {
    dispatch('save', { newRowData: rowData, index });
    editableRowIndex = null;
    originalRowData = null;
  }

  function editRow(index) {
    editableRowIndex = index;
    originalRowData = { ...rows[index] };
  }

  function cancelEditRow(index) {
    rows[index] = originalRowData;
    dispatch('cancelEdit', index);
    editableRowIndex = null;
    originalRowData = null;
  }

  function cancelAddRow() {
    dispatch('cancelAdd');
    editableRowIndex = null;
  }

  function deleteRow(index) {
    dispatch('delete', index);
    showDeletePopup = true
  }

  function addRow(rowData) {
    dispatch('add', { newRowData: rowData });
    editableRowIndex = null;
  }
  function confirmDelete(){
    Delete()
    showDeletePopup = false;
  }
  function cancelDelete(){
    showDeletePopup = false;
  }
</script>

<!-- Table with Tailwind styling -->
<div class="p-4">
  <table class="table-auto w-full bg-white border border-gray-300 rounded-lg shadow-sm">
    <thead>
      <tr class="bg-gray-100 text-center text-sm border font-medium text-gray-700">
        {#each headersToShow as header}
          <th class="px-4 py-2 border">{header}</th>
        {/each}
        <th class="px-4 py-2 border">Actions</th>
      </tr>
    </thead>
    <tbody>
      {#if rows.length === 0}
        <tr>
          <td colspan="{headers.length + 1}" class="px-4 py-2 text-center text-gray-500">No data available</td>
        </tr>
      {:else}
        {#each rows as row, index}
          <tr class="bg-white border">
            {#each headers as header}
              <td class="px-4 py-2 border text-center">
                {#if index === editableRowIndex || (isAdding && index === rows.length - 1)}
                  {#if header === 'quality'}
                    <!-- Dropdown for selecting quality -->
                    <select
                      bind:value={row[header]}
                      class="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="" disabled>Select Quality</option>
                      {#each qualityTypes as type}
                        <option value={type}>{type}</option>
                      {/each}
                    </select>
                  {:else}
                    <!-- Regular input for other headers -->
                    <input
                      bind:value={row[header]}
                      class="w-full  border-gray-300 rounded px-1 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={header}
                    />
                  {/if}
                {:else}
                  {row[header]}
                {/if}
              </td>
            {/each}
            <td class="px-4 py-2 text-center">
              {#if index === editableRowIndex}
                <div class="flex justify-center space-x-2 items-center">
                  <img src="./save.svg" alt="Save" class="w-6 h-6 cursor-pointer" on:click={() => saveRow(row, index)} >
                  <img src="./close.png" alt="Cancel" class="w-6 h-6 cursor-pointer" on:click={() => cancelEditRow(index)} >
                </div>
              {:else if isAdding && index === rows.length - 1}
                <div class="flex justify-center space-x-2 items-center">
                  <img src="./save.svg" alt="Add" class="w-6 h-6 cursor-pointer" on:click={() => addRow(row)} >
                  <img src="./close.png" alt="Cancel" class="w-6 h-6 cursor-pointer" on:click={cancelAddRow} >
                </div>
              {:else}
                <div class="flex justify-center space-x-2 items-center">
                  {#if isEditable}
                    <img src="./edit.svg" alt="Edit" class="w-6 h-6 cursor-pointer" on:click={() => editRow(index)} >
                  {/if}
                  {#if isDeletable}
                    <img src="./trash.svg" alt="Delete" class="w-6 h-6 cursor-pointer" on:click={() => deleteRow(index)} >
                  {/if}
                </div>
              {/if}
            </td>
          </tr>
        {/each}
      {/if}
    </tbody>
  </table>
</div>

{#if showDeletePopup}
  <div
    class="fixed inset-0 bg-gray-800 bg-opacity-70 flex items-center justify-center z-50"
  >
    <div class="bg-white p-6 rounded-lg shadow-lg w-96 relative">
      <button
        class="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        on:click={cancelDelete}
      >
        <img src="./closep.svg" alt="close" />
      </button>
      <h2 class="text-xl font-semibold text-gray-800 mb-4">Confirm Delete</h2>
      <p class="text-gray-600 mb-6">Are you sure you want to delete?</p>
      <div class="flex justify-end space-x-4">
        <button
          class="bg-blue-100 text-blue-700 px-4 py-2 rounded-md hover:bg-blue-200"
          on:click={cancelDelete}
        >
          Cancel
        </button>
        <button
          class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          on:click={confirmDelete}
        >
          Delete
        </button>
      </div>
    </div>
  </div>
{/if}