import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const Product = ({ product }) => {
  return (
    <div className="w-full max-w-[18rem] p-3 bg-[#1e1e1e] rounded-lg shadow-lg flex flex-col justify-between">
      {/* Hình ảnh sản phẩm */}
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-[12rem] object-cover rounded-t-lg"
        />
        <HeartIcon product={product} className="absolute top-2 right-2" />
      </div>

      {/* Nội dung sản phẩm */}
      <div className="p-4">
        {/* Tên sản phẩm */}
        <Link to={`/product/${product._id}`}>
          <h2 className="text-lg font-bold text-white truncate">{product.name}</h2>
        </Link>

        {/* Giá sản phẩm */}
        <div className="mt-2">
          <span className="bg-red-100 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
            $ {product.price}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Product;
