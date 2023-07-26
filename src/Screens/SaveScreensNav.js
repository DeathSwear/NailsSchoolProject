import React from "react";
import { View, Text, Button } from "react-native";
import { useNavigation } from '@react-navigation/native';



export const Screen1 = () => {

    const navigation = useNavigation();

    return(
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>1 Screen</Text>
            <Button
                title="Go to Scr2"
                onPress={() => navigation.navigate('Screen2')}/>
        </View>
    );

};