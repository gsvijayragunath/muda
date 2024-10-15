<script>
  // @ts-nocheck

  import Table from "$lib/components/table.svelte";
  import { onMount } from "svelte";
  import cral from "../../sdk/cral";
  import Popup from "$lib/components/popup.svelte";
  import Loader from "$lib/components/loader.svelte";

  const table = "items";
  let headers = ["item", "itemdesc", "prod_typ", "inventory_unit", "quality"];
  let headersToShow = [
    "Item",
    "Item Description",
    "Product Type",
    "Unit Price",
    "Quality",
  ];
  let rows = [];
  let isEditable = true;
  let isDeletable = true;
  let loading = false;
  let showPopup = false;
  let message = "";
  let type = "";
  function triggerPopup(popupType, popupMessage) {
    type = popupType;
    message = popupMessage;
    showPopup = true;
    setTimeout(() => {
      showPopup = false;
      message = "";
    }, 3000);
  }

  function getData() {
    loading = true;
    cral
      .Getdata("/api/messages/items/0/0/0")
      .then((response) => {
        console.log(response);
        loading = false;
        rows = response.data.map((item) => {
          let row = {};
          headers.forEach((header) => (row[header] = item[header]));
          row.item_id = item.items_id;
          return row;
        });
        console.log(rows);
      })
      .catch((error) => {
        console.log(error)
        if (error.status === 401) cral.SignOut();
        loading = false;
          triggerPopup(
            "error",
            error.response?.data?.Message || error.message|| "An error occurred."
          );
        });
  }
  onMount(()=>{
    getData()
  })

</script>

<div class="mx-5">
  <div class="flex justify-between items-center mb-4 mt-8">
    <h1 class="text-2xl font-bold text-[#06072D]">Items</h1>
  </div>
</div>

<Table {headers} {headersToShow} {rows} {isEditable} {isDeletable} />
<Loader bind:loading />
  
  {#if showPopup}
    <Popup {message} {type} duration={3000} />
  {/if}