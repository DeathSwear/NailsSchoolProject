import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function ThemeItem({el, addTheme, removeTheme}){

    const [themePressed, setThemePressed] = useState(false);

    const pressTheme = () => {
        if(!themePressed) addTheme(el);
        else removeTheme(el);
        setThemePressed((current) => !current);
    }
    return(
    <Pressable style={styles.content} onPress={pressTheme}>
        <Ionicons name={themePressed? 'checkmark-circle-outline' : 'close-circle-outline'} size={25} color={themePressed? '#63a100' : '#823b3b'} />
        <Text style={styles.content__text}>{el}</Text>
    </Pressable>
    );
}
const styles = StyleSheet.create({
    
    content:{
        padding:5,
        backgroundColor: '#ffffff99',
        borderWidth: 0.7,
        borderBottomWidth: 1.1,
        borderTopWidth: 0.3,
        marginTop: 4,
        marginBottom: 4,
        marginLeft: 10,
        marginRight: 10,
        borderColor: '#c7c7c7',
        flexDirection: 'row',
        alignItems: 'center',
      },
      content__text: {
        color: '#000',
        fontSize: 17,
        
      }
});