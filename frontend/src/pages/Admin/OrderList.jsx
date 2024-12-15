import React, { useState } from "react";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useGetOrdersQuery } from "../../redux/api/orderApiSlice";
import AdminMenu from "./AdminMenu";

const OrderList = () => {
  const [page, setPage] = useState(1); // Current page state
  const [search, setSearch] = useState(""); // Search input state
  const limit = 5; // Number of records per page

  // Fetch orders data from API with search and pagination
  const { data, isLoading, error } = useGetOrdersQuery({ page, limit, search });

  const handleSearch = (e) => {
    e.preventDefault();

    if (!search.trim()) {
      alert("Search field cannot be empty.");
      return;
    }

    if (!/^[a-f\d]{24}$/i.test(search.trim())) {
      alert("Invalid Order ID format!");
      return;
    }

    setSearch(search.trim()); // Set search term
    setPage(1); // Reset to first page on search
  };

  const handleReset = () => {
    setSearch(""); // Clear search field
    setPage(1); // Reset pagination to the first page
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= (data?.pages || 1)) {
      setPage(newPage);
    }
  };

  const totalPages = search ? 1 : data?.pages || 1; // Adjust total pages when searching

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <>
          <Message variant="danger">{error?.data?.message || error.error}</Message>
          <pre className="text-red-500">{JSON.stringify(error, null, 2)}</pre>
        </>
      ) : (
        <div className="container mx-auto ml-30 max-w-[80%]">
          <AdminMenu />

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-4 flex items-center gap-2">
            <input
              type="text"
              placeholder="Search by Order ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 p-2 w-80 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              Search
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
            >
              Reset
            </button>
          </form>

          <table className="table-auto border-collapse border border-gray-300 w-full text-sm">
            <thead className="bg-red-600 text-white">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-center">IMAGE</th>
                <th className="border border-gray-300 px-4 py-2 text-center">ID</th>
                <th className="border border-gray-300 px-4 py-2 text-center">DATE</th>
                <th className="border border-gray-300 px-4 py-2 text-center">TOTAL</th>
                <th className="border border-gray-300 px-4 py-2 text-center">PAID</th>
                <th className="border border-gray-300 px-4 py-2 text-center">DELIVERED</th>
                <th className="border border-gray-300 px-4 py-2 text-center">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {!data || !data.orders || data.orders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center text-red-500 py-4">
                    No orders found matching the search criteria.
                  </td>
                </tr>
              ) : (
                data.orders
                  .filter((order) => !search || order._id === search)
                  .map((order) => (
                    <tr
                      key={order._id}
                      className="group hover:bg-gray-100 transition duration-200"
                    >
                      <td className="border border-gray-300 text-center">
                        <img
                          src={order.orderItems[0]?.image}
                          alt={order._id}
                          className="w-12 h-12 object-cover mx-auto"
                        />
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-center text-white group-hover:text-black">
                        {order._id}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-center text-white group-hover:text-black">
                        {order.createdAt ? order.createdAt.substring(0, 10) : "N/A"}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-center text-white group-hover:text-black">
                        $ {order.totalPrice}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-center text-white">
                        {order.isPaid ? (
                          <span className="text-green-500 font-semibold">Completed</span>
                        ) : (
                          <span className="text-red-500 font-semibold">Pending</span>
                        )}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-center text-white">
                        {order.isDelivered ? (
                          <span className="text-green-500 font-semibold">Completed</span>
                        ) : (
                          <span className="text-red-500 font-semibold">Pending</span>
                        )}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        <Link
                          to={`/order/${order._id}`}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition duration-200"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-center mt-4 items-center pt-40">
            {/* First Page */}
            <button
              onClick={() => handlePageChange(1)}
              disabled={page === 1}
              className={`px-4 py-2 mx-1 border rounded ${
                page === 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gray-200 text-gray-700 border-gray-300 hover:bg-red-100 hover:border-red-400"
              }`}
            >
              «
            </button>

            {/* Previous Page */}
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className={`px-4 py-2 mx-1 border rounded ${
                page === 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gray-200 text-gray-700 border-gray-300 hover:bg-red-100 hover:border-red-400"
              }`}
            >
              ‹
            </button>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                className={`px-4 py-2 mx-1 border rounded ${
                  pageNumber === page
                    ? "bg-red-600 text-white border-red-600"
                    : "bg-gray-200 text-gray-700 border-gray-300 hover:bg-red-100 hover:border-red-400"
                }`}
              >
                {pageNumber}
              </button>
            ))}

            {/* Next Page */}
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className={`px-4 py-2 mx-1 border rounded ${
                page === totalPages
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gray-200 text-gray-700 border-gray-300 hover:bg-red-100 hover:border-red-400"
              }`}
            >
              ›
            </button>

            {/* Last Page */}
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={page === totalPages}
              className={`px-4 py-2 mx-1 border rounded ${
                page === totalPages
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gray-200 text-gray-700 border-gray-300 hover:bg-red-100 hover:border-red-400"
              }`}
            >
              »
            </button>
          </div>

        </div>
      )}
    </>
  );
};

export default OrderList;