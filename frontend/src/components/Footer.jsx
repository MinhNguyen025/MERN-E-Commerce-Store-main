// src/components/Footer.jsx

import React from "react";
import { useLocation } from "react-router-dom";

const Footer = () => {
  const location = useLocation();
  const { pathname } = location;

  // Kiểm tra các trang đặc biệt
  const isHomePage = pathname === "/";
  const isLoginPage = pathname === "/login";
  const isRegisterPage = pathname === "/register";
  const isAuthPage = isLoginPage || isRegisterPage;

  if (isHomePage) {
    return (
      <footer className="bg-black text-white py-8 mt-16">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0 ml-20">
            <h4 className="text-lg font-semibold">About Us</h4>
            <p className="text-sm">
              We provide the best tech products at the best prices.
            </p>
          </div>
          <div className="mb-4 md:mb-0">
            <h4 className="text-lg font-semibold">Contact</h4>
            <p className="text-sm">Email: support@example.com</p>
            <p className="text-sm">Phone: +123 456 7890</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold">Follow Us</h4>
            <a
              href="https://facebook.com"
              className="text-blue-400 hover:underline"
            >
              Facebook
            </a>{" "}
            |{" "}
            <a
              href="https://twitter.com"
              className="text-blue-400 hover:underline"
            >
              Twitter
            </a>
          </div>
        </div>
        <div className="text-center mt-4 text-sm">
          © 2024 Your Company. All rights reserved.
        </div>
      </footer>
    );
  }

  if (isAuthPage) {
    return (
      <footer className="bg-black text-white py-2 text-center">
        © 2024 Your Company. All rights reserved.
      </footer>
    );
  }

  return (
    <footer className="bg-black text-white py-2 text-center mt-16">
      © 2024 Your Company. All rights reserved.
    </footer>
  );
};

export default Footer;
