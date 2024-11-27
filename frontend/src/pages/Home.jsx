import { Link, useParams } from "react-router-dom";
import { useGetProductsQuery } from "../redux/api/productApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Header from "../components/Header";
import Product from "./Products/Product";

const Home = () => {
  const { keyword } = useParams();
  const { data, isLoading, isError } = useGetProductsQuery({ keyword });

  return (
    <>
      {!keyword ? <Header /> : null}
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant="danger">
          {isError?.data.message || isError.error}
        </Message>
      ) : (
        <>
          {/* Tiêu đề và nút "Shop" */}
          <div className="flex justify-between items-center px-[4rem] mt-[4rem]">
            <h1 className="text-4xl font-bold text-white mr-auto">Special Products</h1>
            <Link
              to="/shop"
              className="bg-red-600 text-white font-bold rounded-full py-2 px-10 hover:bg-red-700"
            >
              Shop
            </Link>
          </div>

          {/* Grid container cho danh sách sản phẩm */}
          <div className="grid grid-cols-4 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-6 justify-center mt-[2rem] px-[2rem]">
            {data.products.map((product) => (
              <div
                key={product._id}
                className="flex justify-center"
              >
                <Product product={product} />
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default Home;
