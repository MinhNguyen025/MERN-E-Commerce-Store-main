// File: src/redux/features/cart/cartSlice.js

import { createSlice } from "@reduxjs/toolkit";
import { updateCart } from "../../../Utils/cartUtils";

const initialState = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : { cartItems: [], shippingAddress: {}, paymentMethod: "PayPal" };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, qty, name, price, image, countInStock } = action.payload;
      const existItem = state.cartItems.find((x) => x.product === product);

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x.product === existItem.product ? { ...x, qty } : x
        );
      } else {
        state.cartItems = [...state.cartItems, { product, qty, name, price, image, countInStock }];
      }
      return updateCart(state);
    },

    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x.product !== action.payload);
      return updateCart(state);
    },

    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem("cart", JSON.stringify(state));
    },

    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      localStorage.setItem("cart", JSON.stringify(state));
    },

    clearCartItems: (state) => {
      state.cartItems = [];
      // state.shippingAddress = {};
      state.paymentMethod = "PayPal";
      return updateCart(state);
    },

    resetCart: (state) => {
      state.cartItems = [];
      state.shippingAddress = {};
      state.paymentMethod = "PayPal";
      localStorage.removeItem("cartItems");
      localStorage.removeItem("shippingAddress");
      localStorage.removeItem("paymentMethod");
    },

    setCartItemsFromDB: (state, action) => {
      // action.payload là mảng cartItems từ backend đã được map
      state.cartItems = action.payload.map(item => ({
        product: item._id,             // ID sản phẩm
        name: item.name,               // Tên sản phẩm
        price: item.price,             // Giá sản phẩm
        image: item.image,             // Hình ảnh sản phẩm
        qty: item.qty,                 // Số lượng
        countInStock: item.countInStock, // Số lượng trong kho
      }));
      localStorage.setItem("cart", JSON.stringify(state));
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  savePaymentMethod,
  saveShippingAddress,
  clearCartItems,
  resetCart,
  setCartItemsFromDB,
} = cartSlice.actions;

export default cartSlice.reducer;
