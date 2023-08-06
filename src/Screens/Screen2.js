import React, {useEffect, useState, useRef} from 'react';
import { StyleSheet, Text, View, FlatList, Button, ActivityIndicator, Alert} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PostItem from '../components/PostItem';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { collection, getDocs, query, orderBy, limit, where, startAfter } from "firebase/firestore";
import { FIREBASE_STORE } from '../DB/firebaseConfig';
//import { createDatabase, updateData, deleteDB, insertInfo, select } from '../DB/DBManagement';
import { FIREBASE_STORAGE } from '../DB/firebaseConfig';

import { useSelector } from 'react-redux';

export const Screen2 = () => {
    const storage = FIREBASE_STORAGE;
    const db = FIREBASE_STORE;
    const [listPosts, setListPosts] = useState([]);
    const [lastVisible, setLastVisible] = useState(null);
    const [loading, setLoading] = useState(false);

    const themes = useSelector((state) => state.theme.value);
    const flatListRef = useRef(null);

    const getPostsWithNewTheme = async () => {
        setLoading(true); // Устанавливаем состояние загрузки в true
        flatListRef?.current.scrollToOffset({ animated: true, offset: 0 });
        setListPosts([]); // Очищаем список постов
        setLastVisible(null); // Сбрасываем последний видимый элемент
        await getPosts(); // Загружаем элементы с новой темой
        setLoading(false); // Устанавливаем состояние загрузки обратно в false
      };

    const getPosts = async () => {
        try {
          const q = query(collection(db, "posts"), where("themes", "array-contains-any", themes),  limit(5));
          const querySnapshot = await getDocs(q);
    
          if (!querySnapshot.empty) {
            const newPosts = querySnapshot.docs.map((doc) => ({
              id: doc.id, ...doc.data()
            }));
            setListPosts(newPosts);
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
                    const newPosts = querySnapshot.docs.map((doc) => ({
                    id: doc.id, ...doc.data()
                    }));
                    setListPosts((prevList) => [...prevList, ...newPosts]);
                    setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
                }
            }
        } catch (error) {
            console.error("Error loading more posts: ", error);
        } finally {
            setLoading(false);
        }
    };

    // Следим за изменениями темы, и при изменении вызываем функцию getPostsWithNewTheme
    useEffect(() => {
        if (themes.length > 0) getPostsWithNewTheme();
    }, [themes]);

    /*const getPosts = async () => {
        const querySnapshot = await getDocs(collection(db, "posts"));
        const posts = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setListPosts(posts);
    }*/

    const setNullList = () => {
        setListPosts(null);
        setLastVisible(null);
    }

    const testFirestoreGetDocs = async () => {
        console.log('\n---Start Getting ---');
        /*listPosts.forEach((post) => {
            console.log(`${post.id} => ${post.text}`);
        });*/
        themes.forEach(element => {
            console.log(`${element} => el`);
        });
        console.log('---End Getting ---');
    }

    testf = () => {
        console.log(`${['1', '2']<['1']? '1' : '2'}`);
    }

    return(
        
        <View style={styles.wrapper}>
            <View style={styles.headerContent}>
                <Text numberOfLines={1} style={styles.headerContent__text}>✨Luna - выбор маникюра</Text>
                <View style={styles.headerContent__icoWrapper}>
                    <Ionicons style={styles.icoWrapper_ico} name={'reorder-three-outline'} size={25} color={'#000'} />
                </View>
            </View>
            {loading? <ActivityIndicator style={styles.activity} size="large" color="#dddddd"/> : null}
                <FlatList 
                ref={flatListRef}
                data={listPosts} 
                renderItem={({item}) => (<PostItem el={item}/>)}
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
    }
});