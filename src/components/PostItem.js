import React, { useState, useEffect } from 'react';
import { Text, View, Pressable, Image, FlatList, ActivityIndicator, Modal, TextInput, StyleSheet} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ImageViewer from 'react-native-image-zoom-viewer';

import { doc, updateDoc, arrayUnion, setDoc, getDoc, arrayRemove } from "firebase/firestore";
import { FIREBASE_STORE } from "../DB/firebaseConfig"; 
import { FIREBASE_AUTH } from '../DB/firebaseConfig';

import { useDispatch, useSelector } from 'react-redux';
import { changeFavorites, removeFromFavorites } from '../store/listFavoritesSlice';
import { changeLiked, removeFromLiked } from '../store/listLikedSlice';

export default function PostItem({el, saveFav, delFav, saveLiked, delLiked}){



  const dispatch = useDispatch();
  const currentListFavorites = useSelector((state) => state.listFavorited.value);
  const currentListLiked = useSelector((state) => state.listLiked.value);

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
  
  const [listComments, setListComments] = useState(el.comments)

  const [commentPressed, setCommentPressed] = useState(false);
  const onPressComment = () => {
    setCommentPressed(!commentPressed);
  }
  const [countComments, setCountComments] = useState(el.comments.length)



  const [countLikePressed, setCountLikePressed] = useState(el.likes);
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
        showErrorModal();
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
      likedItems: arrayRemove(el.id)
    });
    dispatch(removeFromLiked(el.id))
    console.log('Успешно удалено из лайкнутого!!');
    setCountLikePressed((current) => current-1);
    delLiked(el.postIndex);//////////////////////////////////////////
    
    setLikeProcess(false);
  }
  
  const addToLiked = async (userUID) => {
    const userFavoritesRef = doc(FIREBASE_STORE, 'favorites', userUID);
    const docSnapshot = await getDoc(userFavoritesRef);

    if (docSnapshot.exists()) {
        // Документ существует, можно использовать updateDoc
        await updateDoc(userFavoritesRef, {
            likedItems: arrayUnion(el.id)
        });
        clf = currentListLiked;
        dispatch(changeLiked([...clf, el.id]));
        console.log('Успешно добавленно в лайкнутое!');
    } else {
        // Документ не существует, создаем его
        await setDoc(userFavoritesRef, {
            likedItems: [el.id]
        });
        clf = currentListLiked;
        dispatch(changeLiked([...clf, el.id]));
        console.log('Успешно добавленно в лайкнутое, создав перед этим!!!');
    }
    console.log('el.posti: ', el.postIndex);
    setCountLikePressed((current) => current+1);
    saveLiked(el.postIndex); ////////////////////////////////////////////////////////
    setLikeProcess(false);
  };

  const setLikesInBase = async () => {
    const userFavoritesRef = doc(FIREBASE_STORE, 'posts', el.id);
    const docSnapshot = await getDoc(userFavoritesRef);
    if (docSnapshot.exists()) {
      await updateDoc(userFavoritesRef, {
          likes: countLikePressed
      });
    }
  }


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
        showErrorModal();
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
      favoriteItems: arrayRemove(el.id)
    });
    dispatch(removeFromFavorites(el.id))
    console.log('Успешно удалено из избранного!!');
    delFav(el.postIndex);
    setFavoriteProcess(false);
  }
  
  const addToFavorites = async (userUID) => {
    const userFavoritesRef = doc(FIREBASE_STORE, 'favorites', userUID);

    const docSnapshot = await getDoc(userFavoritesRef);

    if (docSnapshot.exists()) {
        // Документ существует, можно использовать updateDoc
        await updateDoc(userFavoritesRef, {
            favoriteItems: arrayUnion(el.id)
        });
        clf = currentListFavorites;
        dispatch(changeFavorites([...clf, el.id]));
        console.log('Успешно добавленно в избранное!');
    } else {
        // Документ не существует, создаем его
        await setDoc(userFavoritesRef, {
            favoriteItems: [el.id]
        });
        clf = currentListFavorites;
        dispatch(changeFavorites([...clf, el.id]));
        console.log('Успешно добавленно в избранное, создав перед этим!!!');
    }
    console.log('el.posti: ', el.postIndex);
    saveFav(el.postIndex);
    setFavoriteProcess(false);
  };

  const [visible, setVisible] = useState(false);
  const images = [{
    // Simplest usage.
    url: el.image,

    // width: number
    // height: number
    // Optional, if you know the image size, you can set the optimization performance

    // You can pass props to <Image />.
    props: {
        // headers: ...
    }
  }]

  useEffect(() => {
    console.log('id: ', el.id);
    console.log('index: ', el.postIndex);
    console.log('favorited: ', el.favorited);
    if (el.favorited) setFavoritePressed(true);
    else if (!el.favorited) setFavoritePressed(false);
  }, [el.favorited]);
  useEffect(() => {
    console.log('id: ', el.id);
    console.log('index: ', el.postIndex);
    console.log('liked: ', el.liked);
    if (el.liked) setLikePressed(true);
    else if (!el.liked) setLikePressed(false);
  }, [el.liked]);

  useEffect(() => {
    setLikesInBase();
  },[countLikePressed])
  

  /*useEffect(() => {
    console.log('id: ', el.id);
    console.log('index: ', el.posti);
    console.log('favorited: ', el.favorited);
    console.log('Liked: ', el.liked);
    if (el.favorited) setFavoritePressed(true);
    else if (!el.favorited) setFavoritePressed(false);
    if (el.liked) setLikePressed(true);
    else if (!el.liked) setLikePressed(false);
  }, []);*/
  const [userError, setUserError] = useState(false);
  const showErrorModal = () => {
    setUserError(true);
  };
  const closeErrorModal = () => {
    setUserError(false);
  };

  return(
    <View style={styles.content}>
      <Pressable onPress={() => setVisible(true)}>
        <Image style={styles.content__image}
        source={{uri: el.image}}
        lazy={true}
        />
      </Pressable>
      <Modal visible={userError} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <Text>Сначала авторизируйтесь!:</Text>
          <Pressable styles={styles.modalContainer_Pressable} onPress={closeErrorModal}><Text style={{fontSize: 18, borderWidth: 1, padding: 2, paddingHorizontal: 6, marginTop: 3}}>OK</Text></Pressable>
        </View>
      </Modal>
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
        <Pressable onPress={onPressComment}><Ionicons style={styles.iconsWrapper_ico} name={commentPressed? 'chatbubble' : 'chatbubble-outline'} size={25} color={commentPressed? '#91417f42' : '#8c8c8c'} /></Pressable>
        <Text>{countComments}</Text>
        {favoriteProcess? <ActivityIndicator style={{marginLeft: 15, marginRight: 5}} size="small" color="#dddddd"/> :
        <Pressable onPress={onPressFavorite}><Ionicons style={styles.iconsWrapper_ico} name={favoritePressed? 'bookmark' : 'bookmark-outline'} size={25} color={favoritePressed? '#ff4545' :  '#8c8c8c'} /></Pressable>
        }
        <Pressable onPress={onPressChevron}><Ionicons style={styles.iconsWrapper_ico} name={showText ? 'chevron-up-outline' : 'chevron-down-outline'} size={25} color={'#8c8c8c'} /></Pressable>
        <Pressable><Ionicons style={styles.iconsWrapper_ico} name={'git-merge-outline'} size={25} color={'#8c8c8c'} /></Pressable>
      </View>
      <View style={styles.content__textContent}>
        {showText?(<Text style={styles.textContent__text}>{el.text}</Text>):null}
        {commentPressed? <>
        <FlatList showsVerticalScrollIndicator={false}
          data={listComments} 
          renderItem={({item}) => (
          <View style={styles.textContent__commentContent}>
            <Ionicons style={styles.iconsWrapper_ico} name={'chatbubble'} size={20} color={'#85427528'} />
            <Text>- {item}</Text>
          </View>
          )}
        />
        {currentUser &&
        <View style={styles.textContent__commentCreateContent}>
        <TextInput style={styles.commentCreateContent__input} multiline={true} 
        placeholder='Введите комментарий' autoCapitalize='none' value={newComment} 
        onChangeText={(text) => setNewComment(text)}
        />
          {commentSendLoading? <ActivityIndicator size="large" color="#dddddd"/> : 
          <Pressable onPress={() => addCommentToDocument(el.id, newComment)} style={styles.commentCreateContent__pressable}>
            <Ionicons name={'paper-plane-outline'} size={25} color={'#612353'} />
          </Pressable>}
        </View>}
        </> : null}  
      </View>
       
    </View>
  );
}
const styles = StyleSheet.create({
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
      flex: 1,
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
        flex: 1,
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
    modalContainer: {
      marginTop: '40%',
      alignSelf: 'center',
      height: 130,
      width: 200,
      backgroundColor: '#ededed98',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContainer_Pressable: {
      borderWidth: 1,
      borderRadius: 20,
      padding: 5,
      borderColor: '#000',
      backgroundColor: 'red',
      flex: 0
    },
});