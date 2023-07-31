import React from 'react';
import { StyleSheet, Text, View, Button, Pressable } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useSelector, useDispatch } from 'react-redux';
import { deposit, withdraw } from '../../store/balanceSlice';
import { change } from '../../store/chooseThemeSlice';

export const Screen3=( {navigation} )=>{

    const balance = useSelector((state) => state.balance.value);
    const dispatch = useDispatch();
    const theme = useSelector((state) => state.theme.value);

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
            <Text style={styles.title}>Tab One</Text>
            <View style={{ marginVertical: 40 }}>
                <Button title="Deposit 10$" onPress={() => {dispatch(deposit(10));}} />
                <Button title="Withdraw 10$" onPress={() => {dispatch(withdraw(10));}} />
                <Button title="change" onPress={() => {dispatch(change('abc'));}} />
            </View>
            <View style={{ marginTop: 20 }}>
                <Text style={{ fontSize: 20 }}>Current Balance: {balance}$</Text>
                <Text style={{ fontSize: 20 }}>Current Theme: {theme}</Text>
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
      title: {
        fontSize: 20,
        fontWeight: 'bold',
      },

});