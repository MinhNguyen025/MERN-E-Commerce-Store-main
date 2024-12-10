import { useState } from "react";
import { useRef } from "react";
import { FaSignInAlt, FaUserPlus } from "react-icons/fa";
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
      {!userInfo?.isAdmin && (
          <>
            {/* HOME */}
            <Link
              to="/"
              className={`nav-item hover:bg-red-500 ${
                selectedItem === "HOME" ? "bg-red-500" : ""
              }`}
              onClick={() => handleItemClick("HOME")}
            >
              <AiOutlineHome className="nav-icon" size={26} />
              <span className="nav-text">Home</span>
            </Link>

            {/* SHOP */}
            <Link
              to="/shop"
              className={`nav-item hover:bg-red-500 ${
                selectedItem === "SHOP" ? "bg-red-500" : ""
              }`}
              onClick={() => handleItemClick("SHOP")}
            >
              <AiOutlineShopping className="nav-icon" size={26} />
              <span className="nav-text">Shop</span>
            </Link>
          </>
        )}
         {/* Admin-specific navigation links */}
         {userInfo?.isAdmin && (
          <>
            {/* Dashboard */}
            <Link
              to="/admin/dashboard"
              className={`nav-item hover:bg-red-500 ${
                selectedItem === "DASHBOARD" ? "bg-red-500" : ""
              }`}
              onClick={() => handleItemClick("DASHBOARD")}
            >
              <AiOutlineHome className="nav-icon" size={26} />
              <span className="nav-text">Dashboard</span>
            </Link>

            {/* Products */}
            <Link
              to="/admin/AddProduct"
              className={`nav-item hover:bg-red-500 ${
                selectedItem === "PRODUCTS" ? "bg-red-500" : ""
              }`}
              onClick={() => handleItemClick("PRODUCTS")}
            >
              <AiFillFileAdd className="nav-icon" size={26} />
              <span className="nav-text">Products</span>
            </Link>

            {/* Categories */}
            <Link
              to="/admin/categorylist"
              className={`nav-item hover:bg-red-500 ${
                selectedItem === "CATEGORIES" ? "bg-red-500" : ""
              }`}
              onClick={() => handleItemClick("CATEGORIES")}
            >
              <AiFillMedicineBox className="nav-icon" size={26} />
              <span className="nav-text">Categories</span>
            </Link>

            {/* Orders */}
            <Link
              to="/admin/orderlist"
              className={`nav-item hover:bg-red-500 ${
                selectedItem === "ORDERS" ? "bg-red-500" : ""
              }`}
              onClick={() => handleItemClick("ORDERS")}
            >
              <AiFillCalendar className="nav-icon" size={26} />
              <span className="nav-text">Orders</span>
            </Link>

            {/* Users */}
            <Link
              to="/admin/userlist"
              className={`nav-item hover:bg-red-500 ${
                selectedItem === "USERS" ? "bg-red-500" : ""
              }`}
              onClick={() => handleItemClick("USERS")}
            >
              <FaChalkboardUser className="nav-icon" size={26} />
              <span className="nav-text">Users</span>
            </Link>
          </>
        )}
      </div>
      <div className="relative">
        {userInfo ? (
          <>
            {/* Hiển thị Dropdown khi đã đăng nhập */}
            <button
              onClick={toggleDropdown}
              className="flex items-center text-gray-800 focus:outline-none"
            >
              <span className="text-white">{userInfo.username}</span>
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
                  d={dropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7-7-7 7"}
                />
              </svg>
            </button>

            {/* Dropdown menu */}
            {dropdownOpen && (
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
          </>
        ) : (
          <>
            {/* Hiển thị nút Login và Register khi chưa đăng nhập */}
            <div className="flex flex-col space-y-2">
            <Link
              to="/login"
              className="flex items-center text-white hover:text-red-500 text-sm font-medium"
            >
              <FaSignInAlt className="mr-2" /> {/* Icon Login */}
              Login
            </Link>
            <Link
              to="/register"
              className="flex items-center text-white hover:text-red-500 text-sm font-medium"
            >
              <FaUserPlus className="mr-2" /> {/* Icon Register */}
              Register
            </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Navigation;



