
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: [],
};

export const listFavoriteSlice = createSlice({
  name: 'listFavorited',
  initialState: initialState, 
  reducers: {
    changeFavorites: (state, action) => {
      state.value = action.payload;
    },
    removeFromFavorites: (state, action) => {
        const elementToRemove = action.payload;
        state.value = state.value.filter(item => item !== elementToRemove);
      },
  },
});

export const { changeFavorites, removeFromFavorites } = listFavoriteSlice.actions;
export default listFavoriteReducer = listFavoriteSlice.reducer;