<script>
    import axios from "axios";
    import Loader from "$lib/components/loader.svelte";

    let inputData = "";
    let base64QRCode = "";
    let loading = false;
    console.log(inputData)

    async function handleGenerateQRCode() {
        if (!inputData) return alert("Please enter valid input");

        loading = true;
    

        try {
            console.log(inputData)
            const response = await axios.post(
                "http://localhost:8080/qrcode",
                { data: inputData }
            );

            if (response.status === 200 && response.data && response.data.qr_code) {
                base64QRCode = `data:image/png;base64,${response.data.qr_code}`;
                console.log(response)
            } else {
                throw new Error("Unexpected response from backend");
            }
        } catch (error) {
            console.log(error)
            console.error("Error generating QR Code: ", error);
            alert("Failed to generate QR Code.");
        } finally {
            inputData = ""
            loading = false;
        }
    }
</script>

<div class="max-w-4xl mx-auto mt-10 px-6 py-8 bg-white shadow-md rounded-lg text-center">
    <h1 class="text-2xl font-bold mb-6 text-gray-700">QR Code Generator</h1>

    <div class="mb-4">
        <input
            type="text"
            bind:value={inputData}
            placeholder="Enter text to generate QR code"
            class="border border-gray-300 rounded-md px-4 py-2 text-lg w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
            on:click={handleGenerateQRCode}
            class="mt-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
        >
            Generate QR Code
        </button>
    </div>

    {#if loading}
        <p class="text-blue-500 font-semibold text-lg mb-4">Loading...</p>
    {/if}

    {#if base64QRCode}
        <div>
            <h2 class="text-lg font-semibold text-gray-700 mb-2">Your QR Code:</h2>
            <img
                src={base64QRCode}
                alt="Generated QR Code"
                class="mt-4 max-w-xs mx-auto rounded-md"
            />
        </div>
    {/if}
</div>

<Loader bind:loading />
