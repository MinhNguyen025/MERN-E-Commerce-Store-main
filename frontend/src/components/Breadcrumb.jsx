import { Link, useLocation } from "react-router-dom";

const Breadcrumb = ({ productName }) => {
  const location = useLocation();

  return (
    <nav className="breadcrumb-container text-sm text-gray-400 mb-4 ml-60">        
        <ul className="flex items-center space-x-2">
            <li>
            <Link to="/" className="hover:text-white">
                Home
            </Link>
            </li>
            <li>
            <span className="mx-2">/</span>
            <Link to="/shop" className="hover:text-white">
                Shop
            </Link>
            </li>
            {productName && (
            <li>
                <span className="mx-2">/</span>
                <span className="text-white">{productName}</span>
            </li>
            )}
        </ul>
    </nav>

  );
};

export default Breadcrumb;
