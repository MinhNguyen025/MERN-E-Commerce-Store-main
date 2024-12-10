import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { apiSlice } from "./api/apiSlice";
import authReducer from "./features/auth/authSlice";
import favoritesReducer from "../redux/features/favorites/favoriteSlice";
import cartSliceReducer from "../redux/features/cart/cartSlice";
import shopReducer from "../redux/features/shop/shopSlice";
import { getFavoritesFromLocalStorage } from "../Utils/localStorage";
import { categoryApiSlice } from "./api/categoryApiSlice"; // Import categoryApiSlice
import { userApiSlice } from "./api/usersApiSlice";

const initialFavorites = getFavoritesFromLocalStorage() || [];

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    [categoryApiSlice.reducerPath]: categoryApiSlice.reducer, // Thêm reducer của categoryApiSlice
    [userApiSlice.reducerPath]: userApiSlice.reducer,
    auth: authReducer,
    favorites: favoritesReducer,
    cart: cartSliceReducer,
    shop: shopReducer,
  },

  preloadedState: {
    favorites: initialFavorites,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware, categoryApiSlice.middleware, userApiSlice.middleware),
  devTools: true,
});

setupListeners(store.dispatch);
export default store;
