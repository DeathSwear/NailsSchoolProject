import {View, Text, StyleSheet, TextInput, ActivityIndicator, Button} from 'react-native';
import React, {useState} from 'react';
import { FIREBASE_AUTH } from '../DB/firebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

import { useSelector, useDispatch } from 'react-redux';
import { change } from '../store/loginedSlice';


const Login = () => {
    const dispatch = useDispatch();
    //const logined = useSelector((state) => state.logined.value);


    const [email, setEmail]= useState('');
    const [password, setPassword]= useState('');
    const [loading, setLoading]= useState(false);
    const auth = FIREBASE_AUTH;

    const signIn = async () => {
        setLoading(true);
        try {
            const response = await signInWithEmailAndPassword(auth, email, password);
            console.log(response);
            dispatch(change(true)); /////////////////
        } catch (error) {
            console.log(error);
        } finally{
            setLoading(false);
        }
    }

    const signUp = async () => {
        setLoading(true);
        try {
            const response = await createUserWithEmailAndPassword(auth, email, password);
            console.log(response);
        } catch (error) {
            console.log(error);
        } finally{
            setLoading(false);
        }
    }

    return(
        <View style={styles.wrapper}>
            <Text>Login Screen</Text>
            <TextInput style={styles.input} placeholder='Email' autoCapitalize='none' value={email} onChangeText={(text) => setEmail(text)}/>
            <TextInput secureTextEntry={true} style={styles.input} placeholder='Password' autoCapitalize='none' value={password} onChangeText={(text) => setPassword(text)}/>
            {loading? <ActivityIndicator size="large" color="#dddddd"/> : <>
            <Button title='Login' onPress={signIn}/>
            <Button title='Create' onPress={signUp}/>
            </>}
        </View>
    );

};

export default Login;

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: '#fafafa',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      },
    input: {
        height: 40,
        width: 300,
        borderColor: 'red',
        borderWidth: 1,
        margin: 3,
    }

});