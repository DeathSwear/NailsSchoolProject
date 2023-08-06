
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: [],
};

export const chooseThemeSlice = createSlice({
  name: 'theme',
  initialState: initialState, 
  reducers: {
    change: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { change } = chooseThemeSlice.actions;
export default chooseThemeReducer = chooseThemeSlice.reducer;