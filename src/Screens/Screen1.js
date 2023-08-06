import React, {useState} from 'react';
import { StyleSheet, Text, View, FlatList} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ListItem from '../components/ListItem';
import Ionicons from 'react-native-vector-icons/Ionicons';


export const Screen1 = () => {

    const [listOfItems, setListOfItems] = useState([
        {text: 'Text1-1', themes: ['t1', 't11'], index:1, image:require('../images/nailTest.jpg') },
        {text: 'Text2-1', themes: ['t1', 't11'], index:2, image:require('../images/nailTest.jpg') },
        {text: 'Text3-2', themes: ['t2', 't22'], index:3, image:require('../images/nailTest.jpg') },
        {text: 'Text4-2', themes: ['t2', 't22'], index:4, image:require('../images/nailTest.jpg') },
        {text: 'Text5-3', themes: ['t3', 't33'], index:5, image:require('../images/nailTest.jpg') },
        {text: 'Text6-3', themes: ['t3', 't33'], index:6, image:require('../images/nailTest.jpg') }
      ])

      const navigation = useNavigation();

      const handleJumpToScreen2 = () => {
        navigation.jumpTo('Sc2');
      };

    return(
        
        <View style={styles.wrapper}>
            <View style={styles.headerContent}>
                <Text numberOfLines={1} style={styles.headerContent__text}>✨Luna - выбор маникюра</Text>
            </View>
            <View style={{flex:1}}>
                <FlatList data={listOfItems} renderItem={({item}) => (
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
    }

});