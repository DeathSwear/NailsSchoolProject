
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: [],
};

export const listLikedSlice = createSlice({
  name: 'listLiked',
  initialState: initialState, 
  reducers: {
    changeLiked: (state, action) => {
      state.value = action.payload;
    },
    removeFromLiked: (state, action) => {
        const elementToRemove = action.payload;
        state.value = state.value.filter(item => item !== elementToRemove);
      },
  },
});

export const { changeLiked, removeFromLiked } = listLikedSlice.actions;
export default listLikedReducer = listLikedSlice.reducer;