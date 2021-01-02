import firebase from "firebase/app"
import "firebase/firestore"
import "firebase/auth"
import "firebase/storage"
import "firebase/performance" // Optional
import "firebase/analytics" // Optional


export default class SimpleFirebase {

    constructor(firebaseConfig, emulatorPort=5005) {
        firebase.initializeApp(firebaseConfig)
        this.FBS = firebase
        this.DB = firebase.firestore()
        this.AUTH = firebase.auth()
        this.STORE = firebase.storage()
        this.query_operators = ["<", "<=", "==", ">", ">=", "!=", "array-contains", "array-contains-any", "in", "not-in"]

        if (location.hostname === "localhost") {
            this.DB.settings({ host: `localhost:${emulatorPort}`, ssl: false })
        }

        // Ugly, bind is required in order to call methods in the class (without this I get weird errors)
        this.add = this.add.bind(this)
        this.update = this.update.bind(this)
        this.get = this.get.bind(this)
        this.find = this.find.bind(this)
        this.delete = this.delete.bind(this)
        this.facebookLogin = this.facebookLogin.bind(this)
        this.googleLogin = this.googleLogin.bind(this)
        this.logoutUser = this.logoutUser.bind(this)
        this.deleteUser = this.deleteUser.bind(this)
        this.registerUser = this.registerUser.bind(this)
        this.uploadFile = this.uploadFile.bind(this)
        this.deleteFile = this.deleteFile.bind(this)

    }

    // DB

    async add(collectionName, objData){
        if ("_id" in objData) {
            await this.DB.collection(collectionName).doc(objData._id).set(objData)
            return objData._id
        } else {
            let docRef = await this.DB.collection(collectionName).add(objData)
            await this.DB.collection(collectionName).doc(docRef.id).update({"_id": docRef.id})
            return docRef.id
        }   
    }

    async update(collectionName, objDataOld, objDataNew=undefined){
        if ("_id" in objDataOld) {
            await this.DB.collection(collectionName).doc(objDataOld._id).update(objDataOld)
            return objDataOld._id
        } else {
            if (objDataNew === undefined) throw("No '_id' or  new object specified!")
            let docList = await this.find(collectionName, objDataOld)
            let updated_ids = []
            for (let doc of docList) {
                await this.DB.collection(collectionName).doc(doc._id).update(objDataNew)
                updated_ids.push(doc._id)
            }
            return updated_ids
        }
    }

    async get(collectionName, objId){
        let snap = await this.DB.collection(collectionName).doc(objId).get()
        return snap.data()
    }

    async find(collectionName, objDataOrId, comparison="=="){
        
        // TODO add pagination using generators 

        if (typeof(objDataOrId) === typeof('string')) {
            return this.get(collectionName, objDataOrId)
        }

        if (!this.query_operators.includes(comparison)) {
            throw("Only these query operators are accepted: " + this.query_operators.join(", "))
        }

        let ref = this.DB.collection(collectionName)

        let objData = objDataOrId
        for (const key in objData) {
            ref = ref.where(key, comparison, objData[key])
        }

        let snap = await ref.get()
        let data_list = [] 
        if (!snap.empty){
            snap.forEach(res => {
                data_list.push({"_id":res.id, ...res.data()})
            })
        }

        return data_list
    }

    async delete(collectionName, objDataOrId){

        if (typeof(objDataOrId) === typeof('string')) {
            let docID = objDataOrId
            await this.DB.collection(collectionName).doc(docID).delete() 
            return docID
        }

        let objData = objDataOrId
        let docList = await this.find(collectionName, objData)
        let deleted_ids = []
        for (let doc of docList) {
            await this.DB.collection(collectionName).doc(doc._id).delete()
            deleted_ids.push(doc._id)
        }
        return deleted_ids
    }


    // AUTH

    async registerUser(user) {

        let user_data = await this.get("users", user.uid)

        // Adds to users collection name and email if uid not found in users collection
        if (user_data === undefined) {
            await this.add("users", {
                _id: user.uid,
                name: user.displayName,
                email: user.email
            })
        }

        return user.uid
    }


    async facebookLogin() {
        let provider = new firebase.auth.FacebookAuthProvider()
        const res = await firebase.auth().signInWithPopup(provider)
        return this.registerUser(res.user)
    }


    async googleLogin() {
        let provider = new firebase.auth.GoogleAuthProvider()
        const res = await firebase.auth().signInWithPopup(provider)
        return this.registerUser(res.user)
    }


    logoutUser() {
        return firebase.auth().signOut()
    }


    async deleteUser() {
        await this.delete("users", firebase.auth().currentUser.uid)  
        return firebase.auth().currentUser.delete()
    }


    // FILES

    async uploadFile(fileObj, folder=undefined, fileName=undefined, generateID=true){

        let prefix = ""
        if (generateID) {
            prefix = Math.random().toString(36).substring(2,15) + "_"
        }

        let path = `/${folder ? folder : "files"}/${fileName ? prefix + fileName: prefix + fileObj.name}` 

        if (Number(fileObj.size) > 0) {
            let snapshot = await firebase.storage().ref().child(path).put(fileObj)
            return {path, downloadURL: await snapshot.ref.getDownloadURL()}    
        }
    }


    async deleteFile(path){
        return firebase.storage().ref().child(path).delete()
    }

}

