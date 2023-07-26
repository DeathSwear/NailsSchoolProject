import React from "react";
import {Text, StyleSheet} from "react-native"

//import { NavigationContainer, useNavigation } from '@react-navigation/native';
//import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { Screen1 } from '../Screens/Screen1';
import { Screen2 } from '../Screens/Screen2';
import { Screen3 } from "../Screens/Screen3";
const screen1Name = 'Sc1';
const screen2Name = 'Sc2';
const screen3Name = 'Sc3';

export const Navigator = () => {

    const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
    /*tabBarOptions={{
      style: styles.labelStyle,
    }}*/
    screenOptions={({ route }) => ({
      headerShown:false,
      //tabBarShowLabel: false,
      tabBarActiveTintColor: 'tomato',
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
        //labelStyle = styles.labelStyle;
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
        <Tab.Screen name={screen3Name} component={Screen3}/>
    </Tab.Navigator>
  );
/*
    const Stack = createNativeStackNavigator();
    return(

        
        <Stack.Navigator screenOptions={{headerShown:false}}>
            <Stack.Screen name="Screen1" component={Screen1}/>
            <Stack.Screen name="Screen2" component={Screen2}/>
            <Stack.Screen name="Screen3" component={Screen3}/>
        </Stack.Navigator>
        

    );*/

};
const styles = StyleSheet.create({
  labelTextStyle: {
      fontSize: 12,
    },
  tabBarItemStyle:{
    display: "flex",
    
  },
  tabBarStyle:{
    height: 45,
    paddingTop: 4,
    paddingBottom: 1,
    display: "flex",
  },
  screenOptionsStyle:{
    display: "flex",
  }

});