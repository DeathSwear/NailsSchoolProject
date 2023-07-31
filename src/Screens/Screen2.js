import React, {useState} from 'react';
import { StyleSheet, Text, View, FlatList} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PostItem from '../components/PostItem';
import Header from '../components/Header';

//import { createDatabase, updateData, deleteDB, insertInfo, select } from '../DB/DBManagement';

export const Screen2 = () => {

    const [listOfItems, setListOfItems] = useState([
        {text: 'текст и еще текст и еще немного и текст текст текст текст sdjffsjflkj slkdf fsjklflsj sfjskldfjkl slfkjsdklj jlsdjflkj sldfj;lsjfdkl текст и еще текст и еще немного и текст текст текст текст sdjffsjflkj slkdf fsjklflsj sfjskldfjkl slfkjsdklj jlsdjflkj sldfj;lsjfdkl текст и еще текст и еще немного и текст текст текст текст sdjffsjflkj slkdf fsjklflsj sfjskldfjkl slfkjsdklj jlsdjflkj sldfj;lsjfdkl', index:1, image:require('../images/nailTest.jpg') },
        {text: 'Text2', index:2, image:require('../images/nailTest.jpg') },
        {text: '#крута #крута #крута', index:3, image:require('../images/nailTest.jpg') },
        {text: 'весна лето осень зима', index:4, image:require('../images/nailTest.jpg') },
        {text: '#крута #крута', index:5, image:require('../images/nailTest.jpg') },
        {text: '#крута', index:6, image:require('../images/nailTest.jpg') },
        {text: 'Text1', index:7, image:require('../images/nailTest.jpg') },
        {text: 'да', index:8, image:require('../images/nailTest.jpg') },
        {text: 'Text3', index:9, image:require('../images/nailTest.jpg') },
        {text: '#крута #крута #крута #крута', index:10, image:require('../images/nailTest.jpg') }
      ])

    return(
        
        <View style={styles.wrapper}>
            <Header/>
                <FlatList data={listOfItems} renderItem={({item}) => (
                    <PostItem el={item}/>
                )}/>
        </View>
    );
}
const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: '#fafafa',
        flex: 1,
    },
});