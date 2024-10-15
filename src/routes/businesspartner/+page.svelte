<script>
// @ts-nocheck

  import Table from "$lib/components/table.svelte";
  import Popup from "$lib/components/popup.svelte";
  import Loader from "$lib/components/loader.svelte";
  import { onMount } from "svelte";
  import cral from "../../sdk/cral";

  const qualityTypes = ["A", "B", "C", "D"];
  const table = "business_partner";

  let isEditable = false;
  let isDeletable = true;
  let isAdding = false;
  let headers = ["business_partner", "product_type", "quality"];
  let headersToShow = ["Business Partner", "Product Type", "Quality"];
  let rows = [];
  let selectedPartner;
  let businessPartners = [];
  let message = "";
  let type = "";
  let loading = false;
  let showPopup = false;
  let record_id = "";

  function getData() {
    loading = true;
    cral
      .Getdata("/api/messages/business_partner/0/0/0")
      .then((response) => {
        loading = false;
        businessPartners = [
          ...new Set(response.data.map((item) => item.business_partner)),
        ];
      })
      .catch((error) => {
        loading = false;
        triggerPopup(
          "error",
          error.response?.data?.Message || error.message || "An error occurred."
        );
        if (error.status === 401) cral.SignOut();
      });
  }

  function getRecordByFilter() {
    const payload = [
      { field: "business_partner", condition: "=", value: selectedPartner },
    ];
    loading = true;
    cral
      .GetRecordByFilter(table, payload)
      .then((response) => {
        loading = false;
        rows = response.data.map((item) => {
          let row = {};
          headers.forEach((header) => (row[header] = item[header]));
          row.business_partner_id = item.business_partner_id;
          return row;
        });
      })
      .catch((error) => {
        loading = false;
        triggerPopup(
          "error",
          error.response?.data?.Message || error.message || "An error occurred."
        );
      });
  }

  function triggerPopup(popupType, popupMessage) {
    type = popupType;
    message = popupMessage;
    showPopup = true;
    setTimeout(() => {
      showPopup = false;
      message = "";
    }, 3000);
  }

  function addNewRow() {
    isAdding = true;
    rows = [...rows, { product_type: "", quality: "" }];
  }

  function handleSave(event) {
    const { newRowData, index } = event.detail;
    rows[index] = newRowData;
    isAdding = false;
  }

  function handleCancelNewRow() {
    rows.pop();
    isAdding = false;
  }

  async function handleAdd(event) {
    loading = true;
    isAdding = false;
    const payload = event.detail.newRowData;
    await cral
      .Insert(table, payload)
      .then(() => {
        getData();
        getRecordByFilter();
        loading = false;
        triggerPopup("success", "Added Successfully");
      })
      .catch((error) => {
        loading = false;
        triggerPopup(
          "error",
          error.response?.data?.Message || "An error occurred."
        );
      });
  }

  function getDeleteIndex(event) {
    record_id = rows[event.detail].business_partner_id;
  }

  function Delete() {
    loading = true;
    cral
      .Delete(table, record_id)
      .then(() => {
        loading = false;
        getData();
        getRecordByFilter();
        triggerPopup("success", "Deleted Successfully");
        record_id = "";
      })
      .catch((error) => {
        loading = false;
        triggerPopup(
          "error",
          error.response?.data?.Message || "An error occurred."
        );
      });
  }

  onMount(() => {
    getData();
  });
</script>

<div class="flex flex-col items-start p-4">
  <h1 class="text-2xl font-bold text-[#06072D] mb-4">
    Items by Business Partner
  </h1>
  <label for="business-partner" class="text-sm font-medium text-gray-700">
    Business Partner
  </label>
  <div class="flex items-center space-x-2 mt-1">
    <select
      id="business-partner"
      bind:value={selectedPartner}
      class="block w-64 border-[1px] overflow-y-auto pl-3 pr-10 py-2 text-base border-gray-300"
      on:change={getRecordByFilter}
    >
      <option value="" disabled selected hidden>Select Business Partner</option>
      {#each businessPartners as partner}
        <option value={partner}>{partner}</option>
      {/each}
    </select>
    <button
      class="px-4 py-2 text-white bg-[#5556FD] hover:bg-blue-700"
      on:click={addNewRow}
    >
      Add
    </button>
  </div>
</div>

<Table
  bind:headers
  bind:headersToShow
  bind:rows
  {isAdding}
  on:save={handleSave}
  on:cancelAdd={handleCancelNewRow}
  on:add={handleAdd}
  on:delete={getDeleteIndex}
  {Delete}
  {isDeletable}
  {isEditable}
  {qualityTypes}
/>

<Loader bind:loading />

{#if showPopup}
  <Popup {message} {type} duration={3000} />
{/if}
