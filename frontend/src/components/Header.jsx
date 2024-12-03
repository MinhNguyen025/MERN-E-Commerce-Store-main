import React from "react";
import { Link } from "react-router-dom";
import logo from "../images/logo.jpg";

const Header = () => {
    return (
      <header className="bg-black text-white py-4 px-6 shadow-md sticky top-0 z-50">
        <div className="container mx-auto flex items-center">
            <Link to="/" className="flex items-center space-x-4">
            {/* Logo */}
            <img
                src={logo}
                alt="Logo"
                className="h-16 w-auto"  // Thay đổi kích thước ảnh logo lớn hơn
            />
            {/* Tên website */}
            <span className="text-xl font-bold">Innovate Your Life!</span>
            </Link>
        </div>
      </header>
    );
  };
  
  export default Header;
