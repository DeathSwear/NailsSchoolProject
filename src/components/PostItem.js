import React, { useState } from 'react';
import { Text, View, Pressable, Image, FlatList, Modal, StyleSheet} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ImageViewer from 'react-native-image-viewing';

export default function PostItem({el}){

  const [countLikePressed, setCountLikePressed] = useState(el.likes);
  const [likePressed, setLikePressed] = useState(false);

  const onPressLike = () =>{
    if(!likePressed) setCountLikePressed((current) => current+1);
    else setCountLikePressed((current) => current-1);
    setLikePressed((current) => !current);
  }

  const [showText, setShowText] = useState(false);
  const [chevronStyle, setChevronStyle] = useState('chevron-down-outline');
  const onPressChevron = () =>{
    setShowText((current)=>!current)
    if(chevronStyle === 'chevron-down-outline') setChevronStyle(()=>'chevron-up-outline');
    else setChevronStyle(()=>'chevron-down-outline');
  }

  const [favoritePressed, setFavoritePressed] = useState(false);
  const onPressFavorite = () => {
    setFavoritePressed(!favoritePressed);
  }

  const [commentPressed, setCommentPressed] = useState(false);
  const onPressComment = () => {
    setCommentPressed(!commentPressed);
  }

  const [visible, setVisible] = useState(false);


  return(
    <View style={styles.content}>
      <Pressable onPress={() => setVisible(true)}>
        <Image style={styles.content__image}
        source={{uri: el.image}}
        lazy={true}
        />
      </Pressable>
      <Modal visible={visible} presentationStyle="overFullScreen" transparent={false} onRequestClose={() => setVisible(false)}>
        <ImageViewer
          imageUrls={[{ uri: el.image }]}
          index={0}
          onSwipeDown={() => setVisible(false)}
          enableSwipeDown={true}
        />
      </Modal>
      <View style={styles.content__iconsWrapper}>
        <Pressable onPress={onPressLike}><Ionicons style={styles.iconsWrapper_ico} name={likePressed ? 'heart' : 'heart-outline'} size={25} color={likePressed ? '#fa6670' : '#8c8c8c'} /></Pressable>
        <Text>{countLikePressed}</Text>
        <Pressable onPress={onPressComment}><Ionicons style={styles.iconsWrapper_ico} name={commentPressed? 'chatbubble' : 'chatbubble-outline'} size={25} color={commentPressed? '#91417f42' : '#8c8c8c'} /></Pressable>
        <Text>{el.comments.length}</Text>
        <Pressable onPress={onPressFavorite}><Ionicons style={styles.iconsWrapper_ico} name={favoritePressed? 'bookmark' : 'bookmark-outline'} size={25} color={favoritePressed? '#ff4545' :  '#8c8c8c'} /></Pressable>
        <Pressable onPress={onPressChevron}><Ionicons style={styles.iconsWrapper_ico} name={chevronStyle} size={25} color={'#8c8c8c'} /></Pressable>
        <Pressable><Ionicons style={styles.iconsWrapper_ico} name={'git-merge-outline'} size={25} color={'#8c8c8c'} /></Pressable>
      </View>
      <View style={styles.content__textContent}>
        {showText?(<Text style={styles.textContent__text}>{el.text}</Text>):null}
        {commentPressed? (<FlatList showsVerticalScrollIndicator={false}
          data={el.comments} 
          renderItem={({item}) => (
          <View style={styles.content_commentContent}>
            <Ionicons style={styles.iconsWrapper_ico} name={'chatbubble'} size={20} color={'#85427528'} />
            <Text>- {item}</Text>
          </View>
          )}
        />) : null}  
      </View>
       
    </View>
  );
}
const styles = StyleSheet.create({
    content: {
     flex: 1,
     backgroundColor: '#F5F5F5',
     borderBottomColor: '#e5e5e5',
     borderBottomWidth: 6,
     width: '100%',
     alignSelf: 'center',
     

    // marginBottom: 5
    },
    content__image:{
        width: '100%',
        height: 260,
        
    },
    content__textContent: {
      flex: 1,
      backgroundColor: '#ededed',
    },
    textContent__text: {
        fontSize: 16,
        color: '#000',
        flex: 1,
        marginBottom: 5,
        marginHorizontal: 10,
        marginTop: 5,
        paddingBottom: 2,
        
    },
    content_commentContent: {
      flexDirection: 'row',
      paddingTop: 3,
      paddingBottom: 2,
      borderTopColor: '#e5e5e5',
      borderTopWidth: 2,
    },
    content__iconsWrapper: {
        flex: 1,
        flexDirection: 'row',
        width: '100%',
        paddingVertical: 10,
        borderBottomColor: '#e5e5e5',
        borderBottomWidth: 2,
    },
    iconsWrapper_ico: {
        marginLeft: 15,
        marginRight: 5
    }
});