import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import React, {useState} from 'react';
import { FIREBASE_STORAGE, FIREBASE_STORE } from './firebaseConfig'
import * as ImagePicker from 'expo-image-picker';
import { addDoc, collection} from "firebase/firestore";
const storage = FIREBASE_STORAGE;
const db = FIREBASE_STORE;
const [image, setImage] = useState(null);
const [imageStorageUrl, setImageStorageUrl] = useState(null);

const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
    });

    if (!result.canceled) {
        setImage(result.assets[0].uri);
    }
};

const uploadImage = async () => {
    const blobImage = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function() {
            resolve(xhr.response)
        };
        xhr.onerror = function() {
            reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", image, true);
        xhr.send(null);
    });
    
    /** @type {any} */
    const metadata = {
        contentType: 'image/jpeg'
    }
    // Upload file and metadata to the object 'images/mountains.jpg'
    const storageRef = ref(storage, 'images/' + "testname");
    const uploadTask = uploadBytesResumable(storageRef, blobImage, metadata);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on('state_changed',
    (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
        case 'paused':
            console.log('Upload is paused');
            break;
        case 'running':
            console.log('Upload is running');
            break;
        }
    }, 
    (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
        case 'storage/unauthorized':
            // User doesn't have permission to access the object
            break;
        case 'storage/canceled':
            // User canceled the upload
            break;

        // ...

        case 'storage/unknown':
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
    }, 
    () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        console.log('File available at', downloadURL);
        setImageStorageUrl(downloadURL);
        });
    }
    );
    setImage(null);
}

const testFirestore = async () => {
    console.log('\n---Start Setting ---');
    
    try {
        const docRef = await addDoc(collection(db, "posts"), {
        text: "testImagetext",
        likes: 4,
        image: imageStorageUrl,
        comments: ['image!','eaaa', 'img!']
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (error) {
      console.error("Error uploading image or adding document: ", error);
    }
    setImageStorageUrl(null);
    console.log('---End Setting ---');
}

export const uploadPost = () =>{
    pickImage();
    if(image != null) {
        uploadImage();
        testFirestore();
    }
}

