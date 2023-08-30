import React, { useState } from "react";
import {Text, StyleSheet} from "react-native"

//import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
//первые два экрана-раздела
import { Screen1 } from '../Screens/Screen1';
import { Screen2 } from '../Screens/Screen2';
//для удобства в настройке 3х нижних кнопок
const screen1Name = 'Sc1';
const screen2Name = 'Sc2';
const screen3Name = 'Sc3';
//три экрана, для третьего раздела
import Login from "../Screens/Screen3/Login";
import { Screen3 } from "../Screens/Screen3/Screen3";
import { AddItems } from "../Screens/Screen3/AddItems";
import  Personality  from "../Screens/Screen3/Personality"
import { PostView } from "../Screens/Screen3/PostView";

import { useSelector} from 'react-redux';


export const Navigator = () => {

  const logined = useSelector((state) => state.logined.value);
  //3й таб скрин
  const FavoriteStack = createNativeStackNavigator();
  function FavoriteStackScreen() {
    return (
      <FavoriteStack.Navigator screenOptions={{headerShown: false}}>
        <FavoriteStack.Screen name="2" component={Screen3} />
        <FavoriteStack.Screen name="3" component={Personality} />
        <FavoriteStack.Screen name="4" component={AddItems} />
        <FavoriteStack.Screen name="5" component={PostView} />
      </FavoriteStack.Navigator>
    );
  }

  const Tab = createBottomTabNavigator();
  
  return (

    <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown:false,
      tabBarActiveTintColor: '#a16493',
      tabBarInactiveTintColor: 'gray',
      tabBarItemStyle: styles.tabBarItemStyle,
      tabBarStyle: styles.tabBarStyle,
      tabBarLabel: ({color}) => {
        if(route.name === screen1Name){
          return <Text style={[{color: color}, styles.labelTextStyle]}>Тематика</Text>;
        } else if (route.name === screen2Name){
          return <Text style={[{color: color}, styles.labelTextStyle]}>Лента</Text>;
        } else if (route.name === screen3Name){
          return <Text style={[{color: color}, styles.labelTextStyle]}>Избранное</Text>;
        }
      },
      style: styles.screenOptionsStyle,
      tabBarIcon: ({ focused, color, size}) => {
        let iconName;
        if(route.name === screen1Name){
          iconName = 'list-outline';
        } else if (route.name === screen2Name){
          iconName = 'images-outline';
        } else if (route.name === screen3Name){
          iconName = 'bookmark-outline';
        }
        return <Ionicons name={iconName} size={24} color={color}/>
      },
    })}
  >
      <Tab.Screen name={screen1Name} component={Screen1}/>
      <Tab.Screen name={screen2Name} component={Screen2}/>
      <Tab.Screen name={screen3Name} component={logined ? FavoriteStackScreen : Login}/>
    </Tab.Navigator>
  );

};
const styles = StyleSheet.create({
  labelTextStyle: {
      fontSize: 13,
      fontFamily: 'custom-font2',
    },
  tabBarItemStyle:{
    display: "flex",
  },
  tabBarStyle:{
    height: 46,
    paddingTop: 4,
    paddingBottom: 1,
    display: "flex",
    backgroundColor: '#f5f5f5',
    borderTopWidth: 1,
    borderTopColor: '#c9c9c9'
  },
  screenOptionsStyle:{
    display: "flex",
  }

});