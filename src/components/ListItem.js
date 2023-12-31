import React from 'react';
import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { changeTheme } from '../store/chooseThemeSlice';
//<Text  style={styles.text} >{el.text}</Text>
export default function ListItem({el, jumpToScreen2 }){
    const pressHandler = (id) => {
        console.log(id);
    }

    const dispatch = useDispatch();
    const theme = useSelector((state) => state.theme.value);

    const ChooceThemeAndJumpToScreen2 = () => {
      const newThemesArray = el.themes;
      dispatch(changeTheme(newThemesArray));
      jumpToScreen2();
    };

    return(
     <Pressable style={styles.content} onPress={ChooceThemeAndJumpToScreen2}>
        <Image style={styles.content__img} source={{uri: el.image}}/>
        <Text style={styles.content__text} numberOfLines={2} >{el.text}</Text>
     </Pressable>
    );
}
const styles = StyleSheet.create({
    
    content:{
        padding:5,
        alignSelf: 'center',
        backgroundColor: '#fff',
        borderWidth: 0.7,
        borderBottomWidth: 1.1,
        borderTopWidth: 0.3,
        marginTop: 4,
        marginBottom: 4,
        marginLeft: 7,
        marginRight: 7,
        borderColor: '#c7c7c7',
        flexDirection: 'row',
        alignItems: 'center',
        
        
      },
      content__img: {
        height: 75,
        width: 75,
        borderColor: '#ba84ae',
        borderWidth: 1.5,
        borderRadius: 50
      },
      content__text: {
        color: '#000',
        fontSize: 17,
        flex: 1,
        marginLeft: 15,
        
      }
});