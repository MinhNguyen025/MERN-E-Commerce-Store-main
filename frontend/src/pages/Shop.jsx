// src/pages/Shop.js

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredProductsQuery, useGetBrandsQuery } from "../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";
import {
  setCategories,
  setProducts,
  setChecked,
  setCheckedBrands,
} from "../redux/features/shop/shopSlice";
import Loader from "../components/Loader";
import ProductCard from "./Products/ProductCard";
import { useUpdateUserCartMutation } from "../redux/api/usersApiSlice";
import { addToCart } from "../redux/features/cart/cartSlice";
import { toast } from "react-toastify";

const Shop = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categories, products, checked, radio, checkedBrands } = useSelector((state) => state.shop);
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  // Fetch categories
  const categoriesQuery = useFetchCategoriesQuery();

  // Fetch brands
  const { data: brandsData, isLoading: brandsLoading, isError: brandsError } = useGetBrandsQuery();

  const [priceFilter, setPriceFilter] = useState(""); 
  const [searchTerm, setSearchTerm] = useState(""); 
  const [showAllCategories, setShowAllCategories] = useState(false); 

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filtered products query
  const filteredProductsQuery = useGetFilteredProductsQuery({
    checked,
    radio,
    brands: checkedBrands,
  });

  useEffect(() => {
    if (!categoriesQuery.isLoading && categoriesQuery.data) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery.data, categoriesQuery.isLoading, dispatch]);

  const displayedCategories = showAllCategories ? categories : categories.slice(0, 9);

  useEffect(() => {
    if (filteredProductsQuery.data) {
      let filteredProducts = filteredProductsQuery.data;

      if (searchTerm) {
        filteredProducts = filteredProducts.filter((product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (priceFilter) {
        filteredProducts = filteredProducts.filter((product) =>
          product.price.toString().includes(priceFilter)
        );
      }

      dispatch(setProducts(filteredProducts));
    }
  }, [filteredProductsQuery.data, searchTerm, priceFilter, dispatch]);

  const handleCheck = (value, id) => {
    const updatedChecked = value ? [...checked, id] : checked.filter((c) => c !== id);
    dispatch(setChecked(updatedChecked));
    setCurrentPage(1);
  };

  const handleBrandCheck = (value, brand) => {
    let updatedBrands;
    if (value) {
      updatedBrands = [...checkedBrands, brand];
    } else {
      updatedBrands = checkedBrands.filter((b) => b !== brand);
    }
    dispatch(setCheckedBrands(updatedBrands));
    setCurrentPage(1);
  };

  const handlePriceChange = (e) => {
    setPriceFilter(e.target.value);
  };

  const handleReset = () => {
    setSearchTerm("");
    setPriceFilter("");
    dispatch(setChecked([]));
    dispatch(setCheckedBrands([]));
    setCurrentPage(1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const [updateUserCart] = useUpdateUserCartMutation();

  const handleAddToCart = async (product, qty) => {
    if (!userInfo) {
      toast.warn("Please login to add a product to cart.");
      navigate("/login");
      return;
    }
  
    // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
    const existingCartItem = cartItems.find(item => item.product === product._id);
  
    let updatedCartItems;
    if (existingCartItem) {
      // Nếu đã có, tăng số lượng
      updatedCartItems = cartItems.map(item =>
        item.product === product._id ? { ...item, qty: item.qty + qty } : item
      );
      // Chỉ dispatch qty mới để reducer tự tăng
      dispatch(addToCart({ product: product._id, qty }));
    } else {
      // Nếu chưa có, thêm sản phẩm mới vào giỏ hàng
      updatedCartItems = [...cartItems, { product: product._id, qty: Number(qty) }];
      dispatch(addToCart({ product: product._id, qty, name: product.name, price: product.price, image: product.image, countInStock: product.countInStock }));
    }
  
    toast.success("Added to cart!");
  
    try {
      await updateUserCart({ userId: userInfo._id, cartItems: updatedCartItems }).unwrap();
      // toast.success("Cart updated on server!");
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  };  

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <div className="container mx-auto">
        {/* Search Bar */}
        <div className="flex justify-between items-center mb-6 mr-40">
          <h1 className="text-3xl font-bold ml-20">Shop</h1>
          <form
            onSubmit={(e) => { e.preventDefault(); }}
            className="flex items-center bg-gray-800 p-2 rounded-lg"
          >
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none text-white px-4 py-2"
            />
            <button
              type="submit"
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Search
            </button>
          </form>
        </div>

        <div className="flex md:flex-row ml-12">
          {/* Filters */}
          <div className="bg-[#151515] p-3 mt-2 mb-2">
            <h2 className="h4 text-center py-2 bg-black rounded-full mb-2">
              Filter by Categories
            </h2>
            <div className="p-5 w-[15rem]">
              {displayedCategories?.map((c) => (
                <div key={c._id} className="mb-2">
                  <div className="flex items-center mr-4">
                    <input
                      type="checkbox"
                      id={`category-${c._id}`}
                      onChange={(e) => handleCheck(e.target.checked, c._id)}
                      checked={checked.includes(c._id)}
                      className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500"
                    />
                    <label
                      htmlFor={`category-${c._id}`}
                      className="ml-2 text-sm font-medium text-white"
                    >
                      {c.name}
                    </label>
                  </div>
                </div>
              ))}
              {categories.length > 9 && (
                <button
                  onClick={() => setShowAllCategories(!showAllCategories)}
                  className="text-red-600 hover:underline mt-2"
                >
                  {showAllCategories ? "Show Less" : "Show More"}
                </button>
              )}
            </div>

            {/* Filter by Brand */}
            <h2 className="h4 text-center py-2 bg-black rounded-full mt-4 mb-2">
              Filter by Brand
            </h2>
            <div className="p-5 w-[15rem]">
              {brandsLoading ? (
                <p className="text-white">Loading brands...</p>
              ) : brandsError ? (
                <p className="text-red-500">Error loading brands</p>
              ) : (
                brandsData.map((brand) => (
                  <div key={brand} className="mb-2">
                    <div className="flex items-center mr-4">
                      <input
                        type="checkbox"
                        id={`brand-${brand}`}
                        onChange={(e) => handleBrandCheck(e.target.checked, brand)}
                        checked={checkedBrands.includes(brand)}
                        className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500"
                      />
                      <label
                        htmlFor={`brand-${brand}`}
                        className="ml-2 text-sm font-medium text-white"
                      >
                        {brand}
                      </label>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Filter by Price */}
            <div className="mt-4">
              <label
                htmlFor="price"
                className="block mb-2 text-sm font-medium text-white"
              >
                Filter by Price
              </label>
              <input
                type="number"
                id="price"
                value={priceFilter}
                onChange={handlePriceChange}
                className="w-full p-2 text-black rounded"
                placeholder="Enter price..."
              />
            </div>

            {/* Reset Filters */}
            <button
              onClick={handleReset}
              className="w-full mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Reset Filters
            </button>
          </div>

          {/* Products List */}
          <div className="p-3">
            <h2 className="h4 mb-2 ml-auto">{products?.length} Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {currentProducts.length === 0 ? (
                <Loader />
              ) : (
                currentProducts.map((p) => (
                  <ProductCard
                    key={p._id}
                    p={p}
                    addToCartHandler={() => handleAddToCart(p, 1)}
                  />
                ))
              )}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-4 items-center">
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 mx-1 border rounded ${
                  currentPage === 1
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gray-200 text-gray-700 border-gray-300 hover:bg-red-100 hover:border-red-400"
                }`}
              >
                «
              </button>

              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 mx-1 border rounded ${
                  currentPage === 1
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gray-200 text-gray-700 border-gray-300 hover:bg-red-100 hover:border-red-400"
                }`}
              >
                ‹
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 mx-1 border rounded ${
                    page === currentPage
                      ? "bg-red-600 text-white border-red-600"
                      : "bg-gray-200 text-gray-700 border-gray-300 hover:bg-red-100 hover:border-red-400"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 mx-1 border rounded ${
                  currentPage === totalPages
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gray-200 text-gray-700 border-gray-300 hover:bg-red-100 hover:border-red-400"
                }`}
              >
                ›
              </button>

              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 mx-1 border rounded ${
                  currentPage === totalPages
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gray-200 text-gray-700 border-gray-300 hover:bg-red-100 hover:border-red-400"
                }`}
              >
                »
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Shop;
