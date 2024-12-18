import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { useAllProductsQuery } from "../../redux/api/productApiSlice";
import AdminMenu from "./AdminMenu";

const AllProducts = () => {
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const itemsPerPage = 5; // Số sản phẩm mỗi trang

  const [searchTerm, setSearchTerm] = useState(''); // Từ khóa tìm kiếm
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms debounce

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const { data, isLoading, isError, refetch } = useAllProductsQuery({
    page: currentPage,
    limit: itemsPerPage,
    keyword: debouncedSearchTerm,
  });

  useEffect(() => {
    console.log("Current page:", currentPage); // Log khi trang thay đổi
  }, [currentPage]);

  useEffect(() => {
    refetch(); // Bắt buộc gọi lại API khi trang thay đổi
  }, [currentPage, debouncedSearchTerm, refetch]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading products</div>;
  }

  const { products, totalPages, totalProducts } = data;

  const handlePageChange = (page) => {
    console.log("Changing to page:", page); // Debug log
    setCurrentPage(page);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset về trang đầu khi tìm kiếm
  };

  return (
    <div className="container mx-auto px-4 ml-40">
      <div className="flex flex-col md:flex-row">
        <div className="p-3 w-full md:w-3/4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">
              All Products ({totalProducts})
            </h2>
            <input
              type="text"
              placeholder="Search by product name..."
              value={searchTerm}
              onChange={handleSearch}
              className="px-4 py-2 border rounded w-1/2 md:w-1/3"
            />
          </div>
          <div className="flex flex-col space-y-4">
            {products.length > 0 ? (
              products.map((product) => (
                <Link
                  key={product._id}
                  to={`/admin/product/update/${product._id}`}
                  style={{ background: "#1A1A1A" }}
                  className="block overflow-hidden w-full rounded-lg shadow hover:shadow-lg transition duration-300"
                >
                  <div className="flex">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-40 h-40 object-cover"
                    />
                    <div className="p-4 flex flex-col justify-between w-full">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <h5 className="text-xl font-semibold">
                            {product.name}
                          </h5>
                          <p className="text-gray-400 text-xs">
                            {moment(product.createdAt).format("MMMM Do YYYY")}
                          </p>
                        </div>
                        <p className="text-gray-500 text-sm mb-4">
                          {product.description.substring(0, 160)}...
                        </p>
                      </div>
                      <div className="flex justify-between items-center">
                        <Link
                          to={`/admin/product/update/${product._id}`}
                          className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-red-700 rounded-lg hover:bg-red-800"
                        >
                          Update Product
                        </Link>
                        <p className="text-lg font-semibold">$ {product.price}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="w-full text-center text-gray-500">No products found.</div>
            )}
          </div>

          {/* Phân trang */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              {/* Nút << (First Page) */}
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

              {/* Nút < (Previous Page) */}
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

              {/* Nút trang */}
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

              {/* Nút > (Next Page) */}
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

              {/* Nút >> (Last Page) */}
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
          )}
        </div>
        <div className="md:w-1/4 p-3 mt-6 md:mt-0">
          <AdminMenu />
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
