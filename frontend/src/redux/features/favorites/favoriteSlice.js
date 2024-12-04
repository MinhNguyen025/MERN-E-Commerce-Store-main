import { createSlice } from "@reduxjs/toolkit";

const favoriteSlice = createSlice({
  name: "favorites",
  initialState: [],
  reducers: {
    addToFavorites: (state, action) => {
      if (!state.some((product) => product._id === action.payload._id)) {
        state.push(action.payload);
      }
    },
    removeFromFavorites: (state, action) => {
      return state.filter((product) => product._id !== action.payload._id);
    },
    clearFavorites: () => {
      localStorage.removeItem("favorites"); // Xóa favorites khỏi localStorage
      return [];
    },
    setFavorites: (state, action) => {
      return action.payload; // Cập nhật favorites từ payload
    },
  },
});

export const {
  addToFavorites,
  removeFromFavorites,
  clearFavorites,
  setFavorites,
} = favoriteSlice.actions;

// Selector trả về danh sách sản phẩm yêu thích
export const selectFavoriteProduct = (state) => state.favorites;

export default favoriteSlice.reducer;
