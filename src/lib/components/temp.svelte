<script>
  // @ts-nocheck
  import { createEventDispatcher } from "svelte";

  export let headersToShow = []; // For displaying headers
  export let headers = []; // For mapping data in rows
  export let rows = [];
  export let isEditable = false;
  export let isDeletable = false;
  export let GetDeleteId = () => {}; // Function to handle cancel
  export let Delete = () => {};

  const dispatch = createEventDispatcher();

  // State variables for popup, editing, and adding rows
  let showDeletePopup = false;
  let deleteIndex = null;
  let editIndex = null; // Tracks which row is being edited
  let isAdding = false; // Tracks if a new row is being added
  let newRow = null; // To track new row being added

  const handleDelete = (index) => {
    GetDeleteId({ index });
    showDeletePopup = true;
    deleteIndex = index;
  };

  const confirmDelete = () => {
    Delete();
    showDeletePopup = false;
  };

  const cancelDelete = () => {
    showDeletePopup = false;
    deleteIndex = null;
  };

  const handleEdit = (index) => {
    editIndex = index; // Mark the row as being edited
  };

  const handleSave = (index) => {
    // Call API here when saving
    dispatch("save", { index, rowData: rows[index] });
    editIndex = null; // Reset edit mode
  };

  const handleAddNew = () => {
    // Add new row object with default empty values
    isAdding = true;
    newRow = {};
    headers.forEach((header) => (newRow[header] = "")); // Initialize fields with empty values
    rows = [...rows, { ...newRow }]; // Append new row
  };

  const handleAdd = () => {
    // API call for adding the new row
    dispatch("add", { rowData: newRow });
    isAdding = false;
    newRow = null; // Reset newRow after adding
  };

  const cancelAddOrEdit = () => {
    if (isAdding) {
      // Remove the newly added row if canceled
      rows = rows.slice(0, -1);
    }
    editIndex = null;
    isAdding = false;
    newRow = null;
  };

  const handleChange = (key, index, value) => {
    rows[index][key] = value; // Update row data dynamically
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "verified":
        return "text-green-600";
      case "suspended":
        return "text-yellow-500";
      case "not-verified":
        return "text-red-500";
      default:
        return "";
    }
  };
</script>

<div class="overflow-x-auto overflow-y-auto max-h-96 mx-4 mt-9">
  <table class="min-w-full bg-white border border-gray-300">
    <thead>
      <tr class="bg-gray-100">
        {#each headersToShow as header}
          <th
            class="py-2 px-4 border border-gray-300 text-sm font-bold text-gray-800"
          >
            {header}
          </th>
        {/each}
        {#if isEditable || isDeletable}
          <th
            class="py-2 px-4 border border-gray-300 text-sm font-bold text-gray-800"
          >
            Action
          </th>
        {/if}
      </tr>
    </thead>
    <tbody>
      {#if rows.length === 0}
        <tr>
          <td
            colspan={headersToShow.length + 1}
            class="py-4 text-center text-gray-500 border border-gray-300"
          >
            No data available
          </td>
        </tr>
      {:else}
        {#each rows as row, index}
          <tr>
            {#each headers as key}
              <td class="py-2 px-4 text-sm text-center border border-gray-300">
                {#if editIndex === index || (isAdding && index === rows.length - 1)}
                  <!-- Editable input fields -->
                  <input
                    type="text"
                    value={row[key]}
                    on:input={(e) => handleChange(key, index, e.target.value)}
                    class="border p-1 w-full"
                  />
                {:else if key === "Status"}
                  <span class={getStatusColor(row[key])}>{row[key]}</span>
                {:else}
                  {row[key]}
                {/if}
              </td>
            {/each}
            {#if isEditable || isDeletable}
              <td class="flex items-center justify-center py-2 px-4 border border-gray-300">
                {#if editIndex === index}
                  <button
                    class="text-blue-500 mr-2"
                    on:click={() => handleSave(index)}
                  >
                    Save
                  </button>
                  <button
                    class="text-gray-500"
                    on:click={cancelAddOrEdit}
                  >
                    Cancel
                  </button>
                {:else if isAdding && index === rows.length - 1}
                  <button
                    class="text-green-500 mr-2"
                    on:click={handleAdd}
                  >
                    Add
                  </button>
                  <button
                    class="text-gray-500"
                    on:click={cancelAddOrEdit}
                  >
                    Cancel
                  </button>
                {:else}
                  {#if isEditable}
                    <img
                      src="/edit.svg"
                      alt="Edit"
                      class="w-5 h-5 mr-4 cursor-pointer"
                      on:click={() => handleEdit(index)}
                    />
                  {/if}
                  {#if isDeletable}
                    <img
                      src="/trash.svg"
                      alt="Delete"
                      class="border-0 h-5 w-5 cursor-pointer"
                      on:click={() => handleDelete(index)}
                    />
                  {/if}
                {/if}
              </td>
            {/if}
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