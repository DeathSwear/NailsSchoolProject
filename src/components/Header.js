import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function Header(){
    return(
        
        <View style={styles.content}>
            <Text numberOfLines={1} style={styles.content__text}>Название приложения</Text>
            <View style={styles.content__icoWrapper}>
                <Ionicons style={styles.icoWrapper_ico} name={'search-outline'} size={25} color={'#fff'} />
                <Ionicons style={styles.icoWrapper_ico} name={'reorder-three-outline'} size={25} color={'#fff'} />
            </View>
        </View>

    );
}
const styles = StyleSheet.create({
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
    }

});