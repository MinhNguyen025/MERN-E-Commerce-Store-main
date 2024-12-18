// AdminProductUpdate.jsx
import { useState, useEffect } from "react";
import AdminMenu from "./AdminMenu";
import { useNavigate, useParams } from "react-router-dom";
import {
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductByIdQuery,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";

const AdminProductUpdate = () => {
  const params = useParams();
  const navigate = useNavigate();

  // Fetch product by ID
  const { data: productData, isLoading: isLoadingProduct, error: errorProduct } = useGetProductByIdQuery(params._id);

  // Fetch categories
  const { data: categories = [], isLoading: isLoadingCategories, error: errorCategories } = useFetchCategoriesQuery();

  // Define mutations
  const [uploadProductImage] = useUploadProductImageMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  // State variables
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState(0);

  // Set form fields when productData is fetched
  useEffect(() => {
    if (productData && productData._id) {
      setName(productData.name);
      setDescription(productData.description);
      setPrice(productData.price);
      setCategory(productData.category?._id || "");
      setQuantity(productData.quantity);
      setBrand(productData.brand);
      setImage(productData.image);
      setStock(productData.countInStock);
    }
  }, [productData]);

  // Handle image upload
  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success("Image uploaded successfully!", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
      setImage(res.image);
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || "Image upload failed.", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !price || !category || !brand || !description) {
      toast.error("Please fill in all required fields.", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("quantity", quantity);
      formData.append("brand", brand);
      formData.append("countInStock", stock);

      const response = await updateProduct({ productId: params._id, formData }).unwrap();

      toast.success("Product updated successfully!", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
      navigate("/admin/allproductslist");
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || "Product update failed. Try again.", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    }
  };

  // Handle product deletion
  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    try {
      const response = await deleteProduct(params._id).unwrap();
      toast.success(`"${response.name}" has been deleted.`, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
      navigate("/admin/allproductslist");
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || "Delete failed. Try again.", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    }
  };

  // Loading and error states
  if (isLoadingProduct || isLoadingCategories) {
    return <div className="container mx-auto p-6">Loading...</div>;
  }

  if (errorProduct || errorCategories) {
    return (
      <div className="container mx-auto p-6">
        <p className="text-red-500">Failed to load product or categories.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Admin Menu */}
        <AdminMenu />

        {/* Update/Delete Form */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-6 text-center text-white">Update / Delete Product</h1>

          {/* Display Uploaded Image */}
          {image && (
            <div className="text-center mb-6">
              <img
                src={image}
                alt="Uploaded Product"
                className="mx-auto max-h-[200px] rounded-lg shadow"
              />
            </div>
          )}

          {/* Upload Image */}
          <div className="mb-6">
            <label className="border text-white px-4 block w-full text-center rounded-lg cursor-pointer font-bold py-4 bg-[#2E2D2D]">
              {image ? "Change Image" : "Upload Image"}
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={uploadFileHandler}
                className="hidden"
              />
            </label>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block mb-2 text-white">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="p-3 w-full border rounded-lg bg-[#101011] text-white"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Price */}
            <div>
              <label htmlFor="price" className="block mb-2 text-white">
                Price
              </label>
              <input
                type="number"
                id="price"
                className="p-3 w-full border rounded-lg bg-[#101011] text-white"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>

            {/* Quantity */}
            <div>
              <label htmlFor="quantity" className="block mb-2 text-white">
                Quantity
              </label>
              <input
                type="number"
                id="quantity"
                min="1"
                className="p-3 w-full border rounded-lg bg-[#101011] text-white"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </div>

            {/* Brand */}
            <div>
              <label htmlFor="brand" className="block mb-2 text-white">
                Brand
              </label>
              <input
                type="text"
                id="brand"
                className="p-3 w-full border rounded-lg bg-[#101011] text-white"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                required
              />
            </div>

            {/* Count In Stock */}
            <div>
              <label htmlFor="stock" className="block mb-2 text-white">
                Count In Stock
              </label>
              <input
                type="number"
                id="stock"
                className="p-3 w-full border rounded-lg bg-[#101011] text-white"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block mb-2 text-white">
                Category
              </label>
              <select
                id="category"
                className="p-3 w-full border rounded-lg bg-[#101011] text-white"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="" disabled>
                  Choose Category
                </option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label htmlFor="description" className="block mb-2 text-white">
                Description
              </label>
              <textarea
                id="description"
                className="p-3 w-full border rounded-lg bg-[#101011] text-white"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="4"
                required
              ></textarea>
            </div>
          </form>

          {/* Buttons */}
          <div className="flex justify-between mt-6">
            <button
              onClick={handleSubmit}
              disabled={isUpdating}
              className="py-3 px-6 w-full md:w-1/2 bg-green-600 rounded-lg text-lg font-bold text-white hover:bg-green-700 transition duration-300"
            >
              {isUpdating ? "Updating..." : "Update"}
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="py-3 px-6 w-full md:w-1/2 bg-red-600 rounded-lg text-lg font-bold text-white hover:bg-red-700 transition duration-300 mt-4 md:mt-0 md:ml-4"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProductUpdate;
