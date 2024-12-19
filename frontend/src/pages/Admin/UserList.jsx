// src/components/UserList.jsx
import React, { useState, useMemo } from "react";
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from "../../redux/api/usersApiSlice";
import { toast } from "react-toastify";

const UserList = () => {
  const [page, setPage] = useState(1); // Trạng thái trang hiện tại
  const [searchTerm, setSearchTerm] = useState(""); // Trạng thái input tìm kiếm
  const limit = 5; // Số bản ghi mỗi trang

  // Lấy dữ liệu người dùng từ API với tìm kiếm và phân trang
  const { data, isLoading, error } = useGetUsersQuery({ page, limit, search: searchTerm });

  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();

  const [editableUserId, setEditableUserId] = useState(null);
  const [editableUserName, setEditableUserName] = useState("");
  const [editableUserEmail, setEditableUserEmail] = useState("");

  // Lọc người dùng dựa trên searchTerm
  const filteredUsers = useMemo(() => {
    if (!searchTerm) return data?.users || [];
    return (data?.users || []).filter(
      (user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, data]);

  // Hàm xử lý xóa người dùng
  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id).unwrap();
        toast.success("User deleted successfully");
        // Không cần refetch vì dữ liệu đã được cập nhật thông qua RTK Query
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  // Hàm bật chế độ chỉnh sửa
  const toggleEdit = (id, username, email) => {
    setEditableUserId(id);
    setEditableUserName(username);
    setEditableUserEmail(email);
  };

  // Hàm xử lý cập nhật người dùng
  const updateHandler = async (id) => {
    try {
      await updateUser({
        userId: id,
        username: editableUserName,
        email: editableUserEmail,
      }).unwrap();
      toast.success("User updated successfully");
      setEditableUserId(null);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  // Hàm hỗ trợ tạo dãy số trang với dấu "..."
  const getPageNumbers = () => {
    const pages = [];
    const maxPageButtons = 5; // Số nút trang tối đa hiển thị (bao gồm dấu "...")
    const lastPage = data?.pages || 1;

    if (lastPage <= maxPageButtons) {
      // Nếu tổng số trang nhỏ hơn hoặc bằng số nút tối đa, hiển thị tất cả
      for (let i = 1; i <= lastPage; i++) {
        pages.push(i);
      }
    } else {
      // Nếu tổng số trang lớn hơn số nút tối đa
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

  // Hàm xử lý tìm kiếm
  const handleSearch = (e) => {
    e.preventDefault();

    // Kiểm tra nếu không có từ khóa tìm kiếm
    if (!searchTerm.trim()) {
      toast.error("Please enter a search term.");
      return;
    }

    setPage(1); // Reset về trang đầu khi tìm kiếm
  };

  // Hàm xử lý reset tìm kiếm
  const handleReset = () => {
    setSearchTerm("");
    setPage(1);
    toast.info("Search criteria reset.");
  };

  // Hàm xử lý chuyển trang
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= (data?.pages || 1)) {
      setPage(newPage);
    }
  };

  const totalPages = searchTerm ? 1 : data?.pages || 1; // Điều chỉnh tổng số trang khi tìm kiếm

  return (
    <div className="p-4 ml-32">
      <h1 className="text-2xl font-semibold mb-4">Users</h1>
      {/* Thanh Tìm Kiếm */}
      <form onSubmit={handleSearch} className="mb-4 flex flex-wrap items-center gap-4 ml-20">
        <div className="flex flex-col">
          <label htmlFor="searchTerm" className="mb-1">Search</label>
          <input
            id="searchTerm"
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-80 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-end gap-2 mt-7">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Search
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
          >
            Reset
          </button>
        </div>
      </form>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <div className="flex flex-col md:flex-row">
            {/* Bảng Danh Sách Người Dùng */}
            <table className="w-full md:w-4/5 mx-auto">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">NAME</th>
                  <th className="px-4 py-2 text-left">EMAIL</th>
                  <th className="px-4 py-2 text-left">ADMIN</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center text-red-500 py-4">
                      No users found matching the search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user._id} className="border-t">
                      <td className="px-4 py-2">{user._id}</td>
                      <td className="px-4 py-2">
                        {editableUserId === user._id ? (
                          <div className="flex items-center">
                            <input
                              type="text"
                              value={editableUserName}
                              onChange={(e) => setEditableUserName(e.target.value)}
                              className="w-full p-2 border rounded-lg"
                            />
                            <button
                              onClick={() => updateHandler(user._id)}
                              className="ml-2 bg-blue-500 text-white py-2 px-4 rounded-lg"
                            >
                              <FaCheck />
                            </button>
                            <button
                              onClick={() => setEditableUserId(null)}
                              className="ml-2 bg-gray-500 text-white py-2 px-4 rounded-lg"
                            >
                              <FaTimes />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            {user.username}
                            <button
                              onClick={() =>
                                toggleEdit(user._id, user.username, user.email)
                              }
                              className="ml-2 text-blue-500 hover:text-blue-700"
                            >
                              <FaEdit />
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-2">
                        {editableUserId === user._id ? (
                          <div className="flex items-center">
                            <input
                              type="email"
                              value={editableUserEmail}
                              onChange={(e) => setEditableUserEmail(e.target.value)}
                              className="w-full p-2 border rounded-lg"
                            />
                            <button
                              onClick={() => updateHandler(user._id)}
                              className="ml-2 bg-blue-500 text-white py-2 px-4 rounded-lg"
                            >
                              <FaCheck />
                            </button>
                            <button
                              onClick={() => setEditableUserId(null)}
                              className="ml-2 bg-gray-500 text-white py-2 px-4 rounded-lg"
                            >
                              <FaTimes />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <a href={`mailto:${user.email}`} className="text-blue-500 hover:underline">
                              {user.email}
                            </a>
                            <button
                              onClick={() =>
                                toggleEdit(user._id, user.username, user.email)
                              }
                              className="ml-2 text-blue-500 hover:text-blue-700"
                            >
                              <FaEdit />
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-2">
                        {user.isAdmin ? (
                          <FaCheck className="text-green-500" />
                        ) : (
                          <FaTimes className="text-red-500" />
                        )}
                      </td>
                      <td className="px-4 py-2">
                        {!user.isAdmin && (
                          <button
                            onClick={() => deleteHandler(user._id)}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                          >
                            <FaTrash />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

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
        </>
      )}
    </div>
  );
};

export default UserList;
