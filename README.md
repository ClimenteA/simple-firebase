# Simple-firebase
Firebase made a little bit easier. 
Most common tasks for any application is to process data, save data to a database, modifying data and retrieve it when needed. 
I put together a simple utility library which helps with CRUD operations (files and data) + Authentication.


## Instalation:

- Download file [`simple-firebase.js`](https://raw.githubusercontent.com/ClimenteA/simple-firebase/main/public/simple-firebase.js) to your public folder (where files are compiled);
- Add `simple-firebase.js` after firebase inititialization (`firebase` object needs to be available globaly).

```html

<!-- update the version number as needed or add files from gstatic -->
<script defer src="/__/firebase/8.2.2/firebase-app.js"></script>
<!-- include only the Firebase features as you need -->
<script defer src="/__/firebase/8.2.2/firebase-auth.js"></script>
<script defer src="/__/firebase/8.2.2/firebase-firestore.js"></script>
<script defer src="/__/firebase/8.2.2/firebase-storage.js"></script>
<!-- make sure you use the emulator for debuging -->
<script defer src="/__/firebase/init.js?useEmulator=true"></script>
<script defer src="path/to/simple-firebase.js"></script>

```

Under `f` you have the following:
- `firebase` by accessing `f.FBS`;
- `firebase.firestore()` by accessing `f.DB`;
- `firebase.auth()` by accessing `f.AUTH`;
- `firebase.storage()` by accessing `f.STORE`.

In firestore: 
- A collection is similar to a table;
- A document is similar to a table row;
- A field is similar to a column;
- A collection can have multiple documents the same way a table can have multiple rows;
- Each document has an ID the same way each row in a table has one.

Collections can have endless sub-collections. Almost each function under `f` is a promise and you can use `await` or `then` syntax on them.  

### Add document(s)

```js

let myDoc = {
    "_id": "my_unique_id", 
    "field_1": "value_1", 
    "field_2": "value_2"
}

let custom_id = await f.add("collectionName", myDoc)

```
This creates a new collection (if not present) and adds `myDoc` to it with a custom ID (`"_id"`). If ID is already present, this will replace the existing data with the new one.


```js

let myDoc1 = {
    "field_1": "value_1", 
    "field_2": "value_2"
}

let generated_id = await f.add("collectionName", myDoc1)

```
The code from above creates a new collection (if not present already) and adds `myDoc1` to it with an auto-generated ID made by firebase. 

The "_id" field is created for both cases in the document (similar to MongoDB Atlas).

The `add` method will return the ID of the generated document so you can do additional work with it.


### Update document(s)

```js

let myOldDoc = {
    "field_1": "value_1"
}
let myNewDoc = {
    "field_1": "value_1_updated"
}

let updated_ids = await f.update("collectionName", myOldDoc, myNewDoc)

```
This will update the document(s) in the collection where `field_1` has `value_1` with the new value for `field_1`. If `field_1` is not found, the update will be skipped and `updated_ids` will be an empty list.


```js

let myNewDoc1 = {
    "_id": custom_id, 
    "field_2": "value_2_updated"
}

let updated_id = await f.update("collectionName", myNewDoc1)

```
This will update the document with the `"_id"` specified.


### Find document(s)

```js   

let fDoc = {
    "field_2": "value_2_updated"
}

let docList = await f.find("collectionName", fDoc)

```
The `find` method will fetch all documents from `collectionName` where `field_2` has the value `value_2_updated`. The third parameter of `find` method is a query parameter, which by default is `==`. 


```js

let doc = await f.find("collectionName", custom_id)

```
You can also fetch a document from a collection by its ID.


### Delete document(s)

```js

let dDoc = {
    "field_2": "value_2_updated"
}

let deleted_ids = await f.delete("collectionName", dDoc)

```
The `delete` method will delete all documents from `collectionName` where `field_2` has the value `value_2_updated`.


```js

let deleted_id = await f.delete("collectionName", IDToDelete)

```
This will delete only the document with the given ID.



### Upload file(s)

```js

let downloadData1 = await f.uploadFile(afile)

```
The result from the `uploadFile` method it's a json object like:
```js
{
    path: "/files/hkvyljlrzcf_Screenshot from 2020-12-23 13-04-57.png", 
    downloadURL: "https://firebasestorage.googleapis.com/v0/b/other-data/token=etc"
}
```
You can later construct the downloadURL from `path` or use the given `downloadURL`.


Files will be uploaded automatically in a folder named `files` with a prefix id by default to avoid file overwrites. The auto generated ID can be disabled by setting the method paramteter `generateID` (the one from `uploadFile`) to `false`. You can also set a custom `folder` or `fileName` if needed.

```js

let downloadData = await f.uploadFile(
    fileObj, 
    folder=undefined, 
    fileName=undefined, 
    generateID=true
)

```

### Delete file

```js

await f.deleteFile(downloadData1.path)

```


## Authentification 


### Check user auth status

```js
let logged
f.AUTH.onAuthStateChanged(user => {
    if (user) logged = true
    else logged = false 
})
```
Save `logged` variable to the store of your chosen front-end framework.
Later, you can check, based on `logged` variable, if the user is logged in or not.


### Login/Register user (with Facebook, Google)

```js

f.facebookLogin() 
// OR
f.googleLogin()

```
This methods will automatically create (if not already present) a `users` collection and it'll save the email and the name in a document with the user's id (`uid`).


### Logout user
```js

f.logoutUser()

```

### Delete authenticated user
```js

f.deleteUser()

```


# TODO

- Make it posibile to add/update a list of documents (by using [batch](https://stackoverflow.com/questions/54322153/how-to-add-multiple-docs-to-a-collection-in-firebase)) 

```js

//ADD

let myListofDocs = [
    {"field_1": "value_1", "field_2": "value_2"},
    {"field_1": "value_1", "field_2": "value_2"},
    {"field_1": "value_1", "field_2": "value_2"},
]

let generated_ids = await f.add("collectionName", myListofDocs)

//UPDATE
let myListofOldDocs = [
    {"field_1": "value_1", "field_2": "value_2"},
    {"field_1": "value_1", "field_2": "value_2"},
    {"field_1": "value_1", "field_2": "value_2"},
]

let myListofNewDocs = [
    {"field_1": "value_1_updated", "field_2": "value_2_updated"},
    {"field_1": "value_1_updated", "field_2": "value_2_updated"},
    {"field_1": "value_1_updated", "field_2": "value_2_updated"},
]

let updated_ids = await f.update("collectionName", myListofOldDocs, myListofNewDocs)

```

- Make it posible to upload in batches also, move parameters in a object.
- Maybe return just the path? and construct downloadUrl when needed

```js

// list of file objects with folder, fileName or generateID specified

let filesToUpload = [
    {fileObj},
    {fileObj, folder:"profilePics"},
    {fileObj, folder:"productPics", fileName:"boneBreaker"},
    {fileObj, folder:"productVid", fileName:"how to use it.mp4", generateID:false}   
]

let downloadData = await f.uploadFiles(filesToUpload)

// list of file objects

let downloadData = await f.uploadFiles([fileObj1, fileObj2 etc])


```

- Delete files in batch

```js

await f.deleteFiles([downloadData1.path, downloadData2.path])

```

- add pagination for `find` method (probably by using generators)
- list collections and files (probably just a simple `collectionList` and `fileList` collection in firestore)
- automatic generation of security rules (limit fields, prohibid writes if user was the one who added the document, limit generation of collections)

**Feel free to fork it and improve it!**
