
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: 'none',
};

export const chooseThemeSlice = createSlice({
  name: 'theme', // This is the name of the slice, we will later use this name to access the slice from the store
  initialState: initialState, // This is the initial state of the slice
  reducers: {
    change: (state, action) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { change } = chooseThemeSlice.actions;

// We export the reducer function so that it can be added to the store
export default chooseThemeReducer = chooseThemeSlice.reducer;