<script>

import Firebaser from "./Fire/firebaser.js"

const firebaseConfig = {
    apiKey: "AIzaSyA7CZB5SY3BI5bgFBS0sO86l6OlgDN9BmY",
    authDomain: "cdi-firebase.firebaseapp.com",
    databaseURL: "https://cdi-firebase.firebaseio.com",
    projectId: "cdi-firebase",
    storageBucket: "cdi-firebase.appspot.com",
    messagingSenderId: "851561307188",
    appId: "1:851561307188:web:d1c00e1aaf818ee9b8fe61",
    measurementId: "G-YRBTWP52ZP"
}

const fbs = new Firebaser(firebaseConfig)

async function playWithFirestore() {

    // FIRESTORE

    // Add a new document to a collection with a auto-generated ID
    let generated_id = await fbs.add("collection_name", {"field_1": "value_1", "field_2": "value_2"})
    console.log("Auto-generated ID: ", generated_id)

    
    // Add a new document to a collection with a custom ID
    let custom_id = await fbs.add("collection_name", {"_id": "my_unique_id", "field_1": "value_1", "field_2": "value_2"})
    console.log("Custom ID: ", custom_id)


    // Update documents from a collection without specifing the ID.  
    let updated_ids = await fbs.update("collection_name", {"field_1": "value_1"}, {"field_1": "value_1_updated"})
    console.log("Updated IDs list:", updated_ids)


    // Update a document from a collection by specified ID
    let updated_id = await fbs.update("collection_name", {"_id": custom_id, "field_2": "value_2_updated"})
    console.log("Updated ID:", updated_id)


    // Find documents in a collection without specifing the ID 
    let docList = await fbs.find("collection_name", {"field_2": "value_2_updated"})
    console.log("Found docs:", docList)


    // Find a document in a collection based on document ID
    let doc = await fbs.find("collection_name", custom_id)
    console.log("Found doc:", doc)


    // Delete a document from a collection without specifing the ID
    let deleted_ids = await fbs.delete("collection_name", {"field_2": "value_2_updated"})
    console.log("Deleted doc IDs:", deleted_ids)


    // Delete a document from a collection with a specified ID
    let deleted_id = await fbs.delete("collection_name", generated_id)
    console.log("Deleted doc ID:", deleted_id)


}


playWithFirestore()
 

async function uploadFile(event) {
    let form_data = new FormData(event.target)
    form_data = Object.fromEntries(form_data)

    let downloadData1 = await fbs.uploadFile(form_data.afile)
    console.log("Data:", downloadData1)

    let downloadData2 = await fbs.uploadFile(form_data.afile, "NewFolder")
    console.log("Data folder specified:", downloadData2)
    
    let downloadData3 = await fbs.uploadFile(form_data.afile, undefined, "MyfileName.pdf")
    console.log("Data fileName specified:", downloadData3)

    let downloadData4 = await fbs.uploadFile(form_data.afile, "NewFolder", "MyfileName.pdf", false)
    console.log("Data folder, filename speficied, generateID disabled:", downloadData4)
    
    await fbs.deleteFile(downloadData1.path)
    await fbs.deleteFile(downloadData2.path)
    await fbs.deleteFile(downloadData3.path)
    await fbs.deleteFile(downloadData4.path)
    console.log("Files 1,2,3,4 deleted:", downloadData1.path, downloadData2.path, downloadData3.path, downloadData4.path)

}


let logged
fbs.AUTH.onAuthStateChanged(user => {
    if (user) logged = true
    else logged = false 
})


</script>


<h1 class="text-xl mb-4">AUTH</h1>

<section class="flex items-center gap-4">

    {#if logged}
        <p class="p-4 bg-white text-lg text-blue-800 font-semibold">Logged in</p>
    {:else}
        <p class="p-4 bg-white text-lg text-yellow-800 font-semibold">Logged out</p>
    {/if}


    <button on:click={fbs.facebookLogin} class="bg-blue-600 p-2 text-base text-white">
        Login
    </button>

    <button on:click={fbs.logoutUser} class="bg-yellow-800 p-2 text-base text-white">
        Logout
    </button>

    <button on:click={fbs.deleteUser} class="bg-red-600 p-2 text-base text-white">
        Delete account
    </button>

</section>




<h1 class="text-xl mt-10 mb-4">STORAGE</h1>

<section class="flex items-center gap-4">

    <form on:submit|preventDefault={uploadFile} class="flex flex-col gap-4">
        
        <label for="afile">
            <input type="file" name="afile" id="afile">
        </label>

        <button type="submit" class="bg-blue-600 p-2 text-base text-white">
            Upload
        </button>

    </form>

</section>