import React, { useState } from "react";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useGetOrdersQuery } from "../../redux/api/orderApiSlice";
import AdminMenu from "./AdminMenu";

const OrderList = () => {
  const [page, setPage] = useState(1); // Lưu trạng thái trang hiện tại
  const limit = 5; // Số bản ghi trên mỗi trang

  // Gọi API với tham số page và limit
  const { data, isLoading, error } = useGetOrdersQuery({ page, limit });

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= (data?.pages || 1)) {
      console.log(`Switching to page: ${newPage}`); // Log kiểm tra
      setPage(newPage); // Cập nhật trạng thái trang
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data?.message || error.error}</Message>
      ) : (
        <div className="container mx-auto ml-30 max-w-[80%]">
          <AdminMenu />
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
              {data.orders.map((order) => (
                <tr
                  key={order._id}
                  className="group hover:bg-gray-100 transition duration-200"
                >
                  <td className="border border-gray-300 text-center text-white group-hover:text-black">
                    <img
                      src={order.orderItems[0].image}
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
              ))}
            </tbody>
          </table>
          {/* Thanh phân trang */}
          <div className="flex justify-center items-center mt-4 gap-2">
            <button
              onClick={() => handlePageChange(1)}
              disabled={page === 1}
              className={`p-2 px-4 rounded border border-gray-300 ${
                page === 1 ? "bg-gray-300 cursor-not-allowed" : "hover:bg-gray-200"
              }`}
            >
              «
            </button>
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className={`p-2 px-4 rounded border border-gray-300 ${
                page === 1 ? "bg-gray-300 cursor-not-allowed" : "hover:bg-gray-200"
              }`}
            >
              ‹
            </button>
            {[...Array(data.pages).keys()].map((index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`p-2 px-4 rounded border border-gray-300 ${
                  page === index + 1 ? "bg-red-500 text-white" : "hover:bg-gray-200"
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === data.pages}
              className={`p-2 px-4 rounded border border-gray-300 ${
                page === data.pages ? "bg-gray-300 cursor-not-allowed" : "hover:bg-gray-200"
              }`}
            >
              ›
            </button>
            <button
              onClick={() => handlePageChange(data.pages)}
              disabled={page === data.pages}
              className={`p-2 px-4 rounded border border-gray-300 ${
                page === data.pages ? "bg-gray-300 cursor-not-allowed" : "hover:bg-gray-200"
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
