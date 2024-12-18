// src/components/Breadcrumb.js
import { Link, useLocation } from "react-router-dom";

const Breadcrumb = ({ title }) => {
  const location = useLocation();
  const { pathname } = location;

  // Các đường dẫn không hiển thị Breadcrumb
  const hiddenPaths = ["/", "/login", "/register"];

  // Kiểm tra nếu đường dẫn hiện tại nằm trong hiddenPaths hoặc bắt đầu với "/product/" hoặc "/admin/"
  // Thay "shop/product" bằng "product" nếu route của bạn là "/product/:id"
  const isHidden =
    hiddenPaths.includes(pathname) ||
    pathname.startsWith("/product/") || // Ẩn breadcrumb khi ở product detail
    pathname.startsWith("/admin/");

  if (isHidden) {
    return null;
  }

  // Danh sách các phân đoạn đường dẫn cần bỏ qua trong Breadcrumb
  const hiddenBreadcrumbs = ["admin"];

  // Bản đồ định tuyến tùy chỉnh cho các phân đoạn đặc biệt
  const breadcrumbNameMap = {
    product: "/shop", // Nếu bạn muốn "Product" link về "/shop"
    // Thêm các định tuyến tùy chỉnh khác nếu cần
  };

  // Tách đường dẫn thành các phần
  const pathnames = pathname.split("/").filter((x) => x);

  return (
    <nav className="text-gray-400 mb-4 ml-40">
      <ul className="flex items-center space-x-2">
        {/* Link Home */}
        <li>
          <Link to="/" className="hover:text-white">
            Home
          </Link>
        </li>

        {/* Hiển thị các phần của URL */}
        {pathnames.map((name, index) => {
          // Bỏ qua các phân đoạn cần ẩn
          if (hiddenBreadcrumbs.includes(name)) {
            return null;
          }

          const isLast = index === pathnames.length - 1;

          // Kiểm tra nếu phân đoạn hiện tại có trong bản đồ định tuyến tùy chỉnh
          const mappedPath = breadcrumbNameMap[name];
          // Nếu có, sử dụng đường dẫn tùy chỉnh; nếu không, sử dụng đường dẫn mặc định
          const routeTo = mappedPath
            ? mappedPath
            : `/${pathnames.slice(0, index + 1).join("/")}`;

          // Tùy chỉnh tên hiển thị nếu cần
          let displayName = name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, " ");

          // Nếu đây là phần cuối và có title, sử dụng title thay vì name
          if (isLast && title) {
            displayName = title;
          }

          return (
            <li key={index} className="flex items-center">
              <span className="mx-2">/</span>
              {isLast ? (
                <span className="text-white capitalize">{displayName}</span>
              ) : (
                <Link to={routeTo} className="hover:text-white capitalize">
                  {displayName}
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
