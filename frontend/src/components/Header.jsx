import logo from "../images/logo.jpg";
import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-gray-900 text-white py-4 px-6 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex items-center">
        <Link to="/" className="flex items-center space-x-2">
          <img src={logo} alt="Logo" className="h-8 w-8" />
          <span className="text-2xl font-bold">Innovate your life!</span>
        </Link>
      </div>
    </header>
  );
};

export default Header;
