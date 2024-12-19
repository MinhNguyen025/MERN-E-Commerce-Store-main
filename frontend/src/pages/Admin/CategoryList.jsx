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
  const { data: categories, isLoading, isError, error } = useFetchCategoriesQuery();
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
    }, 300); // 300ms debounce

    return () => {
      clearTimeout(handler);
    };
  }, [searchKeyword]);

  // Filter categories based on debounced search keyword
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
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || "Updating category failed, try again.");
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;

    try {
      await deleteCategory(selectedCategory._id).unwrap();
      toast.success(`"${selectedCategory.name}" has been deleted.`);
      setSelectedCategory(null);
      setModalVisible(false);
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
          <div className="text-red-500">Error: {error?.data?.message || "Failed to load categories."}</div>
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
            className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
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
                <li key={category._id} className="flex items-center justify-between py-2 border-b border-gray-700 last:border-b-0">
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
              {debouncedSearch ? "No categories match your search." : "No categories available."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryList;
