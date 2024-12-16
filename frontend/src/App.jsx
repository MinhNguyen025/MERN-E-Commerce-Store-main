import React from "react";
import Navigation from "./pages/Auth/Navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { Outlet } from "react-router-dom";
import Breadcrumb from "./components/Breadcrumb"; 

const App = () => {
  return (
    <div className="flex flex-col min-h-screen bg-black-900 text-white">
      <Header />
      <ToastContainer />
      <Navigation />
      <main className="flex-grow px-6">
        <Breadcrumb />
        <Outlet />
      </main>
      <Footer /> 
    </div>
  );
};

export default App;
