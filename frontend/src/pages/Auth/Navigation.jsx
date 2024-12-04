import { useState } from "react";
import { useRef } from "react";
import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineShoppingCart,
  AiFillFileAdd,
  AiFillMedicineBox,
  AiFillCalendar,
} from "react-icons/ai";
import { FaChalkboardUser } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Navigation.css";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/usersApiSlice";
import { logout } from "../../redux/features/auth/authSlice";
import FavoritesCount from "../Products/FavoritesCount";
import { clearFavorites } from "../../redux/features/favorites/favoriteSlice";
import { clearCartItems } from "../../redux/features/cart/cartSlice";


const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const dropdownRef = useRef(null);

  const [selectedItem, setSelectedItem] = useState("HOME"); // Trạng thái mục đang chọn

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  const handleMouseLeave = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.relatedTarget)) {
      closeDropdown();
    }
  };

  const handleItemClick = (item) => {
    setSelectedItem(item); // Cập nhật trạng thái mục được chọn
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(clearCartItems()); // Clear cart items
      dispatch(clearFavorites()); // Clear favorites
      dispatch(logout()); // Clear user authentication
      navigate("/login"); // Navigate to login page
    } catch (error) {
      console.error(error);
    }
  };
  
  return (
    <div
      style={{ zIndex: 9999 }}
      className={`${
        showSidebar ? "hidden" : "flex"
      } xl:flex lg:flex md:hidden sm:hidden flex-col justify-between p-4 text-white bg-[#000] w-[4%] hover:w-[15%] h-[100vh] fixed `}
      id="navigation-container"
    >
      <div className="flex flex-col justify-center space-y-4">
        {/* HOME */}
        <Link
          to="/"
          className={`flex items-center transition-transform transform ${
            selectedItem === "HOME" ? "bg-red-500" : ""
          } hover:bg-red-500`}
          onClick={() => handleItemClick("HOME")}
        >
          <AiOutlineHome className="mr-2 mt-[3rem]" size={26} />
          <span className="hidden nav-item-name mt-[3rem]">HOME</span>
        </Link>

        {/* SHOP */}
        <Link
          to="/shop"
          className={`flex items-center transition-transform transform ${
            selectedItem === "SHOP" ? "bg-red-500" : ""
          } hover:bg-red-500`}
          onClick={() => handleItemClick("SHOP")}
        >
          <AiOutlineShopping className="mr-2 mt-[3rem]" size={26} />
          <span className="hidden nav-item-name mt-[3rem]">SHOP</span>
        </Link>

        {/* CART */}
        <Link
          to="/cart"
          className={`flex relative transition-transform transform ${
            selectedItem === "CART" ? "bg-red-500" : ""
          } hover:bg-red-500`}
          onClick={() => handleItemClick("CART")}
        >
          <div className="flex items-center">
            <AiOutlineShoppingCart className="mt-[3rem] mr-2" size={26} />
            <span className="hidden nav-item-name mt-[3rem]">Cart</span>
          </div>
          <div className="absolute top-9">
            {cartItems.length > 0 && (
              <span>
                <span className="px-1 py-0 text-sm text-white bg-red-500 rounded-full">
                  {cartItems.reduce((a, c) => a + c.qty, 0)}
                </span>
              </span>
            )}
          </div>
        </Link>

        {/* FAVORITES */}
        <Link
          to="/favorite"
          className={`flex relative transition-transform transform ${
            selectedItem === "FAVORITE" ? "bg-red-500" : ""
          } hover:bg-red-500`}
          onClick={() => handleItemClick("FAVORITE")}
        >
          <div className="flex justify-center items-center">
            <FaRegHeart className="mt-[3rem] mr-2" size={20} />
            <span className="hidden nav-item-name mt-[3rem]">Favorites</span>
            <FavoritesCount />
          </div>
        </Link>

        {/* Admin-specific navigation links */}
        {userInfo?.isAdmin && (
          <>
            <Link
              to="/admin/dashboard"
              className={`flex items-center transition-transform transform ${
                selectedItem === "DASHBOARD" ? "bg-red-500" : ""
              } hover:bg-red-500`}
              onClick={() => handleItemClick("DASHBOARD")}
            >
              <AiOutlineHome className="mr-2 mt-[3rem]" size={26} />
              <span className="hidden nav-item-name mt-[3rem]">Dashboard</span>
            </Link>

            <Link
              to="/admin/productlist"
              className={`flex items-center transition-transform transform ${
                selectedItem === "PRODUCTS" ? "bg-red-500" : ""
              } hover:bg-red-500`}
              onClick={() => handleItemClick("PRODUCTS")}
            >
              <AiFillFileAdd className="mr-2 mt-[3rem]" size={26} />
              <span className="hidden nav-item-name mt-[3rem]">Products</span>
            </Link>

            <Link
              to="/admin/categorylist"
              className={`flex items-center transition-transform transform ${
                selectedItem === "CATEGORIES" ? "bg-red-500" : ""
              } hover:bg-red-500`}
              onClick={() => handleItemClick("CATEGORIES")}
            >
              <AiFillMedicineBox className="mr-2 mt-[3rem]" size={26} />
              <span className="hidden nav-item-name mt-[3rem]">Categories</span>
            </Link>

            <Link
              to="/admin/orderlist"
              className={`flex items-center transition-transform transform ${
                selectedItem === "ORDERS" ? "bg-red-500" : ""
              } hover:bg-red-500`}
              onClick={() => handleItemClick("ORDERS")}
            >
              <AiFillCalendar className="mr-2 mt-[3rem]" size={26} />
              <span className="hidden nav-item-name mt-[3rem]">Orders</span>
            </Link>

            <Link
              to="/admin/userlist"
              className={`flex items-center transition-transform transform ${
                selectedItem === "USERS" ? "bg-red-500" : ""
              } hover:bg-red-500`}
              onClick={() => handleItemClick("USERS")}
            >
              <FaChalkboardUser  className="mr-2 mt-[3rem]" size={26} />
              <span className="hidden nav-item-name mt-[3rem]">Users</span>
            </Link>
          </>
        )}
      </div>
      <div className="relative">
  <button
    onClick={toggleDropdown}
    className="flex items-center text-gray-800 focus:outline-none"
  >
    {userInfo ? (
      <span className="text-white">{userInfo.username}</span>
    ) : (
      <></>
    )}
    {userInfo && (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`h-4 w-4 ml-1 ${
          dropdownOpen ? "transform rotate-180" : ""
        }`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="white"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d={dropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
        />
      </svg>
    )}
  </button>

{/* Dropdown menu */}
{dropdownOpen && userInfo && (
  <ul
    ref={dropdownRef}
    onMouseLeave={handleMouseLeave}
    className="dropdown-menu"
  >
    <li>
      <Link to="/profile" className="block hover:bg-gray-100">
        Profile
      </Link>
    </li>
    <li>
      <button
        onClick={logoutHandler}
        className="block w-full text-left hover:bg-gray-100"
      >
        Logout
      </button>
    </li>
  </ul>
)}
</div>
    </div>
  );
};

export default Navigation;



