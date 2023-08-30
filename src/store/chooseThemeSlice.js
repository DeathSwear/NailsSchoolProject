
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: [],
};

export const chooseThemeSlice = createSlice({
  name: 'theme',
  initialState: initialState, 
  reducers: {
    changeTheme: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { changeTheme } = chooseThemeSlice.actions;
export default chooseThemeReducer = chooseThemeSlice.reducer;