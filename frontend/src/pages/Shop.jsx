import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredProductsQuery } from "../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";

import {
  setCategories,
  setProducts,
  setChecked,
} from "../redux/features/shop/shopSlice";
import Loader from "../components/Loader";
import ProductCard from "./Products/ProductCard";

const Shop = () => {
  const dispatch = useDispatch();
  const { categories, products, checked, radio } = useSelector(
    (state) => state.shop
  );

  const categoriesQuery = useFetchCategoriesQuery();
  const [priceFilter, setPriceFilter] = useState(""); // Bộ lọc theo giá
  const [searchTerm, setSearchTerm] = useState(""); // Tìm kiếm theo từ khóa
  const [showAllCategories, setShowAllCategories] = useState(false); // Quản lý chế độ hiển thị categories

  // State phân trang
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const itemsPerPage = 6; // Số sản phẩm hiển thị mỗi trang

  const filteredProductsQuery = useGetFilteredProductsQuery({
    checked,
    radio,
  });

  // Fetch categories
  useEffect(() => {
    if (!categoriesQuery.isLoading) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery.data, dispatch]);

  // Hiển thị tối đa 9 categories nếu không chọn "Show More"
  const displayedCategories = showAllCategories
    ? categories
    : categories.slice(0, 9);

  // Áp dụng bộ lọc sản phẩm
  useEffect(() => {
    if (!checked.length || !radio.length) {
      if (!filteredProductsQuery.isLoading) {
        const filteredProducts = filteredProductsQuery.data.filter(
          (product) => {
            // Kiểm tra theo từ khóa tìm kiếm
            const matchesSearchTerm = product.name
              .toLowerCase()
              .includes(searchTerm.toLowerCase());
            // Kiểm tra theo giá
            const matchesPrice =
              product.price.toString().includes(priceFilter) ||
              product.price === parseInt(priceFilter, 10);

            return matchesSearchTerm && matchesPrice;
          }
        );

        dispatch(setProducts(filteredProducts));
      }
    }
  }, [checked, radio, filteredProductsQuery.data, dispatch, priceFilter, searchTerm]);

  // Bộ lọc categories
  const handleCheck = (value, id) => {
    const updatedChecked = value
      ? [...checked, id]
      : checked.filter((c) => c !== id);
    dispatch(setChecked(updatedChecked));
  };

  // Bộ lọc theo giá
  const handlePriceChange = (e) => {
    setPriceFilter(e.target.value);
  };

  // Xử lý nút Reset
  const handleReset = () => {
    setSearchTerm(""); // Reset tìm kiếm
    setPriceFilter(""); // Reset giá
    dispatch(setChecked([])); // Reset danh sách categories đã chọn
    setCurrentPage(1); // Reset về trang đầu tiên
  };

  // Phân trang: Lấy sản phẩm theo trang hiện tại
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);

  // Tổng số trang
  const totalPages = Math.ceil(products.length / itemsPerPage);

  // Xử lý chuyển trang
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>
      <div className="container mx-auto">
        {/* Thanh tìm kiếm */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Shop</h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
            className="flex items-center bg-gray-800 p-2 rounded-lg"
          >
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} // Cập nhật từ khóa tìm kiếm
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

        <div className="flex md:flex-row">
          {/* Bộ lọc */}
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
                      checked={checked.includes(c._id)} // Kiểm tra xem category có được chọn không
                      className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 dark:focus:ring-red-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      htmlFor={`category-${c._id}`}
                      className="ml-2 text-sm font-medium text-white dark:text-gray-300"
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

            {/* Bộ lọc theo giá */}
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

            {/* Nút Reset */}
            <button
              onClick={handleReset}
              className="w-full mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Reset Filters
            </button>
          </div>

          {/* Danh sách sản phẩm */}
          <div className="p-3">
            <h2 className="h4 text-center mb-2">{products?.length} Products</h2>
            <div className="flex flex-wrap justify-center gap-4">
  {currentProducts.length === 0 ? (
    <Loader />
  ) : (
    currentProducts.map((p) => (
      <div
        className={`min-w-[300px] max-w-[400px] w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1rem)]`}
        key={p._id}
      >
        <ProductCard p={p} />
      </div>
    ))
  )}
</div>


            {/* Pagination */}
            <div className="flex justify-center mt-4">
              {/* Nút về trang đầu */}
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className={`px-3 py-2 mx-1 border rounded ${
                  currentPage === 1
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gray-200 text-gray-700 border-gray-300 hover:bg-red-100 hover:border-red-400"
                }`}
              >
                {"<<"}
              </button>

              {/* Nút về trang trước */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-2 mx-1 border rounded ${
                  currentPage === 1
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gray-200 text-gray-700 border-gray-300 hover:bg-red-100 hover:border-red-400"
                }`}
              >
                {"<"}
              </button>

              {/* Các nút số trang */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-2 mx-1 border rounded ${
                    page === currentPage
                      ? "bg-red-600 text-white border-red-600"
                      : "bg-gray-200 text-gray-700 border-gray-300 hover:bg-red-100 hover:border-red-400"
                  }`}
                >
                  {page}
                </button>
              ))}

              {/* Nút đến trang sau */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-2 mx-1 border rounded ${
                  currentPage === totalPages
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gray-200 text-gray-700 border-gray-300 hover:bg-red-100 hover:border-red-400"
                }`}
              >
                {">"}
              </button>

              {/* Nút đến trang cuối */}
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className={`px-3 py-2 mx-1 border rounded ${
                  currentPage === totalPages
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gray-200 text-gray-700 border-gray-300 hover:bg-red-100 hover:border-red-400"
                }`}
              >
                {">>"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Shop;
