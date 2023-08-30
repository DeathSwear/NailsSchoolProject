import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Pressable, FlatList, Image, Dimensions, ActivityIndicator} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { collection, getDoc, doc } from "firebase/firestore";
import { FIREBASE_STORE, FIREBASE_AUTH } from '../../DB/firebaseConfig';

import { useDispatch, useSelector } from 'react-redux';
import { changeFavorites } from '../../store/listFavoritesSlice';
import { changeLiked } from '../../store/listLikedSlice';

export const Screen3=( {navigation} )=>{
    const currentListFavorites = useSelector((state) => state.listFavorited.value);
    const currentListLiked = useSelector((state) => state.listLiked.value);////////////
    const dispatch = useDispatch();

    const db = FIREBASE_STORE;
    const [listFavorites, setListFavorites] = useState([]);
    const [listPosts, setListPosts] = useState([]);
    const [loading, setLoading] = useState(false);

    const auth = FIREBASE_AUTH;
    const userUID = auth.currentUser.uid;

    const reloadFavorites = () => {
        setLoading(true);
        setListPosts([]);
        setListFavorites([]);
        setLastDocIndex(0);
        console.log('сука 1');////////////////////////
        if(currentListFavorites.length > 0)
        {
            const reversedFavoriteItems = [...currentListFavorites].reverse(); // Создаем копию и разворачиваем
            setListFavorites(reversedFavoriteItems);
        }
        else setLoading(false);
            
    }

    const getFavorites = async () => {
        console.log('Старт getFavorites Scr3');
        const userFavoritesRef = doc(FIREBASE_STORE, 'favorites', userUID);
        const docSnapshot = await getDoc(userFavoritesRef);
        if (docSnapshot.exists()) {
            const favoriteItems = docSnapshot.get('favoriteItems');
            //const reversedFavoriteItems = [...favoriteItems].reverse(); // Создаем копию и разворачиваем
            dispatch(changeFavorites(favoriteItems));
            //setListFavorites(reversedFavoriteItems);
            console.log('Содержимое поля favoriteItems:', favoriteItems);
        } else {
            console.log('Поле favoriteItems не найдено или равно undefined');
        }
        console.log('Конец getFavorites Scr3');
    };
    const getLikes = async () => {
        console.log('Старт getLikes Scr3');
        const userFavoritesRef = doc(FIREBASE_STORE, 'favorites', userUID);
        const docSnapshot = await getDoc(userFavoritesRef);
        if (docSnapshot.exists()) {
            const LikedItems = docSnapshot.get('likedItems');
            //const reversedFavoriteItems = [...favoriteItems].reverse(); // Создаем копию и разворачиваем
            dispatch(changeLiked(LikedItems));
            //setListFavorites(reversedFavoriteItems);
            console.log('Содержимое поля LikedItems:', LikedItems);
        } else {
            console.log('Поле LikedItems не найдено или равно undefined');
        }
        console.log('Конец getLikes Scr3');
    };

    useEffect(() => {
        getFavorites();
        getLikes();
    }, [])

    useEffect(() => {
        console.log('сука 2');
        if(listFavorites.length > 0)
        {
            getPostsByIdArray(listFavorites, 10);
        }
    }, [listFavorites]);

    const postsRef = collection(db, 'posts');
    // Функция для загрузки документа по ID
    const getPostById = async (postId) => {
        const postDocRef = doc(postsRef, postId);
        const postDocSnapshot = await getDoc(postDocRef);
      
        if (postDocSnapshot.exists()) {
            post = { id: postId, ...postDocSnapshot.data() };
            //console.log('Проверка документа: ', post.text);
            return post;
        } else {
            console.log(`Документ с ID ${postId} не найден.`);
            return null;
        }
    };
    
    const [lastDocIndex, setLastDocIndex] = useState(0);
    // Измененная функция getPostsByIdArray с пагинацией
    const getPostsByIdArray = async ( postIdArray, limit ) => {
        console.log('Старт getPostsByIdArray Scr3');
        if (lastDocIndex >= postIdArray.length) {console.log('return getPostsByIdArray Scr3'); return;}  //что бы не делать миллион проверок, если нечего дальше догружать
        setLoading(true);
        const postsArray = [];
        let remainingDocs = limit; // Количество документов, которые осталось загрузить
        let counter = 0;
        let counter2 = 0;
        for (const postId of postIdArray) {
            if ( counter < lastDocIndex){
                counter++;
                continue;
            }
            if (remainingDocs <= 0) {
                break; // Закончили загрузку всех документов, выходим из цикла
            }
            // Загружаем следующий документ
            const post = await getPostById(postId);
            if (post) {
                counter2++;
                postsArray.push(post);
                remainingDocs--; // Уменьшаем счетчик оставшихся документов
                setLastDocIndex(lastDocIndex+counter2);
            }
        }

        setListPosts((prevListPosts) => [...prevListPosts, ...postsArray]); // Добавляем новые данные к уже существующим
        setLoading(false);
        console.log('Конец getPostsByIdArray Scr3');
    };



      // Функция для загрузки документов из коллекции "posts" по массиву ID
    /*const getPostsByIdArray = async (postIdArray) => {
        console.log('Старт getPostsByIdArray');
        const postsArray = [];
        for (const postId of postIdArray) {
            const post = await getPostById(postId);
            if (post) {
                postsArray.push(post);
            }
        }
        setListPosts(postsArray);
        console.log('Конец getPostsByIdArray');
    };*/

    const print = () => {
        console.log('Старт Вывода');
        listPosts.forEach((e) => {
            console.log(e.likes)
        })
        console.log('Конец Вывода');
    }

    const deviceWidth = Dimensions.get('window').width;
    const imageWidth = (deviceWidth/2);
    const imageHeight = imageWidth * 3 / 4;


    const deleteFromPostList = (elementToRemove) => {
        const newArray = listPosts.filter(item => item !== elementToRemove);
        setListPosts(newArray);
    }

    const backToPostList = (elementToBack) => {
        const newArray=[elementToBack]
        setListPosts((prevListPosts) => [...prevListPosts, ...newArray]);
    }
    /*
     LOG  VirtualizedList: You have a large list that is slow to update - make sure your renderItem function renders components that follow React performance best practices like PureComponent, shouldComponentUpdate, etc. {"contentLength": 3465, "dt": 620, "prevDt": 214727}*/

    return(
        <View style={styles.wrapper}>
            <View style={styles.headerContent}>
                <Text numberOfLines={1} style={styles.headerContent__text}>Избранное</Text>
                <View style={styles.headerContent__icoWrapper}>
                {userUID === "0Ym2HsM8CJQFZ0V9q89ZucUksvG3" && <Pressable onPress={() => navigation.navigate('4')}><Ionicons style={styles.icoWrapper_ico} name={'add-outline'} size={25} color={'#000'} /></Pressable>}
                <Pressable onPress={() => navigation.navigate('3')}><Ionicons style={styles.icoWrapper_ico} name={'person-circle-outline'} size={25} color={'#000'} /></Pressable>
                </View>
            </View>
            <View style={styles.container}>
                <Pressable onPress={reloadFavorites} style={{alignSelf: 'center', marginBottom: 3}}><Text style={{fontSize: 23}}>Перезагрузить</Text></Pressable>
                {loading? <ActivityIndicator style={styles.activity} size="large" color="#dddddd"/> : null}
                <FlatList
                style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}
                data={listPosts} 
                numColumns={2}
                onEndReached={() => {console.log('----------Функция добавки last=',lastDocIndex); getPostsByIdArray(listFavorites, 4);} }
                onEndReachedThreshold={0.1}
                renderItem={({item}) => (
                <Pressable onPress={() => navigation.navigate('5', {item, deleteFromPostList, backToPostList})}>
                    <Image
                    source={{uri: item.image}}
                    style={{
                        width: imageWidth,
                        height: imageHeight,
                        borderColor: '#000000',
                        borderWidth: 0.3,
                    }}
                    />
                </Pressable>
                )}
                
                />
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
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    activity: {
        position: 'absolute',
        top: 72,
        alignSelf: 'center',
        zIndex: 10
    },
});