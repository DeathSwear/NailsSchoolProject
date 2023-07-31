import {View, Text, StyleSheet, ActivityIndicator, Button, ImageBackground,} from 'react-native';
import React, {useState} from 'react';
import { FIREBASE_AUTH } from '../../DB/firebaseConfig';

import { useSelector, useDispatch } from 'react-redux';
import { change } from '../../store/loginedSlice';

const Personality = ({ navigation }) => {
    
    const dispatch = useDispatch();
    const logined = useSelector((state) => state.logined.value);

    signOutAccount = () => {
        FIREBASE_AUTH.signOut();
        //navigation.navigate('1');
        dispatch(change(false));
    }


    return(
        <View style={styles.wrapper}>
            <ImageBackground
            source={require('../../images/ProfileBack.jpg')}
            style={styles.backgroundImage}
            blurRadius={0} // Здесь задайте радиус размытия
            >
            <View style={styles.contentHeader}>
                <Text numberOfLines={1} style={styles.content__headerText}>Аккаунт</Text>
            </View>
            <View style={styles.mainWrapper}>
                <Text>Personality Screen</Text>
                <Button title='В избранное' onPress={() => navigation.navigate('2')}/>
                <Button title='Выход из аккаунта' onPress={signOutAccount}/>
            </View>
            </ImageBackground>

        </View>
    );

};

export default Personality;

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: '#fafafa',
        flex: 1,
      },
      backgroundImage: {
        flex: 1,
        resizeMode: 'cover', // Растянуть картинку на весь экран
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentHeader: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        height:75,
        backgroundColor: '#f5909777',
        paddingBottom: 10,
        height: 75
        
    },
    content__headerText: {
        flex: 1,
        fontSize: 22,
        color: '#fff',
        marginLeft: 20,
        fontFamily: 'custom-font2',
    },
    mainWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        //backgroundColor: 'blue'
      },


});