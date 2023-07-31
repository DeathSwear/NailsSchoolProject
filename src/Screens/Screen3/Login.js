import {View, Text, StyleSheet, TextInput, ActivityIndicator, Button, ImageBackground, Pressable} from 'react-native';
import React, {cloneElement, useState} from 'react';
import { FIREBASE_AUTH } from '../../DB/firebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useDispatch } from 'react-redux'; 
import { change } from '../../store/loginedSlice';

const Login = ({ navigation }) => {
    
    const dispatch = useDispatch();

    const [email, setEmail]= useState('');
    const [password, setPassword]= useState('');
    const [loading, setLoading]= useState(false);
    const auth = FIREBASE_AUTH;
    const [stage, setStage] = useState('Choose')

    //для появления/исчезновения полей для входа/регистрации
    const signInSetStage = () => {
        if(stage==='Choose') setStage('In');
        else setStage('Choose')
    }
    const signUpSetStage = () => {
        if(stage==='Choose') setStage('Up');
        else setStage('Choose')
    }
    //вход в базу
    const signIn = async () => {
        setLoading(true);
        try {
            const response = await signInWithEmailAndPassword(auth, email, password);
            console.log(response);
            //navigation.navigate('2'); //////
            dispatch(change(true)); // запомнить, что пользователь вошел
        } catch (error) {
            console.log(error);
        } finally{
            setLoading(false);
        }
    }
    //для регистрации в базе
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
            <ImageBackground
            source={require('../../images/ProfileBack.jpg')}
            style={styles.backgroundImage}
            blurRadius={3} // Здесь задайте радиус размытия
            >
            <View style={styles.contentHeader}>
                <Text numberOfLines={1} style={styles.content__headerText}>Избранное</Text>
            </View>
            <View style={styles.mainWrapper}>
                <View style={styles.graySquare} />
                <View style={styles.mainContent}>
                    <View style={styles.chooseWrapper}>
                        <Text style={styles.chooseText}>Что бы использовать раздел</Text>
                        <View style={styles.favoritesContentWrapper}>
                            <View style={styles.favoritesContent}>
                                <Text style={styles.favoritesText}>Избранное</Text>
                                <Ionicons name={'bookmark-outline'} size={24} color={'#fff'}/>
                            </View>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={styles.chooseText}>вам сперва нужно </Text>
                            <Text style={[styles.chooseText, {textDecorationLine: 'underline'}]}>Войти </Text>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={styles.chooseText}>или </Text>
                            <Text style={[styles.chooseText, {textDecorationLine: 'underline'}]}>Создать новый аккаунт </Text>
                        </View>
                        <Text style={styles.chooseText}>если у вас его еще нет</Text>
                        {stage==='Choose'?
                        <View style={{flexDirection: 'row'}}>
                        <Pressable onPress={signInSetStage} style={styles.signInOr}><Text style={styles.signInOrText}>Войти</Text></Pressable>
                        <Pressable onPress={signUpSetStage} style={styles.signUpOr}><Text style={styles.signUpOrText}>Создать новый аккаунт</Text></Pressable>
                        </View> : <Pressable onPress={()=> setStage('Choose')} style={styles.signBack}><Text style={styles.signUpOrText}>Назад</Text></Pressable>}
                        
                    </View>
                    {stage==='Choose'? null : <>
                    <View style={styles.inputContent}>
                        <TextInput style={styles.input} placeholder='Email' autoCapitalize='none' value={email} onChangeText={(text) => setEmail(text)}/>
                        <TextInput secureTextEntry={true} style={styles.input} placeholder='Password' autoCapitalize='none' value={password} onChangeText={(text) => setPassword(text)}/>
                        {loading? <ActivityIndicator size="large" color="#dddddd"/> : <>
                        {stage==='In'? <Pressable onPress={signIn} style={styles.signInOr}><Text style={styles.signInOrText}>Войти</Text></Pressable> : null }
                        {stage==='Up'? <Pressable onPress={signUp} style={styles.signUpOr}><Text style={styles.signUpOrText}>Создать новый аккаунт</Text></Pressable> : null }
                        </>}
                    </View>
                    </>}
                </View>
            </View>
            </ImageBackground>
        </View>
    );

};

export default Login;

const styles = StyleSheet.create({
    wrapper: {
        //backgroundColor: '#f2d3d5',
        flex: 1,
      },
    input: {
        height: 40,
        width: 200,
        borderColor: 'red',
        margin: 3,
        borderRadius: 15,
        borderTopWidth: 0.4,
        borderLeftWidth: 0.4,
        borderRightWidth: 1.2,
        borderBottomWidth: 2.2,
        borderColor: '#612353',
        backgroundColor: '#ffffff3f',
    },
    contentHeader: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        height:75,
        backgroundColor: '#f0f0f077',
        paddingBottom: 10,
        height: 75
        
    },
    content__headerText: {
        flex: 1,
        fontSize: 22,
        color: '#fff',
        marginLeft: 20,
        fontFamily: 'custom-font2',
    },
    mainWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        //backgroundColor: 'blue'
      },
    mainContent: {
        width: '70%',
        height: '60%',
        padding: 20,
        //backgroundColor: 'green'
    },
    chooseText: {
        fontSize: 18,
        fontFamily: 'custom-font2',
    },
    chooseWrapper: {
        alignItems: 'center',
        //backgroundColor: 'blue',
        minWidth: 290,
    },
    favoritesContentWrapper: {
        position: 'relative',
        justifyContent: 'center',
        //borderWidth: 1,
        //borderColor: '#91247a',
        alignItems: 'center',
        height: 20,
        width: '100%',
        marginTop: 10,
        marginBottom: 10,
        backgroundColor: '#ff9494',

    },
    favoritesContent: {
        position: 'absolute',
        flexDirection: 'row',
        marginHorizontal: 8,
        marginVertical: -7,
        borderColor: '#000',
        padding: 10,
        //borderWidth: 1,
        //borderColor: '#91247a',
        alignItems: 'center',
        //backgroundColor: '#ff9494',
    },
    favoritesText: {
        fontFamily: 'custom-font2',
        fontSize: 24
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover', // Растянуть картинку на весь экран
        justifyContent: 'center',
        alignItems: 'center',
    },
    graySquare: {
        width: '80%',
        height: '60%',
        position: 'absolute', // Позволяет "перекрыть" остальной контент
        backgroundColor: '#a8a8a8',
        opacity: 0.4,
        borderRadius: 25,
    },
    InOrOut: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    signInOr: {
        backgroundColor: '#ffffff3f',
        height: 40,
        width: 95,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
        borderTopWidth: 0.4,
        borderLeftWidth: 0.4,
        borderRightWidth: 1.2,
        borderBottomWidth: 2.2,
        borderColor: '#612353',
        //position: 'absolute',
    },
    signInOrText: {
        fontSize: 16,
        textDecorationLine: 'underline',
    },
    signUpOr: {
        width: 170,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 5,
        borderRadius: 25,
        borderTopWidth: 0.4,
        borderLeftWidth: 0.4,
        borderRightWidth: 1.2,
        borderBottomWidth: 2.2,
        borderColor: '#612353',
        backgroundColor: '#ffffff3f',
    },
    signUpOrText: {
        fontSize: 12,
        color: '#1c1c1c',
    },
    signBack: {
        height: 40,
        width: 140,
        margin: 5,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
        borderTopWidth: 0.4,
        borderLeftWidth: 0.4,
        borderRightWidth: 1.2,
        borderBottomWidth: 2.2,
        borderColor: '#612353',
        backgroundColor: '#ffffff50'
    },
    signBackText: {
        fontSize: 17,
        color: '#1c1c1c'
    },
    inputContent: {
        alignItems: 'center',
    }

});