import React, { useState } from 'react';
import { Text, View, Pressable, Image, StyleSheet} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function PostItem({el}){

  const [likePressed, setLikePressed] = useState(0);
  const [pressed, setPressed] = useState(false); //лучше так? (строки 8 и 13)
  const [likeColor, setLikeColor] = useState('#8c8c8c');
  const [likeStyle, setLikeStyle] = useState('heart-outline');

  const onPressLike = () =>{
    if(!pressed){ setLikePressed((current) => current+1); setLikeColor(() => '#fa6670'); setLikeStyle(() => 'heart'); }
    else{ setLikePressed((current) => current-1); setLikeColor(() => '#8c8c8c'); setLikeStyle(() => 'heart-outline'); }
    setPressed((current) => !current);
  }

  const [showText, setShowText] = useState(false);
  const [chevronStyle, setChevronStyle] = useState('chevron-down-outline');
  const onPressChevron = () =>{//или без проверочнного юзстейта? строка 21
    setShowText((current)=>!current)
    if(chevronStyle === 'chevron-down-outline') setChevronStyle(()=>'chevron-up-outline');
    else setChevronStyle(()=>'chevron-down-outline');
  }


  const [favoriteColor, setFavoriteColor] = useState('#8c8c8c');
  const [favoriteStyle, setFavoriteStyle] = useState('bookmark-outline');

  const onPressFavorite = () => {
    if(favoriteStyle === 'bookmark-outline'){  setFavoriteColor(() => '#ff4545'); setFavoriteStyle(() => 'bookmark'); }
    else{ setFavoriteColor(() => '#8c8c8c'); setFavoriteStyle(() => 'bookmark-outline'); }
  }


  return(
    <View style={styles.content}>
      <Image style={styles.content__image}
        source={el.image}/>
      <View style={styles.content__iconsWrapper}>
        <Pressable onPress={onPressLike}><Ionicons style={styles.iconsWrapper_ico} name={pressed ? 'heart' : 'heart-outline'} size={25} color={likeColor} /></Pressable>
        <Text>{likePressed}</Text>
        <Pressable><Ionicons style={styles.iconsWrapper_ico} name={'chatbubble-outline'} size={25} color={'#8c8c8c'} /></Pressable>
        <Text>0</Text>
        <Pressable onPress={onPressFavorite}><Ionicons style={styles.iconsWrapper_ico} name={favoriteStyle} size={25} color={favoriteColor} /></Pressable>
        <Pressable onPress={onPressChevron}><Ionicons style={styles.iconsWrapper_ico} name={chevronStyle} size={25} color={'#8c8c8c'} /></Pressable>
        <Pressable><Ionicons style={styles.iconsWrapper_ico} name={'git-merge-outline'} size={25} color={'#8c8c8c'} /></Pressable>
      </View>
      {showText?(<Text style={styles.content__text}>{el.text}</Text>):null}    
    </View>
  );
}
const styles = StyleSheet.create({
    content: {
     flex: 1,
     backgroundColor: '#F5F5F5',
     borderBottomColor: '#e5e5e5',
     borderBottomWidth: 5,
     width: '100%',
     alignSelf: 'center',

    // marginBottom: 5
    },
    content__image:{
        width: '100%',
        height: 260,
    },
    content__text: {
        fontSize: 16,
        alignSelf: 'center',
        color: '#000',
        flex: 1,
        //width: '90%',
        marginBottom: 10,
    },
    content__iconsWrapper: {
        flex: 1,
        flexDirection: 'row',
        marginVertical: 10
    },
    iconsWrapper_ico: {
        marginLeft: 15,
        marginRight: 5
    }
  });