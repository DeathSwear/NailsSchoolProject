import React, {useState, useEffect} from 'react';
import { Text, View, Pressable, Image, FlatList, ActivityIndicator, Modal, TextInput, StyleSheet} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ImageViewer from 'react-native-image-zoom-viewer';

import { doc, updateDoc, arrayUnion, setDoc, getDoc, arrayRemove } from "firebase/firestore";
import { current } from '@reduxjs/toolkit';
import { FIREBASE_AUTH, FIREBASE_STORE } from '../../DB/firebaseConfig';

import { useDispatch, useSelector } from 'react-redux';
import { changeFavorites, removeFromFavorites } from '../../store/listFavoritesSlice';
import { changeLiked, removeFromLiked } from '../../store/listLikedSlice';

export const PostView = ({navigation}) => {
    const dispatch = useDispatch();
    const currentListFavorites = useSelector((state) => state.listFavorited.value);
    const currentListLiked = useSelector((state) => state.listLiked.value);

    const route = useRoute();
    const { item, deleteFromPostList, backToPostList } = route.params;


    const [commentSendLoading, setCommentSendLoading] = useState(false);
    const [newComment, setNewComment] = useState();
    const addCommentToDocument = async (documentId, newComment) => {
        setCommentSendLoading(true);
        const docRef = doc(FIREBASE_STORE, "posts", documentId);
        try {
        await updateDoc(docRef, {
            comments: arrayUnion(newComment),
        });
        console.log("Комментарий успешно добавлен!");
        setListComments((prevComments) => [...prevComments, newComment]);
        setNewComment('');
        } catch (error) {
        console.error("Ошибка при добавлении комментария: ", error);
        }
        setCommentSendLoading(false);
        setCountComments((current) => current+1);
    };
    
    const [listComments, setListComments] = useState(item.comments)
    const [countComments, setCountComments] = useState(item.comments.length)



    const [countLikePressed, setCountLikePressed] = useState(item.likes);
    const [likePressed, setLikePressed] = useState(false);
    const [likeProcess, setLikeProcess] = useState(false);
    const auth = FIREBASE_AUTH;
    const currentUser = auth.currentUser;

    const onPressLike = () =>{
        if(likePressed == false) {
          if (currentUser) {
          setLikeProcess(true);
          //setCountLikePressed((current) => current+1);
          const userUID = currentUser.uid;
          addToLiked(userUID);
          setLikePressed(!likePressed);
          } else {
            console.log('Пользователь не вошел в систему');
          }
        }
        else{
          if (currentUser) {
            setLikeProcess(true);
            setLikePressed(!likePressed);
            //setCountLikePressed((current) => current-1);
            const userUID = currentUser.uid;
            deleteFromLiked(userUID)
          }
        }
      }
    
    const deleteFromLiked = async (userUID) => {
        const userFavoritesRef = doc(FIREBASE_STORE, 'favorites', userUID);
        await updateDoc(userFavoritesRef, {
          likedItems: arrayRemove(item.id)
        });
        dispatch(removeFromLiked(item.id))
        console.log('Успешно удалено из лайкнутого!!');
        setCountLikePressed((current) => current-1);
        setLikeProcess(false);
    }
      
    const addToLiked = async (userUID) => {
        const userFavoritesRef = doc(FIREBASE_STORE, 'favorites', userUID);
    
        const docSnapshot = await getDoc(userFavoritesRef);
    
        if (docSnapshot.exists()) {
            // Документ существует, можно использовать updateDoc
            await updateDoc(userFavoritesRef, {
                likedItems: arrayUnion(item.id)
            });
            clf = currentListLiked;
            dispatch(changeLiked([...clf, item.id]));
            console.log('Успешно добавленно в лайкнутое!');
        } else {
            // Документ не существует, создаем его
            await setDoc(userFavoritesRef, {
                likedItems: [item.id]
            });
            clf = currentListLiked;
            dispatch(changeLiked([...clf, item.id]));
            console.log('Успешно добавленно в лайкнутое, создав перед этим!!!');
        }
        console.log('item.posti: ', item.postIndex);
        setCountLikePressed((current) => current+1);
        setLikeProcess(false);
    };

    const [showText, setShowText] = useState(false);
    const onPressChevron = () =>{
        setShowText((current)=>!current)
    }

    const [favoritePressed, setFavoritePressed] = useState(false);
    const [favoriteProcess, setFavoriteProcess] = useState(false);
    const onPressFavorite = () => {
        if(favoritePressed == false) {
            if (currentUser) {
            setFavoriteProcess(true);
            setFavoritePressed(!favoritePressed);
            const userUID = currentUser.uid;
            addToFavorites(userUID);
            } else {
                console.log('Пользователь не вошел в систему');
            }
            }
            else{
            if (currentUser) {
                setFavoriteProcess(true);
                setFavoritePressed(!favoritePressed);
                const userUID = currentUser.uid;
                deleteFromFavorites(userUID)
            }
        }
        
    }

    const deleteFromFavorites = async (userUID) => {
        const userFavoritesRef = doc(FIREBASE_STORE, 'favorites', userUID);
        await updateDoc(userFavoritesRef, {
        favoriteItems: arrayRemove(item.id)
        });
        console.log('Успешно удалено из избранного!!');
        deleteFromPostList(item);
        dispatch(removeFromFavorites(item.id))
        setFavoriteProcess(false);
    }
    
    const addToFavorites = async (userUID) => {
        const userFavoritesRef = doc(FIREBASE_STORE, 'favorites', userUID);

        const docSnapshot = await getDoc(userFavoritesRef);

        if (docSnapshot.exists()) {
            // Документ существует, можно использовать updateDoc
            await updateDoc(userFavoritesRef, {
                favoriteItems: arrayUnion(item.id)
            });
            clf = currentListFavorites;
            dispatch(changeFavorites([...clf, item.id]));
            console.log('Успешно добавленно в избранное!');
        } else {
            // Документ не существует, создаем его
            await setDoc(userFavoritesRef, {
                favoriteItems: [item.id]
            });
            clf = currentListFavorites;
            dispatch(changeFavorites([...clf, item.id]));
            console.log('Успешно добавленно в избранное, создав перед этим!!!');
        }
        backToPostList(item);
        setFavoriteProcess(false);
    };

    const alreadyLiked = (elementID) => {
        const alreadyInLiked = currentListLiked.includes(elementID);
        return alreadyInLiked;
    }

    const alreadyFavorite = (elementID) => {
        const alreadyInFavorite = currentListFavorites.includes(elementID);
        return alreadyInFavorite;
    }

    useEffect(() => {
        setLikePressed(alreadyLiked(item.id));
        setFavoritePressed(alreadyFavorite(item.id));
    }, []);






  const [visible, setVisible] = useState(false);
  const images = [{
    // Simplest usage.
    url: item.image,

    // width: number
    // height: number
    // Optional, if you know the image size, you can set the optimization performance

    // You can pass props to <Image />.
    props: {
        // headers: ...
    }
  }]

    return(
        
        <View style={styles.wrapper}>
            <View style={styles.headerContent}>
                <Text numberOfLines={1} style={styles.headerContent__text}>Пост</Text>
                <View style={styles.headerContent__icoWrapper}>
                <Pressable onPress={() => navigation.navigate('2')}><Ionicons style={styles.icoWrapper_ico} name={'exit-outline'} size={25} color={'#000'} /></Pressable>
                </View>
            </View>
            <View style={styles.content}>
                <Pressable onPress={() => setVisible(true)}>
                    <Image style={styles.content__image}
                    source={{uri: item.image}}
                    lazy={true}
                    />
                </Pressable>
                <Modal visible={visible} presentationStyle="overFullScreen" transparent={true} onRequestClose={() => setVisible(false)}>
                    <ImageViewer
                    imageUrls={images}
                    index={0}
                    onSwipeDown={() => setVisible(false)}
                    enableSwipeDown={true}
                    backgroundColor='#bfbfbfaf'
                    />
                </Modal>
                <View style={styles.content__iconsWrapper}>
                    {likeProcess? <ActivityIndicator style={{marginLeft: 15, marginRight: 5}} size="small" color="#dddddd"/> :
                    <Pressable onPress={onPressLike}><Ionicons style={styles.iconsWrapper_ico} name={likePressed ? 'heart' : 'heart-outline'} size={25} color={likePressed ? '#fa6670' : '#8c8c8c'} /></Pressable>
                    }
                    <Text>{countLikePressed}</Text>
                    <Pressable><Ionicons style={styles.iconsWrapper_ico} name={'chatbubble-outline'} size={25} color={'#91417f42'} /></Pressable>
                    <Text>{countComments}</Text>
                    {favoriteProcess? <ActivityIndicator style={{marginLeft: 15, marginRight: 5}} size="small" color="#dddddd"/> :
                    <Pressable onPress={onPressFavorite}><Ionicons style={styles.iconsWrapper_ico} name={favoritePressed? 'bookmark' : 'bookmark-outline'} size={25} color={favoritePressed? '#ff4545' :  '#8c8c8c'} /></Pressable>
                    }
                    <Pressable onPress={onPressChevron}><Ionicons style={styles.iconsWrapper_ico} name={showText ? 'chevron-up-outline' : 'chevron-down-outline'} size={25} color={'#8c8c8c'} /></Pressable>
                    <Pressable><Ionicons style={styles.iconsWrapper_ico} name={'git-merge-outline'} size={25} color={'#8c8c8c'} /></Pressable>
                </View>
                <View style={styles.content__textContent}>
                    {showText?(<Text style={styles.textContent__text}>{item.text}</Text>):null}
                    <FlatList showsVerticalScrollIndicator={false}
                    data={listComments} 
                    renderItem={({item}) => (
                    <View style={styles.textContent__commentContent}>
                        <Ionicons style={styles.iconsWrapper_ico} name={'chatbubble'} size={20} color={'#85427528'} />
                        <Text>- {item}</Text>
                    </View>
                    )}
                    />
                    <View style={styles.textContent__commentCreateContent}>
                    <TextInput style={styles.commentCreateContent__input} multiline={true} 
                    placeholder='Введите комментарий' autoCapitalize='none' value={newComment} 
                    onChangeText={(text) => setNewComment(text)}
                    />
                    {commentSendLoading? <ActivityIndicator size="large" color="#dddddd"/> : 
                    <Pressable onPress={() => addCommentToDocument(item.id, newComment)} style={styles.commentCreateContent__pressable}>
                        <Ionicons name={'paper-plane-outline'} size={25} color={'#612353'} />
                    </Pressable>}
                    </View>
                </View>
            </View>
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
        height:95,
        backgroundColor: '#f5f5f5',
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
    content: {
     flex: 1,
     backgroundColor: '#F5F5F5',
     borderBottomColor: '#e5e5e5',
     borderBottomWidth: 6,
     width: '100%',
     alignSelf: 'center',
    // marginBottom: 5
    },
    content__image:{
        width: '100%',
        height: 260,
    },
    content__iconsWrapper: {
      flex: 0,
      flexDirection: 'row',
      width: '100%',
      paddingVertical: 10,
      borderBottomColor: '#e5e5e5',
      borderBottomWidth: 2,
      
    },
    iconsWrapper_ico: {
        marginLeft: 15,
        marginRight: 5
    },
    content__textContent: {
      flex: 1,
      backgroundColor: '#ededed',
    },
    textContent__text: {
        fontSize: 16,
        color: '#000',
        flex: 0,
        marginBottom: 5,
        marginHorizontal: 10,
        marginTop: 5,
        paddingBottom: 2,
        
    },
    textContent__commentContent: {
      flexDirection: 'row',
      paddingTop: 3,
      paddingBottom: 2,
      borderTopColor: '#e5e5e5',
      borderTopWidth: 2,
    },
    textContent__commentCreateContent: {
      flexDirection: 'row',
      alignItems: 'center',
      borderTopColor: '#e5e5e5',
      borderTopWidth: 2,
      paddingTop: 2,
      marginBottom: 3
    },
    commentCreateContent__input: {
      height: 40,
      width: 270,
      borderColor: 'red',
      margin: 3,
      borderRadius: 15,
      borderTopWidth: 0.4,
      borderLeftWidth: 0.4,
      borderRightWidth: 1.2,
      borderBottomWidth: 2.2,
      borderColor: '#612353',
      backgroundColor: '#ffffff3f',
      marginLeft: 15,
      paddingHorizontal: 5
  },
    commentCreateContent__pressable: {
      alignItems: 'center',
      marginLeft: 7,
    },
    
});