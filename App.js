import * as React from 'react';
//import { View, Text, Button } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { Navigator } from './src/navigation/Navigator';
import {Provider} from "react-redux";
import { store } from './src/store/store';


export default function App() {
    return (
    <Provider store={store}>
        <NavigationContainer>
          <Navigator/>
        </NavigationContainer>
    </Provider>
    
  );
}

/*
<PersistGate loading={null} persistor={persistor}> </PresistDate> (они внутри провайдера)



// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and latr, measurementId is optionale
const firebaseConfig = {
  apiKey: "AIzaSyAOx6IIyjKncI1ncug-CiL5SacJc9ZGZag",
  authDomain: "nails-reactnative.firebaseapp.com",
  projectId: "nails-reactnative",
  storageBucket: "nails-reactnative.appspot.com",
  messagingSenderId: "521965448859",
  appId: "1:521965448859:web:942adbfd80d7d21c00e03e",
  measurementId: "G-RR0YCZQEC6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);*/