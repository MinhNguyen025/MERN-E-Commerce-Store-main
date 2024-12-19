// File: src/redux/api/usersApiSlice.js

import { apiSlice } from "./apiSlice";
import { USERS_URL } from "../constants";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth`,
        method: "POST",
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
      }),
    }),
    profile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: "PUT",
        body: data,
      }),
    }),
    getUsers: builder.query({
      query: ({ page = 1, limit = 5, search = "" }) => {
        const params = new URLSearchParams({
          page,
          limit,
        });

        if (search) {
          params.append("search", search);
        }

        return `${USERS_URL}?${params.toString()}`;
      },
      providesTags: ["User"],
      keepUnusedDataFor: 5,
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `${USERS_URL}/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
    getUserDetails: builder.query({
      query: (id) => ({
        url: `${USERS_URL}/${id}`,
      }),
      keepUnusedDataFor: 5,
    }),
    updateUser: builder.mutation({
      query: ({ userId, username, email }) => ({
        url: `${USERS_URL}/${userId}`,
        method: "PUT",
        body: { username, email },
      }),
      invalidatesTags: ["User"],
    }),
    // Endpoint lấy giỏ hàng của user
    getUserCart: builder.query({
      query: (userId) => `${USERS_URL}/${userId}/cart`,
      providesTags: ["User"], 
    }),

    // Endpoint cập nhật giỏ hàng của user
    updateUserCart: builder.mutation({
      query: ({ userId, cartItems }) => ({
        url: `${USERS_URL}/${userId}/cart`,
        method: "POST",
        body: { cartItems }, // 'cartItems' có cấu trúc [{ product: ID, qty: number }, ...]
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useProfileMutation,
  useGetUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useGetUserDetailsQuery,
  useGetUserCartQuery, 
  useUpdateUserCartMutation
} = userApiSlice;
