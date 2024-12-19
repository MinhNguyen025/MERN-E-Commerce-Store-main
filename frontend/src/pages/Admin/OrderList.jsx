// src/pages/admin/OrderList.js
import React, { useState } from "react";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useGetOrdersQuery } from "../../redux/api/orderApiSlice";
import AdminMenu from "./AdminMenu";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";

const OrderList = () => {
  const [page, setPage] = useState(1); // Trạng thái trang hiện tại
  const [search, setSearch] = useState(""); // Trạng thái input tìm kiếm
  const [startDate, setStartDate] = useState(null); // Trạng thái ngày bắt đầu
  const [endDate, setEndDate] = useState(null); // Trạng thái ngày kết thúc
  const limit = 5; // Số bản ghi mỗi trang

  // Lấy dữ liệu đơn hàng từ API với tìm kiếm và phân trang
  const { data, isLoading, error } = useGetOrdersQuery({ page, limit, search, startDate, endDate });

  // Hàm xử lý tìm kiếm
  const handleSearch = (e) => {
    e.preventDefault();

    // Kiểm tra nếu không có từ khóa tìm kiếm và không có ngày
    if (!search.trim() && !startDate && !endDate) {
      toast.error("Please enter a search term or select a date.");
      return;
    }

    // Nếu có cả hai ngày, kiểm tra thứ tự ngày
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      toast.error("Start date cannot be after end date.");
      return;
    }

    setPage(1); // Reset về trang đầu khi tìm kiếm
  };

  // Hàm xử lý reset tìm kiếm
  const handleReset = () => {
    setSearch("");
    setStartDate(null);
    setEndDate(null);
    setPage(1);
    toast.info("Search criteria reset.");
  };

  // Hàm xử lý chuyển trang
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= (data?.pages || 1)) {
      setPage(newPage);
    }
  };

  const totalPages = data?.pages || 1; // Sử dụng giá trị pages từ backend

  // Hàm hỗ trợ tạo dãy số trang với dấu "..."
  const getPageNumbers = () => {
    const pages = [];
    const maxPageButtons = 5; // Số nút trang tối đa hiển thị (bao gồm dấu "...")
    const lastPage = totalPages;

    if (lastPage <= 4) { // Thay đổi điều kiện từ <=5 thành <=4
      // Nếu tổng số trang nhỏ hơn hoặc bằng 4, hiển thị tất cả
      for (let i = 1; i <= lastPage; i++) {
        pages.push(i);
      }
    } else {
      // Nếu tổng số trang lớn hơn 4
      if (page <= 3) {
        // Khi ở trang 1, 2, 3
        pages.push(1, 2, 3, "...", lastPage);
      } else if (page >= lastPage - 2) {
        // Khi ở các trang cuối
        pages.push(1, "...", lastPage - 2, lastPage - 1, lastPage);
      } else {
        // Khi ở giữa
        pages.push(1, "...", page - 1, page, page + 1, "...", lastPage);
      }
    }

    return pages;
  };

  // Hàm xử lý thông báo lỗi cụ thể
  const renderError = () => {
    // Kiểm tra lỗi cụ thể nếu cần
    return <Message variant="danger">{error?.data?.error || "An unexpected error occurred."}</Message>;
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <>
          {renderError()}
        </>
      ) : (
        <div className="container mx-auto ml-30 max-w-[80%]">
          <AdminMenu />

          {/* Form Tìm Kiếm */}
          <form onSubmit={handleSearch} className="mb-4 flex flex-wrap items-center gap-4">
            <div className="flex flex-col">
              <label htmlFor="orderId" className="mb-1">Order ID</label>
              <input
                id="orderId"
                type="text"
                placeholder="Search by Order ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-gray-300 p-2 w-80 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="startDate" className="mb-1">Start Date</label>
              <DatePicker
                id="startDate"
                selected={startDate ? new Date(startDate) : null}
                onChange={(date) => setStartDate(date ? date.toISOString().split('T')[0] : null)}
                dateFormat="yyyy-MM-dd"
                isClearable
                placeholderText="Select start date"
                className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="endDate" className="mb-1">End Date</label>
              <DatePicker
                id="endDate"
                selected={endDate ? new Date(endDate) : null}
                onChange={(date) => setEndDate(date ? date.toISOString().split('T')[0] : null)}
                dateFormat="yyyy-MM-dd"
                isClearable
                placeholderText="Select end date"
                className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition mt-7"
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
            </div>
          </form>

          {/* Bảng Danh Sách Đơn Hàng */}
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
                data.orders.map((order) => (
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

          {/* Thanh Phân Trang */}
          <div className="flex justify-center mt-4 items-center">
            {/* Nút Trang Đầu */}
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

            {/* Nút Trang Trước */}
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

            {/* Các Nút Trang */}
            {getPageNumbers().map((pageNumber, index) => (
              <button
                key={index}
                onClick={() => typeof pageNumber === 'number' && handlePageChange(pageNumber)}
                disabled={pageNumber === '...'}
                className={`px-4 py-2 mx-1 border rounded ${
                  pageNumber === page
                    ? "bg-red-600 text-white border-red-600 cursor-default"
                    : typeof pageNumber === 'number'
                      ? "bg-gray-200 text-gray-700 border-gray-300 hover:bg-red-100 hover:border-red-400"
                      : "bg-transparent text-gray-500 cursor-default"
                }`}
              >
                {pageNumber}
              </button>
            ))}

            {/* Nút Trang Tiếp Theo */}
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

            {/* Nút Trang Cuối */}
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
