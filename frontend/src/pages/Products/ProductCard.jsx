// src/components/Products/ProductCard.jsx

import { Link, useNavigate } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import HeartIcon from "./HeartIcon";
import { useUpdateUserCartMutation } from "../../redux/api/usersApiSlice";

const ProductCard = ({ p }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const [updateUserCart] = useUpdateUserCartMutation();

  const addToCartHandler = async (product, qty) => {
    // Kiểm tra user đã login chưa
    if (!userInfo) {
      toast.warn("Please login to add a product to cart.");
      navigate("/login");
      return;
    }

    // Thêm vào giỏ hàng ở frontend (Redux)
    dispatch(
      addToCart({
        product: product._id,
        qty,
        name: product.name,
        price: product.price,
        image: product.image,
        countInStock: product.countInStock,
      })
    );
    toast.success("Item added successfully", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
    });

    // Cập nhật giỏ hàng lên database
    const newCartItems = [...cartItems, { product: product._id, qty: Number(qty) }];
    try {
      await updateUserCart({ userId: userInfo._id, cartItems: newCartItems }).unwrap();
      // toast.success("Cart updated on server!");
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  };

  return (
    <div className="max-w-sm relative bg-[#1A1A1A] rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex flex-col">
      <section className="relative">
        <Link to={`/product/${p._id}`}>
          <span className="absolute bottom-3 right-3 bg-red-100 text-red-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300">
            {p?.brand}
          </span>
          <img
            className="cursor-pointer w-full h-48 object-cover rounded-t-lg"
            src={p.image}
            alt={p.name}
            style={{ height: "170px", objectFit: "cover" }}
          />
        </Link>
        <HeartIcon product={p} />
      </section>

      <div className="p-5 flex flex-col justify-between flex-grow">
        <div>
          <div className="flex justify-between">
            <h5 className="mb-2 text-xl text-white dark:text-white">{p?.name}</h5>

            <p className="text-black font-semibold text-red-500">
              {p?.price?.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </p>
          </div>

          <p className="mb-3 font-normal text-[#CFCFCF]">
            {p?.description?.substring(0, 60)} ...
          </p>
        </div>

        <section className="flex justify-between items-center mt-4">
          <Link
            to={`/product/${p._id}`}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
          >
              Detail 
            <svg
              className="w-3.5 h-3.5 ml-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </Link>

          <button
            className="p-2 rounded-full"
            onClick={() => addToCartHandler(p, 1)}
          >
            <AiOutlineShoppingCart size={25} />
          </button>
        </section>
      </div>
    </div>
  );
};

export default ProductCard;
