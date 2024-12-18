import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const SmallProduct = ({ product }) => {
  return (
    <div style={{background: "#1A1A1A"}} className="w-[250px] m-4 p-4 rounded-lg shadow-md">
      <div className="relative">
        {/* Container ảnh */}
        <div className="w-[200px] h-[200px] mx-auto overflow-hidden flex justify-center items-center">
          <img
            src={product.image}
            alt={product.name}
            className="object-cover w-full h-full rounded"
          />
        </div>
        <HeartIcon product={product} />
      </div>

      {/* Thông tin sản phẩm */}
      <div className="p-2">
        <Link to={`/product/${product._id}`} className="no-underline">
          <h2 className="flex justify-between items-center text-white font-semibold text-sm">
            <span>{product.name}</span>
            <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              ${product.price}
            </span>
          </h2>
        </Link>
      </div>
    </div>
  );
};

export default SmallProduct;
