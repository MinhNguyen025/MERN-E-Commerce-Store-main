import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { useAllProductsQuery } from "../../redux/api/productApiSlice";
import AdminMenu from "./AdminMenu";

const AllProducts = () => {
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const itemsPerPage = 5; // Số sản phẩm mỗi trang

  const { data, isLoading, isError, refetch } = useAllProductsQuery({
    page: currentPage,
    limit: itemsPerPage,
  });

  useEffect(() => {
    console.log("Current page:", currentPage); // Log khi trang thay đổi
  }, [currentPage]);

  useEffect(() => {
    refetch(); // Bắt buộc gọi lại API khi trang thay đổi
  }, [currentPage, refetch]);

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

  return (
    <div className="container mx-[9rem]">
      <div className="flex flex-col md:flex-row">
        <div className="p-3">
          <div className="ml-[2rem] text-xl font-bold h-12">
            All Products ({totalProducts})
          </div>
          <div className="flex flex-wrap justify-around items-center">
            {products.map((product) => (
              <Link
                key={product._id}
                to={`/admin/product/update/${product._id}`}
                className="block mb-4 overflow-hidden"
              >
                <div className="flex">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-[10rem] object-cover"
                  />
                  <div className="p-4 flex flex-col justify-around">
                    <div className="flex justify-between">
                      <h5 className="text-xl font-semibold mb-2">
                        {product?.name}
                      </h5>
                      <p className="text-gray-400 text-xs">
                        {moment(product.createdAt).format("MMMM Do YYYY")}
                      </p>
                    </div>
                    <p className="text-gray-400 xl:w-[30rem] lg:w-[30rem] md:w-[20rem] sm:w-[10rem] text-sm mb-4">
                      {product?.description?.substring(0, 160)}...
                    </p>
                    <div className="flex justify-between">
                      <Link
                        to={`/admin/product/update/${product._id}`}
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-red-700 rounded-lg hover:bg-red-800"
                      >
                        Update Product
                      </Link>
                      <p>$ {product?.price}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-4 items-center">
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

  {/* Hiển thị các nút trang */}
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

        </div>
        <div className="md:w-1/4 p-3 mt-2">
          <AdminMenu />
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
