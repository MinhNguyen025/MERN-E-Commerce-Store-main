// File: src/pages/Auth/Login.jsx

import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation, useGetUserCartQuery } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import { setCartItemsFromDB } from "../../redux/features/cart/cartSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { search } = location;
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  const [login, { isLoading, isError, error }] = useLoginMutation();
  const { userInfo } = useSelector((state) => state.auth);

  // Hook to get user cart, enabled only when userInfo exists
  const { data: cartData, refetch: refetchCart, isFetching: isFetchingCart } = useGetUserCartQuery(userInfo?._id, {
    skip: !userInfo,
  });

  // Effect to handle navigation and cart fetching when userInfo changes
  useEffect(() => {
    const fetchCartAndNavigate = async () => {
      if (userInfo) {
        try {
          // Fetch the cart data
          const cartResponse = await refetchCart();

          if (cartResponse.data) {
            // Update the cart in Redux
            dispatch(setCartItemsFromDB(cartResponse.data));
          }

          // Navigate to the redirect URL
          navigate(redirect);
        } catch (err) {
          console.error('Error fetching cart:', err);
          toast.error("Failed to load cart. Please try again.");
          // Optionally, you can log the user out or handle this error as needed
        }
      }
    };

    fetchCartAndNavigate();
  }, [userInfo, refetchCart, dispatch, navigate, redirect]);

  const submitHandler = async (e) => {
    e.preventDefault();

    // Validate email and password
    if (!email.trim()) {
      toast.error("Email cannot be empty!");
      return;
    }
    if (!password.trim()) {
      toast.error("Password cannot be empty!");
      return;
    }

    try {
      // Attempt to log in
      const res = await login({ email, password }).unwrap();
      // Dispatch the user credentials to Redux
      dispatch(setCredentials({ ...res }));
      // No need to handle navigation here; useEffect will take care of it
    } catch (err) {
      // Log the error for debugging
      console.error("Login error: ", err);

      // Handle specific error messages
      if (err?.data?.message === "Invalid email or password") {
        toast.error("Wrong email or password!");
      } else {
        toast.error(err?.data?.message || "Something went wrong. Try again!");
      }
      // isLoading will automatically be set to false by RTK Query
    }
  };

  return (
    <div>
      <section className="pl-[10rem] flex items-center justify-between min-h-screen">
        {/* Form Sign In */}
        <div className="w-full lg:w-1/2 mr-[4rem] mt-[5rem]">
          <h1 className="text-2xl font-semibold mb-4 text-white">Sign In</h1>

          <form onSubmit={submitHandler} className="container max-w-md">
            <div className="my-[2rem]">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-white"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="mt-1 p-2 border rounded w-full"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-white"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                className="mt-1 p-2 border rounded w-full"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              disabled={isLoading}
              type="submit"
              className={`bg-red-500 text-white px-4 py-2 rounded cursor-pointer my-[1rem] flex items-center justify-center ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoading && (
                <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-white border-opacity-50 mr-2"></span>
              )}
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="mt-4">
            <p className="text-white">
              New Customer?{" "}
              <Link
                to={redirect ? `/register?redirect=${redirect}` : "/register"}
                className="text-red-500 hover:underline"
              >
                Register
              </Link>
            </p>
          </div>
        </div>

        {/* Login Image */}
        <div className="hidden lg:flex lg:items-center lg:justify-center lg:w-1/2">
          <img
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80"
            alt="Login"
            className="rounded-lg h-[80%] w-[80%] object-cover"
          />
        </div>
      </section>
    </div>
  );
};

export default Login;
