# Simple-firebase
Firebase made a little bit easier. 


#### Instalation

- Download file `simple-firebase.js` to your firebase application folder (you must have firebase installed with npm along with firebase-emulator);
- Initialize the library with your firebase config data;

```js

import SimpleFirebase from "./pathTo/simple-firebase.js"

const firebaseConfig = {
    // Paste your firebase configuration data
}

const sfire = new SimpleFirebase(firebaseConfig)

```


#### Firestore 

To make things simpler thing of a collection as a table and a document a row in that collection.
Each document in a collection has an Id like each row in a table has an Id. 


- **ADD** a new document to a collection with a AUTO GENERATED ID
```js
let generated_id = await sfire.add("collection_name", {"field_1": "value_1", "field_2": "value_2"})
```

- **ADD** a new document to a collection with a CUSTOM ID
```js
let custom_id = await sfire.add("collection_name", {"_id": "my_unique_id", "field_1": "value_1", "field_2": "value_2"})
```
Field `"_id"` will hold the Id of the document.
The `add` method will return the document Id, so you can do additional work with it if needed. 


- **UPDATE** documents from a collection WITHOUT specifing the ID
```js
let updated_ids = await sfire.update("collection_name", {"field_1": "value_1"}, {"field_1": "value_1_updated"})
```
`updated_ids` will be a list of updated id's, where collection fields matched.


- **UPDATE** ONE document from a collection by the specified `_id`
```js
let updated_id = await sfire.update("collection_name", {"_id": custom_id, "field_2": "value_2_updated"})
```
`updated_id` is `"_id"` specified.


- **FIND** documents in a collection     
```js   
let docList = await sfire.find("collection_name", {"field_2": "value_2_updated"})
```
The result will be a list of documents.
`find` method will construct a `where` query based on the fields and values provided.
As a third parameter of find function you can change the default "==" query parameter with another 
firestore where query parameters 
`["<", "<=", "==", ">", ">=", "!=", "array-contains", "array-contains-any", "in", "not-in"]`


- **FIND** a document in a collection based on document ID
```js
let doc = await sfire.find("collection_name", custom_id)
```

- **DELETE** a document from a collection without specifing the ID
```js
let deleted_ids = await sfire.delete("collection_name", {"field_2": "value_2_updated"})
```
The result will be a list of Id's where field and value matched in the collection.

- **DELETE** a document from a collection with a specified ID
```js
let deleted_id = await sfire.delete("collection_name", generated_id)
```


#### Storage 

Files will be uploaded automatically in a folder named `files` with a prefix id by default to avoid overwrites (this id can be disabled).


- **UPLOAD** a file to `files` folder 
```js
let downloadData1 = await sfire.uploadFile(afile)
```

- **UPLOAD** a file to `NewFolder` folder 
```js
let downloadData2 = await sfire.uploadFile(afile, "NewFolder")
```

- **UPLOAD** a file to default `files` folder but with a custom name `MyfileName.pdf` for the file 
```js
let downloadData3 = await sfire.uploadFile(afile, undefined, "MyfileName.pdf")
```

- **UPLOAD** a file to `NewFolder` folder with a custom name `MyfileName.pdf` for the file 
```js
let downloadData4 = await sfire.uploadFile(afile, "NewFolder", "MyfileName.pdf", false)
```

The result from the `uploadFile` method it's a json object like:
```js
{
    path: "/files/hkvyljlrzcf_Screenshot from 2020-12-23 13-04-57.png", 
    downloadURL: "https://firebasestorage.googleapis.com/v0/b/other-data/token=etc"
}
```

You can later construct the downloadURL or use the `downloadURL` from this object.


- **DELETE** a file 
```js
await sfire.deleteFile(downloadData1.path)
```

#### Authentification 

Save `logged` variable to the store of your choosed front-end framework.
Later, you can check based on `logged` variable if the user is logged in or not.

```js
let logged
sfire.AUTH.onAuthStateChanged(user => {
    if (user) logged = true
    else logged = false 
})
```

Facebook and Google login are available 

- User login and registration
```js
sfire.facebookLogin() 
// OR
sfire.googleLogin()
```

This methods will automatically create if not present a `users` collection and save email and name in a document with user's `uid`.


- Logout user
```js
sfire.logoutUser()
```

- Delete current logged user
```js
sfire.deleteUser()
```


#### TODO

- add pagination for `find` method (probably by using generators)
- list collections and files (probably just a simple `collectionList` and `fileList` collection in firestore)

**Feel free to fork it and improve it!**

