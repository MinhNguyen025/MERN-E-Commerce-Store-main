import React from "react";
import Navigation from "./pages/Auth/Navigation";
import Footer from "./components/Footer";
import Header from "./components/Header"; // Import Header
import { Outlet } from "react-router-dom";

const App = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <Header /> {/* Thêm Header */}
      <div className="flex">
        <Navigation />
        <main className="flex-grow px-6">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default App;
