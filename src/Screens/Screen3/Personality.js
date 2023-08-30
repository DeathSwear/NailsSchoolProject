import {View, Text, StyleSheet, ActivityIndicator, Button, ImageBackground, Pressable} from 'react-native';
import React, {useState} from 'react';
import { FIREBASE_AUTH } from '../../DB/firebaseConfig';

import { useSelector, useDispatch } from 'react-redux';
import { change } from '../../store/loginedSlice';
import { changeLiked } from '../../store/listLikedSlice';
import { changeFavorites } from '../../store/listFavoritesSlice';
import Ionicons from 'react-native-vector-icons/Ionicons';
const Personality = ({ navigation }) => {
    
    const dispatch = useDispatch();
    const logined = useSelector((state) => state.logined.value);

    signOutAccount = () => {
        FIREBASE_AUTH.signOut();
        //navigation.navigate('1');
        dispatch(change(false));
        dispatch(changeFavorites([]));
        dispatch(changeLiked([]));
    }


    return(
        <View style={styles.wrapper}>
            <View style={styles.headerContent}>
                <Text numberOfLines={1} style={styles.headerContent__text}>Аккаунт</Text>
                <View style={styles.headerContent__icoWrapper}>
                    <Pressable onPress={() => navigation.navigate('2')}><Ionicons style={styles.icoWrapper_ico} name={'exit-outline'} size={25} color={'#000'} /></Pressable>
                </View>
            </View>
            <View style={styles.container}>
                <Text style={styles.container__Text}>Выйти из аккаунта</Text>
                <Pressable onPress={signOutAccount}><Ionicons style={styles.icoWrapper_ico} name={'exit-outline'} size={50} color={'#000'} /></Pressable>
            </View>
        </View>
    );

};

export default Personality;

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: '#fafafa',
        flex: 1,
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
        alignItems: 'center',
        justifyContent: 'center',
    },
    container__Text: {
        fontSize: 22
    }

});