import { useGetTopProductsQuery } from "../redux/api/productApiSlice";
import Loader from "./Loader";
import Product from "../pages/Products/Product";
import ProductCarousel from "../pages/Products/ProductCarousel";

const PopularProducts = () => {
  const { data, isLoading, error } = useGetTopProductsQuery();

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <h1>ERROR</h1>;
  }

  return (
    <div className="px-[4rem] mt-[4rem]">

      <h1 className="text-4xl font-bold text-white mb-6 ml-40">
        Popular Products
      </h1>
      <div className="grid grid-cols-4 gap-7 ml-40 ">
        {data.map((product) => (
          <div key={product._id}>
            <Product product={product} />
          </div>
        ))}
      </div>
      <div className="ml-60 my-8">
        <ProductCarousel />
      </div>
    </div>


  );
};

export default PopularProducts;
