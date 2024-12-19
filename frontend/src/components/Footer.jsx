// src/components/Footer.jsx
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';
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
    <footer className="bg-black text-white py-10 mt-16 ml-16">
      <div className="container mx-auto px-6">
        {/* Grid layout chia đều các phần */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-24">
          {/* About Us */}
          <div>
            <h4 className="text-lg font-semibold mb-4">About Us</h4>
            <p className="text-sm">
              We provide the best tech products with excellent service and support
              for all customers worldwide.
            </p>
            <p className="text-sm mt-4">123 Tech Street, Hanoi, Vietnam</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="text-sm space-y-2">
              <li>
                <a href="/" className="hover:underline hover:text-gray-300">
                  Home
                </a>
              </li>
              <li>
                <a href="/shop" className="hover:underline hover:text-gray-300">
                  Shop
                </a>
              </li>
              <li>
                <a href="/" className="hover:underline hover:text-gray-300">
                  About Us
                </a>
              </li>
              <li>
                <a href="/" className="hover:underline hover:text-gray-300">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="text-sm space-y-2">
              <li>Email: <a href="mailto:support@example.com" className="hover:underline">support@example.com</a></li>
              <li>Phone: +123 456 7890</li>
              <li>Address: 123 Tech Street, Hanoi, Vietnam</li>
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline hover:text-blue-500"
              >
                <FontAwesomeIcon icon={faFacebook} size="2x" />
              </a>
              {/* Twitter */}
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline hover:text-blue-400"
              >
                <FontAwesomeIcon icon={faTwitter} size="2x" />
              </a>
              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline hover:text-pink-500"
              >
                <FontAwesomeIcon icon={faInstagram} size="2x" />
              </a>
              {/* LinkedIn */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline hover:text-blue-700"
              >
                <FontAwesomeIcon icon={faLinkedin} size="2x" />
              </a>
            </div>
          </div>
        </div>

        {/* Đường phân cách */}
        <hr className="border-gray-700 my-8" />

        {/* Phần bản quyền */}
        <div className="text-center text-sm">
          <p>© 2024 Your Company. All rights reserved.</p>
          <p>
            <a href="/terms" className="hover:underline hover:text-gray-300">
              Terms & Conditions
            </a>{" "}
            |{" "}
            <a href="/privacy" className="hover:underline hover:text-gray-300">
              Privacy Policy
            </a>
          </p>
        </div>
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
