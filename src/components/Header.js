import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function Header(){
    return(
        
        <View style={styles.headerContent}>
            <Text numberOfLines={1} style={styles.headerContent__text}>Название приложения</Text>
            <View style={styles.headerContent__icoWrapper}>
                <Ionicons style={styles.icoWrapper_ico} name={'search-outline'} size={25} color={'#000'} />
                <Ionicons style={styles.icoWrapper_ico} name={'reorder-three-outline'} size={25} color={'#000'} />
            </View>
        </View>

    );
}
const styles = StyleSheet.create({
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
        fontSize: 22,
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