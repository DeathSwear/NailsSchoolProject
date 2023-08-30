import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ListItem from '../components/ListItem';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FIREBASE_STORE } from '../DB/firebaseConfig';
import { collection, getDocs } from "firebase/firestore";
import { useIsFocused } from '@react-navigation/native'; // Импорт хука
export const Screen1 = () => {
    const isFocused = useIsFocused();
    const db = FIREBASE_STORE;
    const [listTopic, setListTopic] = useState([]);

    const [loading, setLoading] = useState(false);

    const getTopic = async () => {
        
        const querySnapshot = await getDocs(collection(db, "topic"));
        const topic = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setListTopic(topic);
        setLoading(false);
    }
    useEffect(() => {    
        if(!listTopic.length)
        {
            setLoading(true);
            getTopic();
        }
    }, [isFocused]);

    const navigation = useNavigation();
    const handleJumpToScreen2 = () => {
        navigation.jumpTo('Sc2');
    };


    return(
        
        <View style={styles.wrapper}>
            <View style={styles.headerContent}>
                <Text numberOfLines={1} style={styles.headerContent__text}>✨Luna - выбор маникюра</Text>
            </View>
            {loading? <ActivityIndicator style={styles.activity} size="large" color="#dddddd"/> : null}
            <View style={{flex:1}}>
                <FlatList data={listTopic} renderItem={({item}) => (
                    <ListItem el={item} jumpToScreen2={handleJumpToScreen2}/>
                )}/>
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
    activity: {
        position: 'absolute',
        top: 72,
        alignSelf: 'center',
        zIndex: 10
    },

});