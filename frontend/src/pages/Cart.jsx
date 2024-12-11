// File: src/pages/Cart.jsx

import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa";
import { addToCart, removeFromCart, setCartItemsFromDB } from "../redux/features/cart/cartSlice";
import emptyCartImage from "../images/empty-cart.png";
import { useUpdateUserCartMutation, useGetUserCartQuery } from "../redux/api/usersApiSlice";
import store from "../redux/store";
import { useEffect } from "react";
import { toast } from "react-toastify";

const Cart = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [updateUserCart] = useUpdateUserCartMutation();
  const { data: fetchedCartData, refetch } = useGetUserCartQuery(userInfo?._id, {
    skip: !userInfo,
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cartItems } = useSelector(state => state.cart);

  // Cập nhật Redux store khi fetch cart từ backend
  useEffect(() => {
    if (fetchedCartData) {
      dispatch(setCartItemsFromDB(fetchedCartData));
    }
  }, [fetchedCartData, dispatch]);

  // Đồng bộ cartItems với backend mỗi khi cartItems thay đổi
  useEffect(() => {
    const syncCartWithBackend = async () => {
      if (userInfo) {
        try {
          // Chỉ gửi 'product' và 'qty' cho backend
          const sanitizedCartItems = cartItems.map(item => ({
            product: item.product,
            qty: item.qty,
          }));
          console.log("Sending sanitizedCartItems to backend:", sanitizedCartItems); // Thêm log để kiểm tra
          await updateUserCart({ userId: userInfo._id, cartItems: sanitizedCartItems }).unwrap();
          // Refetch để đảm bảo dữ liệu đồng nhất
          await refetch();
        } catch (err) {
          console.error('Error updating cart:', err);
          toast.error('Failed to update cart. Please try again.');
        }
      }
    };

    syncCartWithBackend();
  }, [cartItems, userInfo, updateUserCart, refetch]);

  const addToCartHandler = (item, qty) => {
    // Dispatch addToCart với đầy đủ thông tin sản phẩm
    dispatch(addToCart({ 
      product: item.product, 
      qty,
      name: item.name,
      price: item.price,
      image: item.image,
      countInStock: item.countInStock,
    }));
    toast.success("Item added successfully", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
    });
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
    toast.success("Item removed successfully", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
    });
  };

  const checkoutHandler = () => {
    if (userInfo) {
      navigate("/shipping");
    } else {
      navigate("/login?redirect=/shipping");
    }
  };

  return (
    <>
      <div className="container flex justify-around items-start flex-wrap mx-auto mt-8">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-screen text-center">
            <img
              src={emptyCartImage}
              alt="Empty Cart"
              className="w-[300px] mb-6"
            />
            <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
            <p className="mb-6 text-gray-500">
              Build a prototype to bring your designs to life. Create a board for custom moodboards and galleries.
            </p>
            <Link
              to="/shop"
              className="bg-red-500 text-white px-6 py-3 rounded-full text-lg hover:bg-red-600 transition"
            >
              Go to Shop
            </Link>
          </div>
        ) : (
          <>
            <div className="flex flex-col w-[80%]">
              <h1 className="text-2xl font-semibold mb-4">Shopping Cart</h1>

              {cartItems.map((item) => (
                <div key={item.product} className="flex items-center mb-[1rem] pb-2">
                  <div className="w-[5rem] h-[5rem]">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>

                  <div className="flex-1 ml-4">
                    <Link to={`/product/${item.product}`} className="text-red-500">
                      {item.name}
                    </Link>

                    <div className="mt-2 text-white">{item.brand}</div>
                    <div className="mt-2 text-white font-bold">
                      $ {item.price}
                    </div>
                  </div>

                  <div className="w-24">
                    <select
                      className="w-full p-1 border rounded text-black"
                      value={item.qty}
                      onChange={(e) =>
                        addToCartHandler(item, Number(e.target.value))
                      }
                    >
                      {[...Array(item.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <button
                      className="text-red-500 mr-[5rem]"
                      onClick={() => removeFromCartHandler(item.product)}
                    >
                      <FaTrash className="ml-[1rem] mt-[.5rem]" />
                    </button>
                  </div>
                </div>
              ))}

              <div className="mt-8 w-[40rem]">
                <div className="p-4 rounded-lg">
                  <h2 className="text-xl font-semibold mb-2">
                    Items ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
                  </h2>

                  <div className="text-2xl font-bold">
                    ${" "}
                    {cartItems
                      .reduce((acc, item) => acc + item.qty * item.price, 0)
                      .toFixed(2)}
                  </div>

                  <button
                    className="bg-red-500 mt-4 py-2 px-4 rounded-full text-lg w-full"
                    disabled={cartItems.length === 0}
                    onClick={checkoutHandler}
                  >
                    Proceed To Checkout
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Cart;
