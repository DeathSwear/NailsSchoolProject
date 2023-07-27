import { configureStore } from '@reduxjs/toolkit';
//import { persistStore, persistReducer } from 'redux-persist';
//import AsyncStorage from '@react-native-async-storage/async-storage';
//import { combineReducers } from 'redux'
import balanceReducer from './balanceSlice';
import chooseThemeReducer from './chooseThemeSlice';
import loginedReducer from './loginedSlice';

//без сохранения
export const store = configureStore({
    reducer: {
        balance: balanceReducer,
        theme: chooseThemeReducer,
        logined: loginedReducer,
    },
  });
  /* redux-persist что бв сохранять наш стор в файлах, даже после закрытия приложения
  */


 // adding our persist configs
/*const persistConfig = {
    key: 'root',
    version: 1,
    storage: AsyncStorage,
  };
  
  // adding our rootReducer
  const rootReducer = combineReducers({
    balance: balanceReducer
  });
  
  // persisting our rootReducer
  const persistedReducer = persistReducer(persistConfig, rootReducer);
  
  // creating our store and exporting it
  export const store = configureStore({
    reducer: persistedReducer,
  });*/