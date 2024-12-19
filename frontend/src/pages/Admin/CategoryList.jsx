// src/pages/Admin/CategoryList.jsx

import { useState, useEffect } from "react";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useFetchCategoriesQuery,
} from "../../redux/api/categoryApiSlice";

import { toast } from "react-toastify";
import CategoryForm from "../../components/CategoryForm";
import Modal from "../../components/Modal";
import AdminMenu from "./AdminMenu";
import { FiEdit, FiTrash2, FiPlus, FiSearch } from "react-icons/fi";
import { ClipLoader } from "react-spinners";

const CategoryList = () => {
  // Trạng thái phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10); // Số mục mỗi trang
  const [totalPages, setTotalPages] = useState(1);

  // Truy vấn danh sách danh mục với phân trang
  const { data, isLoading, isError, error } = useFetchCategoriesQuery({
    page: currentPage,
    limit,
  });

  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

  const [name, setName] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [updatingName, setUpdatingName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState(searchKeyword);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchKeyword);
      setCurrentPage(1); // Reset về trang đầu khi tìm kiếm
    }, 300); // 300ms debounce

    return () => {
      clearTimeout(handler);
    };
  }, [searchKeyword]);

  // Trích xuất dữ liệu và phân trang từ phản hồi
  const categories = data?.categories || [];
  const pagination = data?.pagination || {};

  useEffect(() => {
    setTotalPages(pagination.pages || 1);
  }, [pagination.pages]);

  // Lọc danh mục dựa trên từ khóa tìm kiếm đã debounce
  const filteredCategories = categories?.filter((category) =>
    category.name.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const handleCreateCategory = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      const result = await createCategory({ name: name.trim() }).unwrap();
      setName("");
      toast.success(`"${result.name}" has been created.`);
      // Tự động làm mới danh sách sau khi tạo
      // Bạn có thể sử dụng refetch nếu cần
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || "Creating category failed, try again.");
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();

    if (!updatingName.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      const result = await updateCategory({
        categoryId: selectedCategory._id,
        updatedCategory: { name: updatingName.trim() },
      }).unwrap();

      toast.success(`"${result.name}" has been updated.`);
      setSelectedCategory(null);
      setUpdatingName("");
      setModalVisible(false);
      // Tự động làm mới danh sách sau khi cập nhật
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || "Updating category failed, try again.");
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${selectedCategory.name}"? This action cannot be undone.`
    );

    if (!confirmDelete) return;

    try {
      await deleteCategory(selectedCategory._id).unwrap();
      toast.success(`"${selectedCategory.name}" has been deleted.`);
      setSelectedCategory(null);
      setModalVisible(false);
      // Tự động làm mới danh sách sau khi xóa
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || "Deleting category failed, try again.");
    }
  };

  const openEditModal = (category) => {
    setSelectedCategory(category);
    setUpdatingName(category.name);
    setModalVisible(true);
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

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
      if (currentPage <= 3) {
        // Khi ở trang 1, 2, 3
        pages.push(1, 2, 3, "...", lastPage);
      } else if (currentPage >= lastPage - 2) {
        // Khi ở các trang cuối
        pages.push(1, "...", lastPage - 2, lastPage - 1, lastPage);
      } else {
        // Khi ở giữa
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", lastPage);
      }
    }

    return pages;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#1A1A1A]">
        <ClipLoader size={50} color="#2563EB" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="ml-[10rem] flex flex-col md:flex-row bg-[#1A1A1A] min-h-screen">
        <AdminMenu />
        <div className="md:w-3/4 p-3">
          <div className="text-red-500">
            Error: {error?.data?.message || "Failed to load categories."}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ml-[10rem] flex flex-col md:flex-row bg-[#1A1A1A] min-h-screen text-white">
      <AdminMenu />
      <div className="md:w-3/4 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Manage Categories</h1>
          <button
            onClick={() => {
              setModalVisible(true);
              setSelectedCategory(null);
              setName("");
            }}
            className="flex items-center bg-[#DC2626] text-white px-4 py-2 rounded hover:#B91C1C transition"
          >
            <FiPlus className="mr-2" /> Add Category
          </button>
        </div>

        {/* Create Category Modal */}
        <Modal
          isOpen={modalVisible && !selectedCategory}
          onClose={() => {
            setModalVisible(false);
            setSelectedCategory(null);
            setName("");
          }}
        >
          <CategoryForm
            title="Add New Category"
            value={name}
            setValue={setName}
            handleSubmit={handleCreateCategory}
            buttonText="Create"
            isLoading={isCreating}
          />
        </Modal>

        {/* Update/Delete Category Modal */}
        <Modal
          isOpen={modalVisible && selectedCategory}
          onClose={() => {
            setModalVisible(false);
            setSelectedCategory(null);
            setUpdatingName("");
          }}
        >
          <CategoryForm
            title="Edit Category"
            value={updatingName}
            setValue={setUpdatingName}
            handleSubmit={handleUpdateCategory}
            buttonText="Update"
            handleDelete={handleDeleteCategory}
            isLoading={isUpdating || isDeleting}
          />
        </Modal>

        {/* Search Bar */}
        <div className="mb-4 flex items-center">
          <FiSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search categories..."
            className="border border-gray-600 bg-gray-800 text-white placeholder-gray-400 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        </div>

        {/* Categories List */}
        <div className="shadow rounded-lg p-4 bg-black">
          {filteredCategories && filteredCategories.length > 0 ? (
            <ul>
              {filteredCategories.map((category) => (
                <li
                  key={category._id}
                  className="flex items-center justify-between py-2 border-b border-gray-700 last:border-b-0"
                >
                  <span className="text-white">{category.name}</span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openEditModal(category)}
                      className="flex items-center text-yellow-500 hover:text-yellow-600"
                      aria-label={`Edit ${category.name}`}
                    >
                      <FiEdit />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedCategory(category);
                        setModalVisible(true);
                      }}
                      className="flex items-center text-red-500 hover:text-red-600"
                      aria-label={`Delete ${category.name}`}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center text-gray-400 py-10">
              {debouncedSearch
                ? "No categories match your search."
                : "No categories available."}
            </div>
          )}

          {/* Pagination Controls */}
          {pagination.pages > 1 && (
            <div className="flex flex-col items-center mt-6">
              {/* Các nút trang */}
              <div className="flex justify-center space-x-2">
                {/* Nút Trang Đầu */}
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded ${
                    currentPage === 1
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gray-200 text-gray-700 border-gray-300 hover:bg-red-100 hover:border-red-400"
                  }`}
                >
                  «
                </button>

                {/* Nút Trang Trước */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded ${
                    currentPage === 1
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
                    className={`px-3 py-1 rounded ${
                      pageNumber === currentPage
                        ? "bg-red-600 text-white cursor-default"
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
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded ${
                    currentPage === totalPages
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gray-200 text-gray-700 border-gray-300 hover:bg-red-100 hover:border-red-400"
                  }`}
                >
                  ›
                </button>

                {/* Nút Trang Cuối */}
                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded ${
                    currentPage === totalPages
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gray-200 text-gray-700 border-gray-300 hover:bg-red-100 hover:border-red-400"
                  }`}
                >
                  »
                </button>
              </div> 

              {/* Jump to Specific Page */}
              <div className="flex items-center space-x-2 mt-2">
                <span>Go to page:</span>
                <input
                  type="number"
                  min="1"
                  max={totalPages}
                  value={currentPage}
                  onChange={(e) => {
                    let page = parseInt(e.target.value);
                    if (isNaN(page)) page = 1;
                    handlePageChange(page);
                  }}
                  className="border border-gray-600 bg-gray-800 text-white placeholder-gray-400 rounded px-2 py-1 w-16 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Displaying Current Range */}
              <div className="flex justify-center items-center mt-4">
                <span className="text-gray-400">
                  Showing {(currentPage - 1) * limit + 1} to{" "}
                  {Math.min(currentPage * limit, pagination.total)} of {pagination.total} categories
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryList;
