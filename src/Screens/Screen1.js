import React, {useState} from 'react';
import { StyleSheet, Text, View, FlatList} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ListItem from '../components/ListItem';
import Header from '../components/Header';



export const Screen1 = () => {

    const [listOfItems, setListOfItems] = useState([
        {text: 'текст и еще текст и еще немного и текст текст текст текст', index:1, image:require('../images/nailTest.jpg') },
        {text: 'Text2', index:2, image:require('../images/nailTest.jpg') },
        {text: 'Text3', index:3, image:require('../images/nailTest.jpg') },
        {text: 'весна лето осень зима', index:4, image:require('../images/nailTest.jpg') },
        {text: 'Text2', index:5, image:require('../images/nailTest.jpg') },
        {text: 'Text3', index:6, image:require('../images/nailTest.jpg') },
        {text: 'Text1', index:7, image:require('../images/nailTest.jpg') },
        {text: 'да', index:8, image:require('../images/nailTest.jpg') },
        {text: 'Text3', index:9, image:require('../images/nailTest.jpg') },
        {text: 'Text1', index:10, image:require('../images/nailTest.jpg') },
        {text: 'Text2', index:11, image:require('../images/nailTest.jpg') },
        {text: 'текст текст текст текст текст', index:12, image:require('../images/nailTest.jpg') },
        {text: 'Text13', index:13, image:require('../images/nailTest.jpg') },
        {text: 'Text14', index:14, image:require('../images/nailTest.jpg') },
        {text: 'Text15', index:15, image:require('../images/nailTest.jpg') },
        {text: 'Text16', index:16, image:require('../images/nailTest.jpg') }
      ])

      const navigation = useNavigation();

      const handleJumpToScreen2 = () => {
        navigation.jumpTo('Sc2');
      };

    return(
        
        <View style={styles.wrapper}>
            <Header/>
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
      }

});