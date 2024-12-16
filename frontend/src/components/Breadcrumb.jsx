// src/components/Breadcrumb.js
import { Link, useLocation } from "react-router-dom";

const Breadcrumb = () => {
  const location = useLocation();
  const { pathname } = location;

  // Tách đường dẫn thành các phần
  const pathnames = pathname.split("/").filter((x) => x);

  return (
    <nav className=" text-gray-400 mb-4 ml-40">
      <ul className="flex items-center space-x-2">
        {/* Link Home */}
        <li>
          <Link to="/" className="hover:text-white">
            Home
          </Link>
        </li>

        {/* Hiển thị các phần của URL */}
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;

          return (
            <li key={index} className="flex items-center">
              <span className="mx-2">/</span>
              {isLast ? (
                <span className="text-white capitalize">{name}</span>
              ) : (
                <Link to={routeTo} className="hover:text-white capitalize">
                  {name}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Breadcrumb;
