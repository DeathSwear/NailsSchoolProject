import React, {useState} from 'react';
import { StyleSheet, Text, View, Button, Pressable, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useSelector, useDispatch } from 'react-redux';
import { change } from '../../store/chooseThemeSlice';

import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { FIREBASE_STORAGE, FIREBASE_STORE } from '../../DB/firebaseConfig'
import * as ImagePicker from 'expo-image-picker';
import { addDoc, collection} from "firebase/firestore";


export const Screen3=( {navigation} )=>{

    const dispatch = useDispatch();
    const theme = useSelector((state) => state.theme.value);

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
        const storageRef = ref(storage, 'images/' + Date.now());
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
            comments: ['t3', 't5', 't7', 't1'],
            themes: ['t3', 't5', 't7', 't1']
        });
        console.log("Document written with ID: ", docRef.id);
        } catch (error) {
        console.error("Error uploading image or adding document: ", error);
        }
        //setImageStorageUrl(null);
        console.log('---End Setting ---');
    }


    /* где угодно такое сделать, и смогу посмотреть баланс. так же как тут и изменить.
    const balance = useSelector((state) => state.balance.value);
    */


    return(
        <View style={styles.wrapper}>
            <View style={styles.content}>
                <Text numberOfLines={1} style={styles.content__text}>Избранное</Text>
                <View style={styles.content__icoWrapper}>
                    <Pressable><Ionicons style={styles.icoWrapper_ico} name={'add-outline'} size={25} color={'#fff'} /></Pressable>
                    <Pressable onPress={() => navigation.navigate('3')}><Ionicons style={styles.icoWrapper_ico} name={'person-circle-outline'} size={25} color={'#fff'} /></Pressable>

                </View>
            </View>
            <View style={styles.container}>
            <View style={{ marginVertical: 40 }}>
                <Button title='Pick Image' onPress={pickImage}/>
                <Button title='Upload Image' onPress={uploadImage}/>
                <Button title='testAddInfo' onPress={testFirestore}/>
            </View>
            <View style={{ marginTop: 20 }}>
                <Text style={{ fontSize: 20 }}>Current Theme: {theme? theme : 'нет темы еще'}</Text>
                <Image style={styles.content__image} source={{uri: imageStorageUrl }}/>
            </View>
            </View>
        </View>

    );
}
const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: '#ffc4c8',
        height: '100%'
      },
    content: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        height:75,
        backgroundColor: '#f59097',
        paddingBottom: 10
    },
    content__text: {
        flex: 1,
        fontSize: 18,
        color: '#fff',
        marginLeft: 20
    },
    content__icoWrapper:{
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: 90
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content__image: {
        height: 250,
        width: 250,
    }
});