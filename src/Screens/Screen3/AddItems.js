import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Button, Pressable, ActivityIndicator, Image, TextInput, ImageBackground } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { FIREBASE_STORAGE, FIREBASE_STORE } from '../../DB/firebaseConfig'
import * as ImagePicker from 'expo-image-picker';
import { addDoc, collection} from "firebase/firestore";
import { current } from '@reduxjs/toolkit';


export const AddItems=( {navigation} )=>{

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
    useEffect(() => {
        // Вызываем uploadImage каждый раз, когда изменяется значение image
        if (image) {
            uploadImage();
        }
    }, [image]);

    const [uploadProcess, setUploadProcess] = useState(0);

    const uploadImage = async () => {
        if(image === null) return;
        setUploadProcess(0);
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
            setUploadProcess(progress);
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

    const [addInProcess, setAddInProcess] = useState(false);

    const addPost = async () => {
        console.log('\n---Start Setting ---');
        setAddInProcess(true);
        const tagsArray = tags.split(',').map(item => item.trim());
        try {
            const docRef = await addDoc(collection(db, "posts"), {
            text: text,
            likes: 0,
            image: imageStorageUrl,
            comments: [],
            themes: tagsArray
        });
        console.log("Document written with ID: ", docRef.id);
        } catch (error) {
        console.error("Error uploading image or adding document: ", error);
        }
        //setImageStorageUrl(null);
        setAddInProcess(false);
        nullInputs();
        console.log('---End Setting ---');
    }

    const addTopic = async () => {
        console.log('\n---Start Setting ---');
        setAddInProcess(true);
        const tagsArray = tags.split(',').map(item => item.trim());
        try {
            const docRef = await addDoc(collection(db, "topic"), {
            text: text,
            image: imageStorageUrl,
            themes: tagsArray
        });
        console.log("Document written with ID: ", docRef.id);
        } catch (error) {
        console.error("Error uploading image or adding document: ", error);
        }
        //setImageStorageUrl(null);
        setAddInProcess(false);
        nullInputs();
        console.log('---End Setting ---');
    }

    const nullInputs = () => {
        setText('');
        setTags('');
        setImageStorageUrl(null);
        setUploadProcess(0);
    }

    /* где угодно такое сделать, и смогу посмотреть баланс. так же как тут и изменить.
    const balance = useSelector((state) => state.balance.value);
    */
    const [text, setText] = useState('');
    const [tags, setTags] = useState('');
    const [choose, setChoose] = useState('Null');

    const chooseThematic = () => {
        if(choose==='Thematic') setChoose('Null');
        else setChoose('Thematic')
    }
    const choosePost = () => {
        if(choose==='Post') setChoose('Null');
        else setChoose('Post')
    }

    return(
        <View style={styles.wrapper}>
            <ImageBackground
            source={require('../../images/ProfileBack.jpg')}
            style={styles.backgroundImage}
            blurRadius={3} // Здесь задайте радиус размытия
            >
                <View style={styles.headerContent}>
                    <Text numberOfLines={1} style={styles.headerContent__text}>Админ-панель</Text>
                    <View style={styles.headerContent__icoWrapper}>
                        <Pressable onPress={() => navigation.navigate('2')}><Ionicons style={styles.icoWrapper_ico} name={'exit-outline'} size={25} color={'#000'} /></Pressable>
                    </View>
                </View>
                <View style={styles.container}>
                    <View style={styles.container__chooseContent}>
                        <Pressable onPress={chooseThematic} style={styles.chooseContent__pressable}>
                            <Ionicons style={styles.icoWrapper_ico} name={'list-outline'} size={25} color={'#000'} />
                            <Text>Тематика</Text>
                        </Pressable>
                        <Pressable onPress={choosePost} style={styles.chooseContent__pressable}>
                            <Ionicons style={styles.icoWrapper_ico} name={'images-outline'} size={25} color={'#000'} />
                            <Text>Пост</Text>
                        </Pressable>
                    </View>
                    {choose === 'Null' ? null : <>
                    <TextInput style={[styles.container__input, {height:60}]} multiline={true}
                        placeholder='Введите описание' autoCapitalize='none'
                        value={text} onChangeText={(text) => setText(text)}
                    />
                    <TextInput style={styles.container__input} multiline={true}
                        placeholder='Введите теги, разделяя запятой' autoCapitalize='none'
                        value={tags} onChangeText={(text) => setTags(text)}
                    />
                    <Pressable onPress={pickImage} style={styles.container__pressable}><Text style={styles.pressable__text}>Выбрать фото</Text></Pressable>
                    {choose === 'Post' ? <>
                    <Text>Предпросмотр фото: {uploadProcess > 0 ? `(|${uploadProcess}%|)` : null}</Text>
                    <Image style={styles.container__image} source={{uri: imageStorageUrl }}/>
                    {addInProcess?
                    <ActivityIndicator size="large" color="#dddddd"/>
                    : 
                    <Pressable onPress={addPost} style={styles.container__pressable}><Text style={styles.pressable__text}>Загрузить в Ленту</Text></Pressable>
                    }
                    </> : <>
                    <Text>Слегка прозрачный предпросмотр: {uploadProcess > 0 ? `(|${uploadProcess}%|)` : null}</Text>
                    <View style={styles.container__contentThematic}>
                        <Image style={styles.contentThematic__img} source={{uri: imageStorageUrl }}/>
                        <Text style={styles.contentThematic__text} numberOfLines={2} >{text}</Text>
                    </View>
                    {addInProcess?
                    <ActivityIndicator size="large" color="#dddddd"/>
                    : 
                    <Pressable onPress={addTopic} style={styles.container__pressable}><Text style={styles.pressable__text}>Загрузить в Тематику</Text></Pressable>
                    }
                    </>}
                    </>}
                </View>
            </ImageBackground>
        </View>

    );
}
const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: '#fafafa',
        flex: 1
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        height:75,
        backgroundColor: '#f0f0f077',
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#c9c9c9' 
    },
    headerContent__text: {
        flex: 1,
        fontSize: 21,
        color: '#000',
        fontFamily: 'custom-font2',
        marginLeft: 20
    },
    headerContent__icoWrapper:{
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: 90,
        
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover', // Растянуть картинку на весь экран
    },
    container: {
        flex: 0,
        marginTop: 30,
        paddingTop: 10,
        paddingBottom: 10,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#a8a8a83f',
    },
    container__chooseContent: {
        flexDirection: 'row',
        marginBottom: 15
    },
    chooseContent__pressable: {
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 30,
        marginRight: 30,
        borderWidth: 1,
        borderRadius: 50,
        borderColor: '#000',
        width: 100,
        height: 56,
        backgroundColor: '#ffffff6f'
    },
    container__image: {
        height: 260,
        width: '100%',
        borderWidth: 1,
        borderColor: 'red'
    },
    container__input: {
        height: 40,
        width: '90%',
        borderColor: 'red',
        margin: 3,
        borderRadius: 15,
        borderTopWidth: 0.4,
        borderLeftWidth: 0.4,
        borderRightWidth: 1.2,
        borderBottomWidth: 2.2,
        borderColor: '#612353',
        backgroundColor: '#ffffff3f',
        paddingHorizontal: 5,
    },
    container__pressable: {
        backgroundColor: '#ffffff3f',
        height: 40,
        width: 170,
        marginTop: 4,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
        borderTopWidth: 0.4,
        borderLeftWidth: 0.4,
        borderRightWidth: 1.2,
        borderBottomWidth: 2.2,
        borderColor: '#612353',
        //position: 'absolute',
    },
    pressable__text: {
        fontSize: 16,
    },

    container__contentThematic:{
        padding:5,
        alignSelf: 'center',
        backgroundColor: '#ffffff7f',
        marginTop: 4,
        marginBottom: 4,
        marginLeft: 7,
        marginRight: 7,
        borderColor: '#c7c7c7',
        flexDirection: 'row',
        alignItems: 'center',      
      },
      contentThematic__img: {
        height: 75,
        width: 75,
        borderColor: '#ba84ae',
        borderWidth: 1.5,
        borderRadius: 50
      },
      contentThematic__text: {
        color: '#000',
        fontSize: 17,
        flex: 1,
        marginLeft: 15,
      }

});