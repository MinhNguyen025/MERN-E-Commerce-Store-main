import { Link } from "react-router-dom";

const ProductDetailBreadcrumb = ({ productName }) => {
  return (
    <nav className="text-gray-400 mb-4 ml-40">
      <ul className="flex items-center space-x-2">
        <li>
          <Link to="/" className="hover:text-white">
            Home
          </Link>
        </li>
        <li className="flex items-center">
          <span className="mx-2">/</span>
          <Link to="/shop" className="hover:text-white capitalize">
            Shop
          </Link>
        </li>
        <li className="flex items-center">
          <span className="mx-2">/</span>
          <span className="text-white capitalize">{productName}</span>
        </li>
      </ul>
    </nav>
  );
};

export default ProductDetailBreadcrumb;
