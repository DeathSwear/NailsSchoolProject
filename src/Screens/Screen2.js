import React, {useEffect, useState, useRef} from 'react';
import { StyleSheet, Text, View, FlatList, Button, ActivityIndicator, Modal, Alert, Pressable} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PostItem from '../components/PostItem';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { collection, getDocs, query, orderBy, limit, where, startAfter, doc, getDoc } from "firebase/firestore";
import { FIREBASE_STORE, FIREBASE_AUTH } from '../DB/firebaseConfig';
//import { createDatabase, updateData, deleteDB, insertInfo, select } from '../DB/DBManagement';
import { useSelector, useDispatch } from 'react-redux';
import { changeTheme } from '../store/chooseThemeSlice';
import { useIsFocused } from '@react-navigation/native'; // Импорт хука
import ThemeItem from '../components/ThemeItem';
export const Screen2 = () => {

    const [postsIndex, setPostsIndex] = useState(0);
    const [postsIndexStarted, setPostsIndexStarted] = useState(false);
    const dispatch = useDispatch();
    const currentListFavorites = useSelector((state) => state.listFavorited.value);
    const currentListLiked = useSelector((state) => state.listLiked.value);

    const db = FIREBASE_STORE;
    const [listPosts, setListPosts] = useState([]);
    const [lastVisible, setLastVisible] = useState(null);
    const [loading, setLoading] = useState(false);
    const [userListFavorites, setUserListFavorites] = useState([]);

    const themes = useSelector((state) => state.theme.value);
    const flatListRef = useRef(null);

    const getPostsWithNewTheme = async () => {
        setLoading(true); // Устанавливаем состояние загрузки в true
        console.log('___gpWithNewTheme');
        flatListRef?.current.scrollToOffset({ animated: true, offset: 0 });
        setListPosts([]); // Очищаем список постов
        setLastVisible(null); // Сбрасываем последний видимый элемент
        /*if(auth.currentUser !== null)
        {
            if(auth.currentUser.uid !== null)
                await getFavorites();
        }*/
        if(themes.length>0)
            await getPosts(); // Загружаем элементы с новой темой
        setLoading(false); // Устанавливаем состояние загрузки обратно в false
      };

    const getPosts = async () => {
        try {
            const q = query(collection(db, "posts"), where("themes", "array-contains-any", themes),  limit(5));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
            const newPosts = querySnapshot.docs.map((doc, index) => ({
                id: doc.id,
                favorited: alreadyFavorite(doc.id),
                liked: alreadyLiked(doc.id),
                postIndex: postsIndex + index,
                ...doc.data()
            }));
            setListPosts(newPosts);
            console.log('PI = ',postsIndex);
            console.log('len = ',newPosts.length);
            const PI = postsIndex + newPosts.length;
            setPostsIndex(PI); // Обновляем postIndex
            console.log('PI2 = ',postsIndex);

            setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
        }
        } catch (error) {
          console.error("Error getting posts: ", error);
        }
      };

    const loadMorePosts = async () => {
        try {
            if (!loading && lastVisible && (themes.length > 0)) { // Проверяем, что загрузка еще не идет и есть последний видимый элемент
                setLoading(true);
                const q = query(collection(db, "posts"), startAfter(lastVisible), where("themes", "array-contains-any", themes), limit(5));
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    const newPosts = querySnapshot.docs.map((doc, index) => ({
                        id: doc.id,
                        favorited: alreadyFavorite(doc.id),
                        liked: alreadyLiked(doc.id),
                        postIndex: postsIndex + index,
                        ...doc.data()
                    }));
                    setListPosts((prevList) => [...prevList, ...newPosts]);
                    const PI = postsIndex + newPosts.length;
                    setPostsIndex(PI); // Обновляем postIndex
                    setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
                }
            }
        } catch (error) {
            console.error("Error loading more posts: ", error);
        } finally {
            setLoading(false);
        }
    };


    // выпнуть пользователя, если почему-то при перезапуске он еще вошедший
    const logined = useSelector((state) => state.logined.value);
    const auth = FIREBASE_AUTH;
    useEffect(() => {
        console.log('-----------------------------------------------------------------lOGINED');
        const currentUser = auth.currentUser;
        if(currentUser && !logined)
        signOut();  
    }, [logined]);
    
    const isFocused = useIsFocused();

    useEffect(() => {
        console.log('-----------------------------------------------------------------THEMES');
        if (themes.length > 0){
            setPostsIndex(0);
            setPostsIndexStarted(false);
            
        }
    }, [themes]);
    useEffect(() => {
        console.log('-----------------------------------------------------------------PI');
        if (!postsIndexStarted){
            setPostsIndexStarted(true);
            getPostsWithNewTheme();
        }
    }, [postsIndexStarted]);

    useEffect(() => {
        console.log('-----------------------------------------------------------------CURRENT LIST FAV');
        if(!isFocused)  
        if(auth.currentUser !== null)
        {
            if(auth.currentUser.uid !== null)
            {
                setLoading(true);
                updatePosts();
            }
            
        }
    }, [currentListFavorites, currentListLiked]);

    const signOut = async () => {
        try {
            await auth.signOut(); 
            console.log("Пользователь выпнут из системы");
        } catch (error) {
            console.log(error);
        }
    };
    
    const alreadyFavorite = (elementID) => {
        console.log('-----------------------------------------------------------element: ', elementID);
        if(auth.currentUser !== null){
            const userUID = auth.currentUser.uid;
            if(userUID !== null) console.log('-------------------UID: ', userUID);
            console.log('-------------------listfavLength: ', currentListFavorites.length);
            console.log('-------------------listfav содержимое блять: ', currentListFavorites);

            if(userUID !== null){
                console.log('---------------alreadyFavorite Work!!!');
                //const alreadyInFavorite = userListFavorites.includes(elementID);
                const alreadyInFavorite = currentListFavorites.includes(elementID);
                //console.log('---результат сука: ', alreadyInFavorite);
                console.log('--alreadyInFavorite: ', alreadyInFavorite);
                return alreadyInFavorite;
            }
        }
        console.log('--alreadyInFavorite: PERMA FALSE');
        return false;
    }
    const alreadyLiked = (elementID) => {
        console.log('-----------------------------------------------------------like element: ', elementID);
        if(auth.currentUser !== null){
            const userUID = auth.currentUser.uid;
            if(userUID !== null) console.log('-------------------UID: ', userUID);
            console.log('-------------------listLikedLength: ', currentListLiked.length);
            console.log('-------------------listLiked содержимое блять: ', currentListLiked);

            if(userUID !== null){
                console.log('---------------alreadyLiked Work!!!');
                //const alreadyInFavorite = userListFavorites.includes(elementID);
                const alreadyInLiked = currentListLiked.includes(elementID);
                //console.log('---результат сука: ', alreadyInFavorite);
                console.log('--alreadyInLiked: ', alreadyInLiked);
                return alreadyInLiked;
            }
        }
        console.log('--alreadyInLiked: PERMA FALSE');
        return false;
    }
    

    const getFavorites = async () => {
        const userUID = auth.currentUser.uid;
        console.log('Старт getFavorites on Screen2');
        const userFavoritesRef = doc(FIREBASE_STORE, 'favorites', userUID);
        const docSnapshot = await getDoc(userFavoritesRef);
        if (docSnapshot.exists()) {
            favoriteItems = docSnapshot.get('favoriteItems');
            setUserListFavorites(favoriteItems);
            console.log('Содержимое поля favoriteItems:', favoriteItems);
        } else {
            console.log('Поле favoriteItems не найдено или равно undefined');
        }
        console.log('Конец getFavorites on Screen2');
    };

    const addToFavoritesInPosts = (index) => {
        //console.log('__testF, i:', index);
        listPosts[index].favorited = true;
        //console.log(`listPosts[${index}].favorited = ${listPosts[index].favorited}`);
        setListPosts([...listPosts]);
    }
    const deleteFromFavoritesInPosts = (index) => {
        //console.log('__testF, i:', index);
        listPosts[index].favorited = false;
        //console.log(`listPosts[${index}].favorited = ${listPosts[index].favorited}`);
        setListPosts([...listPosts]);
    }
    const addToLikedInPosts = (index) => { 
        listPosts[index].liked = true;
        setListPosts([...listPosts]);
    }
    const deleteFromLikedInPosts = (index) => {
        listPosts[index].liked = false;
        setListPosts([...listPosts]);

    }

    const updatePosts = async () => {
        console.log('___Start update');
        listPosts.forEach((element, index) => {
            const alreadyInFavorite = alreadyFavorite(element.id);
            listPosts[index].favorited = alreadyInFavorite;
            const alreadyInLiked = alreadyLiked(element.id);
            listPosts[index].liked = alreadyInLiked;
            
        });
        setListPosts([...listPosts]);
        console.log(listPosts);
        console.log('___End update');
        setLoading(false);
    }

    const [visible, setVisible] = useState(false);
    const [allThemes, setAllThemes] = useState([]);
    const [themesLoading, setThemesLoading] = useState(false);

    const getAllTopicThemes = async () => {
        if(allThemes.length < 1){
            const querySnapshot = await getDocs(collection(db, "posts"));
            const topics = querySnapshot.docs.map((doc) => doc.data().themes).flat();
            // Получаем уникальные значения и сохраняем их в set
            const uniqueThemesSet = new Set(topics);
            // Преобразуем set обратно в массив
            const uniqueThemes = Array.from(uniqueThemesSet);
            setAllThemes(uniqueThemes);
        }
        setThemesLoading(false);
    }

    const [selectedThemes, setSelectedThemes] = useState([]);
    const chooseThemes = () => {
        setThemesLoading(true);
        setVisible(true);
        getAllTopicThemes();
        setSelectedThemes([]);
    }
    const modal_addTheme = (themeToAdd) => {
        setSelectedThemes([...selectedThemes, themeToAdd]);
    }
    const modal_removeTheme = (themeToRemove) => {
        setSelectedThemes(selectedThemes.filter(theme => theme !== themeToRemove));
    };
    const confirmSelectedThemes = () => {
        console.log('themes бляь: ',selectedThemes);
        dispatch(changeTheme(selectedThemes));
    }

    return(
        
        <View style={styles.wrapper}>
            <View style={styles.headerContent}>
                <Text numberOfLines={1} style={styles.headerContent__text}>✨Luna - выбор маникюра</Text>
                <View style={styles.headerContent__icoWrapper}>
                    <Pressable onPress={chooseThemes}><Ionicons style={styles.icoWrapper_ico} name={'reorder-three-outline'} size={25} color={'#000'} /></Pressable>
                </View>
            </View>
            <Modal style={styles.contentModal} visible={visible} transparent={true} onRequestClose={() => setVisible(false)}>
            <View style={[styles.headerContent, {height: 38}]}>
                <Text numberOfLines={1} style={styles.headerContent__text}>✨Luna - выбор маникюра</Text>
                <View style={styles.headerContent__icoWrapper}>
                    <Pressable onPress={() => setVisible(false)}><Ionicons style={styles.icoWrapper_ico} name={'reorder-three-outline'} size={25} color={'#000'} /></Pressable>
                </View>
            </View>
            {themesLoading? <ActivityIndicator style={styles.activity} size="large" color="#dddddd"/> : null}
            <View style={styles.contentModal_ListWrapper}>
                <FlatList
                    data={allThemes} 
                    renderItem={({item}) => (
                        <ThemeItem el={item} addTheme={modal_addTheme} removeTheme={modal_removeTheme}/>
                    )}/>
                <Pressable onPress={confirmSelectedThemes} style={styles.setNewThemes}><Text style={styles.setNewThemes_Text}>Подтвердить выбор тегов</Text></Pressable>
            </View>
            </Modal>
            {loading? <ActivityIndicator style={styles.activity} size="large" color="#dddddd"/> : null}
                <FlatList 
                ref={flatListRef}
                data={listPosts} 
                renderItem={({item}) => (<PostItem el={item} saveFav={addToFavoritesInPosts} delFav={deleteFromFavoritesInPosts}
                saveLiked={addToLikedInPosts} delLiked={deleteFromLikedInPosts}/>)}
                onEndReached={loadMorePosts}
                onEndReachedThreshold={0.1}
                />
        </View>
    );
}
const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: '#fafafa',
        flex: 1,
    },
    activity: {
        position: 'absolute',
        top: 72,
        alignSelf: 'center',
        zIndex: 10
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        height:75,
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
        width: 90
    },
    contentModal: {
        
    },
    contentModal_ListWrapper: {
        height: '50%',
        backgroundColor: '#dbdbdbc3',
        marginLeft: '20%',
        borderBottomLeftRadius: 20
    },
    setNewThemes: {
        width: 195,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 7,
        marginBottom: 10,
        borderRadius: 25,
        borderTopWidth: 0.4,
        borderLeftWidth: 0.4,
        borderRightWidth: 1.2,
        borderBottomWidth: 2.2,
        borderColor: '#612353',
        backgroundColor: '#edededd2',
        alignSelf: 'center'
    },
    setNewThemes_Text: {
        fontSize: 15,
        color: '#1c1c1c',
    },
});